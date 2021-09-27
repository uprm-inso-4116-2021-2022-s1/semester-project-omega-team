using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Data;
using OmegaSpot.Backend.Requests;

namespace OmegaSpot.Backend.Controllers {

    [Route("User")] //This is the route the URL needs to go to
    [ApiController] //This indicates there's an API Controller 
    public class UsersController: Controller {
        private readonly SpotContext _context;

        public UsersController(SpotContext context) { _context = context; }

        //This region contains everything to do with Logging in, Logging out, and changing passwords
        #region Auth

        // POST: Auth
        [HttpPost("Auth")]
        public async Task<IActionResult> LogIn(UserAuthRequest U) {
            if (string.IsNullOrEmpty(U.Username)) { return BadRequest("Blank User Auth object"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(U.Username);
            if (DBU == null) { return Ok(Guid.Empty); }

            if (DBU.Equals(U)) {
                //Log in
                return Ok(SessionManager.Manager.LogIn(U.Username));
            }

            //Otherwise return an empty guid
            return Ok(Guid.Empty);
        }

        //POST: Auth/Out
        [HttpPost("Auth/Out")]
        public async Task<IActionResult> LogOut(Guid SessionID) {
            return Ok(SessionManager.Manager.LogOut(SessionID));
        }

        //POST: Auth/Out
        [HttpPost("Auth/OutAll")]
        public async Task<IActionResult> LogOutAll(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            return Ok(SessionManager.Manager.LogOutAll(S.UserID));
        }

        // PUT: Auth
        [HttpPut("Auth")]
        public async Task<IActionResult> ChangePassword(PasswordChangeRequest PCR) {
            if (PCR.SessionID == Guid.Empty) { return BadRequest("Blank Session ID"); }

            //Find Session
            Session S = SessionManager.Manager.FindSession(PCR.SessionID);
            if (S == null) { return BadRequest("Session ID not found"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(S.UserID);
            if (DBU.Password != PCR.CurrentPassword) { return BadRequest("Password did not match"); }

            //OK go for change
            DBU.Password = PCR.NewPassword;
            _context.Update(DBU);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        #endregion

        //This region handles other changes to a users account. Right now its only name. Perhaps in the future it'll include phone number? Email? Who knows
        #region Manage User Account

        //Hey maybe if someone could find a better anme for this I'd appreciate it

        // POST: ChangeName
        [HttpPost("ChangeName")]
        public async Task<IActionResult> ChangeName(NameChangeRequest NCR) {

            if (NCR.SessionID == Guid.Empty) { return BadRequest("Blank Session ID"); }

            //Find Session
            Session S = SessionManager.Manager.FindSession(NCR.SessionID);
            if (S == null) { return BadRequest("Session ID not found"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(S.UserID);

            //OK go for change
            DBU.Name = NCR.NewName;
            _context.Update(DBU);
            await _context.SaveChangesAsync();

            return Ok(true);

        }

        #endregion

        //This region handles management of notifications
        #region Manage Notifications

        [HttpPost("Notif")]
        public async Task<IActionResult> GetNotifs(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Load Notif
            List<Notification> Ns = await _context.Notification
                .Where(N => N.User.Username == S.UserID && !N.Read).ToListAsync();
            if (Ns == null) { return NotFound(); }

            return Ok(Ns);
        }

        //POST Notif/5
        [HttpPost("Notif/{NotifID}")]
        public async Task<IActionResult> ReadNotif(Guid NotifID, [FromBody] Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Load Notif
            Notification N = await _context.Notification
                .Include(N => N.User)
                .FirstOrDefaultAsync(N => N.ID == NotifID);
            if (N == null) { return NotFound(); }

            if (N.User.Username != S.UserID) { return Unauthorized("Notification does not belong to this user"); }
            N.Read = true;

            _context.Update(N);
            await _context.SaveChangesAsync();
            return Ok(N);
        }

        //POST Notif/All
        [HttpPost("Notif/all")]
        public async Task<IActionResult> ReadNotifAll(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Load Notif
            List<Notification> Ns = await _context.Notification
                .Where(N => N.User.Username == S.UserID && !N.Read).ToListAsync();
            if (Ns == null) { return NotFound(); }

            int UpdatedNotifs = 0;

            foreach (var N in Ns) {
                N.Read = true;
                _context.Update(N);
                UpdatedNotifs++;
            }

            await _context.SaveChangesAsync();
            return Ok(UpdatedNotifs);
        }

        //DELTE Notif
        [HttpDelete("Notif")]
        public async Task<IActionResult> ReadNotifDel(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Load Notif
            HashSet<Notification> Ns = _context.Notification
                .Where(N => N.User.Username == S.UserID && N.Read).ToHashSet();
            if (Ns == null) { return NotFound(); }

            _context.RemoveRange(Ns);

            await _context.SaveChangesAsync();
            return Ok(Ns.Count);
        }

        #endregion

        //This region handles the getting of user details
        #region User Details

        [HttpPost]
        public async Task<IActionResult> UserDetails(Guid SessionID) {

            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(S.UserID);

            return Ok(DBU);
        }

        [HttpPost("Reservations")]
        public async Task<IActionResult> UserReservations(Guid SessionID) {

            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Find Reservations
            List<Reservation> DBU = await _context.Reservation
                .Include(R => R.Spot).ThenInclude(S => S.Business)
                .OrderBy(R => R.Status)
                .ToListAsync();

            return Ok(DBU);
        }

        [HttpPost("Business")]
        public async Task<IActionResult> UserBusiness(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(S.UserID);

            if (!DBU.IsOwner) { return BadRequest("User is not a business owner"); }

            //Let's find their business
            Business B = await _context.Business.FirstOrDefaultAsync(B => B.Owner.Username == DBU.Username);
            if (B == null) { return NotFound("Although the user is a business owner, a business with them as the owner has not been found. Perhaps it has not been setup yet"); }

            return Ok(B);
        }

        #endregion

    }
}
