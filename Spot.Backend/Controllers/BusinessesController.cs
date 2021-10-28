﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Data;

namespace OmegaSpot.Backend.Controllers {

    [Route("Business")] //This indicates the URL Route to bind this controler to. Suppose our address is http://localhost : this controller will be mapped to http://localhost/Business
    [ApiController] //This indicates this is an API Controller
    public class BusinessesController: Controller {

        /// <summary>Connection to the Spot database and its tables</summary>
        private readonly SpotContext _context;

        /// <summary>Constructor to create the controller</summary>
        /// <param name="context"></param>
        public BusinessesController(SpotContext context) { _context = context; }

        /// <summary>Gets all businesses in the database</summary>
        /// <returns></returns>
        [HttpGet("")] //This indicates the URL route to this method in this controler. Heere we leave it blank, so executing a GET on /Business will execute this method.
        public async Task<IActionResult> GetBusinesses() {

            //Let's get a list of all businesses
            List<Business> Bs = await _context.Business.ToListAsync(); //We ask the context to get us a list of all businesses asynchronously.

            //Now we return it with status OK to let the front-end know its OK
            return Ok(Bs);
        }

        /// <summary>Gets busines with specified ID</summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpGet("{ID}")] //Here we specify that ID is a part of the URL. So for instance, if we want to get business 1, we'd go to URL /Business/1
        public async Task<IActionResult> GetBusiness(Guid ID) {

            //Let's get the business with the given ID. We could use FindAsync(), but since I want to include who owns this business,
            //We need to use FirstOrDefaultAsync(), to add an Include()

            Business B = await _context.Business
                .Include(B => B.Owner) //Include specifies to the controller that we want a field whose data is on another table. The syntax to do this is a Predicate.                                    
                .FirstOrDefaultAsync(B => B.ID == ID);

            if (B == default(Business)) { return NotFound(); } //If the operation results in the default of the object, return NotFound
            return Ok(B); //Otherwise, we found it, and we can return it with OK()
        }

        //Other methods in the controller can use HttpPost, HttpPut, HttpDelete, and so on.
        //We can also specify to get arguments from the HTTP Body on POST/Put requests, or from a query string (Though make sure to include a default value!)

        /// <summary>Gets spots that belong to specified business</summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpGet("{ID}/Spots")]
        public async Task<IActionResult> GetBusinessSpots(Guid ID) {

            //This *Should* really be an INCLUDE rather than a separate method, but it is not possible. We need to have spots show what business they belong to.
            //When we ask to Include spots, from here, it will create a circular loop, making it impossible for the JSON Serializer to serialize the business.

            //Therefore as a safety measure, the list of spots is [JSONIgnore]-ed. So if we want to get a list of a business's spots, we need a separate method.
            
            //This problem persists on a few other objects given how interconnected they are. 

            List<Spot> Spots = await _context.Spot
                .Where(S => S.Business.ID == ID) //Here to make sure the list only contains those we need, we use a Where()
                .ToListAsync();                  //Note how we can search subfields without including the field

            //Now we return the list, even if it's empty, it doesn't really matter.
            return Ok(Spots);
        }

        /// <summary>Gets reservations for a user's business (if they're an owner)</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
        [HttpPost("Reservations")]
        public async Task<IActionResult> GetBusinessReservations([FromBody] Guid SessionID, [FromQuery] ReservationStatus? Status) {

            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness(S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            //OK, now that we've got this

            if (Status == null) {
                var Res = await _context.Reservation
                    .Include(R => R.Spot)
                    .Include(R => R.User)
                    .Where(R => R.Spot.Business.ID == B.ID)
                    .OrderByDescending(r => r.StartTime)
                    .ToListAsync();
    
                foreach (Reservation R in Res) { R.AdvanceReservation(); }

                return Ok(Res);
            }

            //We have a specified status we must attend to
            var StatusRes = await _context.Reservation
                .Include(R => R.Spot)
                .Include(R => R.User)
                .Where(R => R.Spot.Business.ID == B.ID && R.Status==Status.Value)
                .OrderByDescending(r => r.StartTime)
                .ToListAsync();

            if (Status != ReservationStatus.COMPLETED &&
                Status != ReservationStatus.CANCELLED &&
                Status != ReservationStatus.DENIED &&
                Status != ReservationStatus.MISSED) {

                var RealRes = new List<Reservation>();

                foreach (Reservation R in StatusRes) {
                    R.AdvanceReservation();
                    if (R.Status == Status) { RealRes.Add(R); }  //Status has not advanced
                    else { _context.Update(R); } //The status has advanced
                }

                await _context.SaveChangesAsync();

                return Ok(RealRes);
            }

            return Ok(StatusRes);

        }

        /// <summary>Gets reservations for a user's business (if they're an owner)</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
        [HttpPost("ReservationsCount")]
        public async Task<IActionResult> GetBusinessReservationsCount([FromBody] Guid SessionID, [FromQuery] DateTime? StartRange, [FromQuery] DateTime? EndRange) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness(S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            DateTime Start = StartRange ?? DateTime.MinValue;
            DateTime End = EndRange ?? DateTime.Now;

            Type ElEnum = typeof(ReservationStatus);

            var Count = await _context.Reservation
                .Where(R => R.Spot.Business.ID == B.ID &&
                    R.StartTime > Start &&
                    R.StartTime < End)
                .GroupBy(R => R.Status)
                .OrderBy(R => R.Key)
                .Select(R => new { Status = Enum.GetName(ElEnum, R.Key), Count = R.Count() })
                .ToListAsync();
            return Ok(Count);
        }

        [HttpPost("SpotStatistics")]
        public async Task<IActionResult> GetSpotBySpotStatistics([FromBody] Guid SessionID, [FromQuery] DateTime? StartRange, [FromQuery] DateTime? EndRange) {
            return Ok();

        }

        private async Task<Business> GetSessionBusiness(Session S) {
            User U = await _context.User.FirstOrDefaultAsync(U => U.Username == S.UserID);
            //actually we can assume a user just exists since they logged on
            if (!U.IsOwner) { return null; }

            return await _context.Business.FirstOrDefaultAsync(B => B.Owner.Username == U.Username);
        }


    }
}
