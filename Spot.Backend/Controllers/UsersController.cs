using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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

    }
}
