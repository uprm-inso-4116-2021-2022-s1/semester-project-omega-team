using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Data;
using OmegaSpot.Backend.Requests;

namespace OmegaSpot.Backend.Controllers {

    /// <summary>Controller that handles all reservation operations</summary>
    [Route("Reservation")]
    [ApiController]
    public class ReservationsController : Controller {

        /// <summary>Context handling all DB operations</summary>
        private readonly SpotContext _context;

        /// <summary>Creates a Reservation Controller</summary>
        /// <param name="context"></param>
        public ReservationsController(SpotContext context) { _context = context; }

        /// <summary>Creates a reservation with given details from the create reservation request</summary>
        /// <param name="Request"></param>
        /// <returns>Reservation object representing created reservation</returns>
        [HttpPost]
        public async Task<IActionResult> CreateReservation(CreateReservationRequest Request) {

            //Let's do a little validation before any of this:
            if (Request.StartTime > Request.EndTime) { return BadRequest("Start time cannot be after end time"); } //Check Start and end time are valid
            if (Request.StartTime < DateTime.Now.AddSeconds(30)) { return BadRequest("Reservation cannot be in the past!"); } //Check start time is not in the past
            if (Request.EndTime - Request.StartTime < new TimeSpan(0,15,0)) { return BadRequest("Reservations cannot be less than 15 minutes in length"); } //Check that the reservation is at least 15 minutes long

            //Get the session
            Session S = SessionManager.Manager.FindSession(Request.SessionID); 
            if (S == null) { return Unauthorized("Invalid session"); } 

            //Get the spot
            Spot Spot = await _context.Spot.Include(S=>S.Business).FirstOrDefaultAsync(S=>S.ID==Request.SpotID); 
            if (Spot == null) { return NotFound("Spot was not found"); }

            //If the spot is not open all the time
            if (!Spot.Business.Is24Hours) {
                //Ensure the start time is between open and close time
                if (!TimeBetween(Spot.Business.OpenTime, Spot.Business.CloseTime, Request.StartTime) ||
                    !TimeBetween(Spot.Business.OpenTime, Spot.Business.CloseTime, Request.EndTime)) {
                    return BadRequest("Reservation starts or ends outside of business hours");
                }

                //Ensure the start and end time of this request are on the same day of the same month of the same year
                if (!DatesSame(Request.StartTime, Request.EndTime)) {
                    return BadRequest("Multi-Day reservations are not allowed on stores not open 24 hours. Please split your reservation into multiple for each given day.");
                }
            } //Else we don't need to because any time will be valid according to business open/close times


            //Check if any conflict with the reservation
            bool Conflicts = await _context.Reservation.AnyAsync(R=> R.Spot.ID==Request.SpotID && (
                                                                (R.StartTime > Request.StartTime && R.StartTime < Request.EndTime) ||
                                                                (R.EndTime > Request.StartTime && R.EndTime < Request.EndTime)
                                                            ));

            if (Conflicts) { return BadRequest("Reservation conflicts with existing reservation for this spot"); }

            //Create the reservation
            Reservation R = new() {
                Reason = Request.Reason,
                StartTime = Request.StartTime,
                EndTime = Request.EndTime,
                Spot = Spot,
                User = await _context.User.FindAsync(S.UserID),
                Status = Spot.Business.ReservationsRequireApproval ? ReservationStatus.PENDING : ReservationStatus.APPROVED
            };

            //Add and save to the db
            _context.Add(R);
            await _context.SaveChangesAsync();

            return Ok(R);
        }

        /// <summary>Updates a reservation's state (checking that the transition is allowed based on current state and executing party)</summary>
        /// <param name="Request"></param>
        /// <returns>Updated reservation object</returns>
        [HttpPut]
        public async Task<IActionResult> UpdateReservation(UpdateReservationRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness(S); //May or may not be necessary

            //ok now load the reservation
            Reservation R = await _context.Reservation
                .Include(R => R.Spot).ThenInclude(S => S.Business)
                .Include(R => R.User)
                .FirstOrDefaultAsync(R => R.ID == Request.ReservationID);
            if (R == null) { return NotFound("Reservation was not found"); }

            R.AdvanceReservation();

            switch (Request.NewStatus) {
                case ReservationStatus.DENIED:
                case ReservationStatus.APPROVED:
                    //Ensure the user is a business owner and that they own the business that the spot being reserved is in
                    if (B == null) { return Unauthorized("Only a business may change a reservation to this state"); }
                    if (B.ID != R.Spot.Business.ID) { return Unauthorized("Session does not own business the spot this reservation is reserving belongs to"); }

                    //Ensure the reservation is currently pending
                    if (R.Status != ReservationStatus.PENDING) { return BadRequest("Reservation is not currently pending"); }

                    break;
                case ReservationStatus.IN_PROGRESS:
                    //Ensure the user is the owner of the reservation
                    if (S.UserID != R.User.Username) { return Unauthorized("User does not own reservation"); }

                    //Ensure the reservation is currently APPROVED
                    if (R.Status != ReservationStatus.APPROVED) { return BadRequest("Reservation is not currently approved"); }

                    //Ensure it is a valid time to check in
                    if (DateTime.Now > R.StartTime.AddMinutes(-5)) { return BadRequest("It is too early to check in"); }

                    break;
                case ReservationStatus.COMPLETED:
                    //Ensure the user is the owner of the reservation
                    if (S.UserID != R.User.Username) { return Unauthorized("User does not own reservation"); }

                    //Ensure the reservation is currently IN_PROGRESS
                    if (R.Status != ReservationStatus.IN_PROGRESS) { return BadRequest("Reservation is not currently In Progress"); }

                    break;
                case ReservationStatus.CANCELLED:
                    if (B != null && B.ID != R.Spot.Business.ID) {
                        //The appropriate business user is attempting to make the change
                        if (R.Status == ReservationStatus.PENDING) { return BadRequest("Pending reservations cannot be canceled by the business owner. Consider DENIED instead"); }
                        if (R.Status != ReservationStatus.APPROVED) { return BadRequest("Reservation is not in a state that can be canceled"); }
                    } else if (S.UserID == R.User.Username) {
                        //The request is coming from the user
                        if (R.Status != ReservationStatus.APPROVED && R.Status != ReservationStatus.PENDING) { return BadRequest("Reservation is not in a state that can be canceled"); }
                    } else {
                        return Unauthorized("Session is not business owner or reservation owner");
                    }
                    break;
                default:
                    return BadRequest("Cannot change reservation to given state through this route");
            }

            //Mark the reservation as the requested state
            R.Status = Request.NewStatus;

            //Save the reservation
            _context.Update(R);
            await _context.SaveChangesAsync();

            //Return the reservation
            return Ok(R);

        }

        /// <summary>Administrative command to advance all reservations in the database</summary>
        /// <returns>Nothing</returns>
        [HttpGet("Advance")]
        public async Task<IActionResult> AdvanceAllReservations() {

            var Reservations = await _context.Reservation.Where(R=>
                                        R.Status!=ReservationStatus.COMPLETED &&
                                        R.Status != ReservationStatus.CANCELLED &&
                                        R.Status != ReservationStatus.DENIED &&
                                        R.Status != ReservationStatus.MISSED)
                                    .ToListAsync(); //Get all reservations that are not in final states

            Reservations.ForEach(R => R.AdvanceReservation()); //Advance them if needed
            _context.UpdateRange(Reservations); //Update
            await _context.SaveChangesAsync(); //Save

            //Adios
            return Ok();
        }

        #region Helper Functions

        /// <summary>Helper function to get the business owned by the user tied to given business</summary>
        /// <param name="S"></param>
        /// <returns></returns>
        private async Task<Business> GetSessionBusiness(Session S) {
            User U = await _context.User.FirstOrDefaultAsync(U => U.Username == S.UserID);
            //actually we can assume a user just exists since they logged on
            if (!U.IsOwner) { return null; }

            return await _context.Business.FirstOrDefaultAsync(B => B.Owner.Username == U.Username);
        }

        /// <summary>Checks that the dates (months, year, and day) of two datetimes are the same (Ignores time)</summary>
        /// <param name="Start"></param>
        /// <param name="End"></param>
        /// <returns></returns>
        private bool DatesSame(DateTime Start, DateTime End) { return Start.Year == End.Year && Start.Month == End.Month && Start.Day == End.Day; }

        /// <summary>Checks that a given time is between the start and end time. Ignores Date</summary>
        /// <param name="Start"></param>
        /// <param name="End"></param>
        /// <param name="Time"></param>
        /// <returns></returns>
        private bool TimeBetween(DateTime Start, DateTime End, DateTime Time) {

            //Lets create a copy of each datetime with the day instead being `now`
            DateTime TodayStart, TodayEnd, TodayTime;
            TodayStart = MakeToday(Start);
            TodayEnd = MakeToday(End);
            TodayTime = MakeToday(Time);
            return TodayStart < TodayTime && TodayTime < TodayEnd;

        }

        /// <summary>Makes a copy of the datetime with the month, year, and day of today. Preserves its time.</summary>
        /// <param name="Time"></param>
        /// <returns></returns>
        private DateTime MakeToday(DateTime Time) { return new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, Time.Hour, Time.Minute, Time.Second); }

        #endregion

    }
}
