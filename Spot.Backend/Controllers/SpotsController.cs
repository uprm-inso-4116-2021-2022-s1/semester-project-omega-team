using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Backend.Requests;
using OmegaSpot.Data;
using System.IO;

namespace OmegaSpot.Backend.Controllers {
    
    [Route("Spot")]
    [ApiController]
    public class SpotsController : Controller {
        private readonly SpotContext _context;

        public SpotsController(SpotContext context) { _context = context; }

        // GET: SPOT
        [HttpGet]
        public async Task<IActionResult> Index(int? start, int? end) {
            int realstart = start != null ? (int)start : 0;
            int realend = end != null ? (int)end : 20;
            int count = Math.Max(0, realend - realstart);
            var Assets = await _context.Spot
                .Include(S => S.Business)
                .Skip(realstart).Take(count)
                .ToListAsync();
                
            return Ok(Assets);
        }

        // GET: SPOT/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Details(Guid? id) {
            if (id == null) { return NotFound(); }

            var asset = await _context.Spot
                .Include(S => S.Business).FirstOrDefaultAsync(m => m.ID == id);

            if (asset == null) { return NotFound(); }
            return Ok(asset);
        }

        [HttpGet("Images/{id}.png")]
        public async Task<IActionResult> GetSpotImage(Guid ID) {
            //Get the country and include ***everything***

            var asset = await _context.Spot
                .Include(S => S.Business).FirstOrDefaultAsync(m => m.ID == ID);

            if (asset == null) { return NotFound("Could not find spot"); }

            if (asset.Image == null) { asset.Image = ImageToPngByteArray(Properties.Resources.DefaultSpot); }
           
            return File(asset.Image, "image/png");
        }


        // POST: SPOT
        [HttpPost]
        public async Task<IActionResult> CreateEdit(SpotModRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Spot Sp;
            Business B = await GetSessionBusiness(S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            if (Request.Spot.ID == Guid.Empty) {
                //This is a New spot
                Sp = new() {
                    Business = B,
                    Description = Request.Spot.Description,
                    Name=Request.Spot.Name
                };

                _context.Add(Sp);

            } else {

                //This is a modified spot.
                Sp = await _context.Spot.Include(Sp => Sp.Business).FirstOrDefaultAsync(Sp => Sp.ID == Request.Spot.ID);
                if (Sp == null) { return NotFound("Spot was not found"); }
                if (Sp.Business.ID != B.ID) { return Unauthorized("Session owner isn't this spot's owner"); }

                //Update the spot details
                Sp.Description = Request.Spot.Description;
                Sp.Name = Request.Spot.Name;

                _context.Update(Sp);
            }

            //Now save the asset
            await _context.SaveChangesAsync();
            return Ok(Sp);
        }

        // POST: SPOT/Image
        [HttpPost("Image")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> ImageUpload(SpotImageUpdateRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness(S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            Spot Sp;
            Sp = await _context.Spot.Include(Sp => Sp.Business).FirstOrDefaultAsync(Sp => Sp.ID == Request.SpotID);
            if (Sp == null) { return NotFound("Spot was not found"); }
            if (Sp.Business.ID != B.ID) { return Unauthorized("Session owner isn't this Spot's owner"); }

            //Update the asset details
            Sp.Image = Request.Image;

            _context.Update(Sp);

            //Now save the asset
            await _context.SaveChangesAsync();
            return Ok(Sp);
        }

        //POST: SPOT
        [HttpDelete]
        public async Task<IActionResult> Delete(SpotModRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness (S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            Spot Sp = await _context.Spot.Include(Sp => Sp.Business).FirstOrDefaultAsync(Sp => Sp.ID == Request.Spot.ID);
            if (Sp == null) { return NotFound("Plot was not found"); }
            if (Sp.Business.ID != B.ID) { return Unauthorized("Session owner isn't this Plot's owner"); }

            _context.Remove(Sp);
            await _context.SaveChangesAsync();
            return Ok(Sp);
        }

        private async Task<Business> GetSessionBusiness(Session S) {
            User U = await _context.User.FirstOrDefaultAsync(U => U.Username == S.UserID);
            //actually we can assume a user just exists since they logged on
            if (!U.IsOwner) { return null; }

            return await _context.Business.FirstOrDefaultAsync(B => B.Owner.Username == U.Username);
        }

        private static byte[] ImageToPngByteArray(System.Drawing.Image I) {
            using MemoryStream ms = new();
            I.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            return ms.ToArray();
        }


    }
}
