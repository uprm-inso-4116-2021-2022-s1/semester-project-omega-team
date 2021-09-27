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

        /// <summary>Attempts to sign in a user by checking if the user exists, and if their password matches with the one given</summary>
        /// <param name="U"></param>
        /// <returns><see cref="Guid.Empty"/> if the username or password were not found, or a new guid if a session was registered</returns>
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

        /// <summary>Attempts to log out a user, by removing the given session from the session manager</summary>
        /// <param name="SessionID"></param>
        /// <returns>true if logout was successful, false if the session was not found</returns>
        //POST: Auth/Out
        [HttpPost("Auth/Out")]
        public async Task<IActionResult> LogOut(Guid SessionID) {
            return Ok(SessionManager.Manager.LogOut(SessionID));
        }

        /// <summary>Attempts to log out of all sessions that have the same user tied to it as the given session does</summary>
        /// <param name="SessionID"></param>
        /// <returns>number of sessions signed out of, or unauthorized if the session was not found</returns>
        //POST: Auth/Out
        [HttpPost("Auth/OutAll")]
        public async Task<IActionResult> LogOutAll(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            return Ok(SessionManager.Manager.LogOutAll(S.UserID));
        }

        /// <summary>Attempts to change the password of a user with the session ID in the given password change request</summary>
        /// <param name="PCR"></param>
        /// <returns>True if the password change was successful. Bad request if it does not, with a given reason.</returns>
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

        /// <summary>Attempts to change the name of a user with the session ID in the given name change request</summary>
        /// <param name="NCR"></param>
        /// <returns>True if the name change was successful. Bad request if it does not, with a given reason.</returns>
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

        /// <summary>Gets all notifs from the user tied to the given session ID</summary>
        /// <param name="SessionID"></param>
        /// <returns>List of all notifs from the given user, or unauthorized if the given session was not found</returns>
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

        /// <summary>Marks a given notif as read if it belongs to the session ID</summary>
        /// <param name="NotifID"></param>
        /// <param name="SessionID"></param>
        /// <returns>The given notification, or unauthorized if the session was not found, or if the notif does not belong to the sessions's tied user</returns>
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

        /// <summary>Marks all unread notifications from the session's tied user as read</summary>
        /// <param name="SessionID"></param>
        /// <returns>Number of notifications marked as read, or unauthorized if the session does not exist</returns>
        //POST Notif/All
        [HttpPost("Notif/all")]
        public async Task<IActionResult> ReadNotifAll(Guid SessionID) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Load Notif
            List<Notification> Ns = await _context.Notification
                .Where(N => N.User.Username == S.UserID && !N.Read).ToListAsync();
            if (Ns == null) { return NotFound(); }

            foreach (var N in Ns) {
                N.Read = true;
                _context.Update(N);
            }

            await _context.SaveChangesAsync();
            return Ok(Ns.Count);
        }

        /// <summary>Delets all notifications that are read from a session's tied user.</summary>
        /// <param name="SessionID"></param>
        /// <returns>Number of notifications deleted</returns>
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

        /// <summary>Gets details of the user tied to the given session id</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> UserDetails(Guid SessionID) {

            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Find a user:
            User DBU = await _context.User.FindAsync(S.UserID);

            return Ok(DBU);
        }

        /// <summary>Gets reservations of the user tied to the given session id</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
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

        /// <summary>Gets business of the user tied to the given session id if said user is a business owner</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
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
