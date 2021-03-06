using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Backend.Requests;
using OmegaSpot.Data;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;

namespace OmegaSpot.Backend.Controllers {
    
    /// <summary>Controller that handles all spot related operations</summary>
    [Route("Spot")]
    [ApiController]
    public class SpotsController : Controller {

        /// <summary>Context that'll handle all operations to the DB</summary>
        private readonly SpotContext _context;

        /// <summary>Holds the default image for plots so that we don't have to load it more than one time</summary>
        private readonly byte[] DEFAULT_IMAGE;

        /// <summary>Creates a Spot controller</summary>
        /// <param name="context"></param>
        public SpotsController(SpotContext context) { 
            _context = context; 
            DEFAULT_IMAGE= ImageToByteArray(Properties.Resources.DefaultSpot, ImageFormat.Jpeg);
        }

        /// <summary>Gets a list of all spots</summary>
        /// <param name="start">Index of the starting spot</param>
        /// <param name="end">Index of the ending spot</param>
        /// <param name="Search">Search query to search by Spot Name, Description, and Business Name</param>
        /// <returns>A list of all spots within given parameters</returns>
        // GET: SPOT
        [HttpGet]
        public async Task<IActionResult> Index(int? start, int? end, string Search) {
            int realstart = start != null ? (int)start : 0;
            int realend = end != null ? (int)end : 20;
            int count = Math.Max(0, realend - realstart);
            List<Spot> Assets;
            if (string.IsNullOrWhiteSpace(Search)) {
                //We have no query
                Assets = await _context.Spot
                .Include(S => S.Business)
                .Skip(realstart).Take(count)
                .ToListAsync();
            } else {
                //We have a query
                Search = Search.ToLower(); //Lowercase this now so that we don't have to later

                Assets = await _context.Spot
                .Include(S => S.Business)
                .Where(S => 
                    S.Name.ToLower().Contains(Search) || 
                    S.Description.ToLower().Contains(Search) || 
                    S.Business.Name.ToLower().Contains(Search)) //We use lowercase to make this search not case sensitive
                .Skip(realstart).Take(count)
                .ToListAsync();
            }

            return Ok(Assets);
        }

        /// <summary>Gets a spot's details</summary>
        /// <param name="id">ID of a spot</param>
        /// <returns>Spot object holding all details from the given spot</returns>
        // GET: SPOT/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Details(Guid? id) {
            if (id == null) { return NotFound(); }

            var asset = await _context.Spot
                .Include(S => S.Business).FirstOrDefaultAsync(m => m.ID == id);

            if (asset == null) { return NotFound(); }
            return Ok(asset);   
        }

        /// <summary>Gets a list of the most reserved spots in the last 7 days</summary>
        /// <param name="count">Amount of featured spots to retrieved</param>
        /// <returns>List of the most reserved spots in the last 7 days (already sorted in descending order)</returns>
        //GET: SPOT/Featured
        [HttpGet("Featured")]
        public async Task<IActionResult> GenericFeatured(int count) {
            //Get spots ordered by number of reservations
            return Ok(await _context.MostReservedSpots(count,DateTime.Now.AddDays(-7)));
        }

        /// <summary>Gets a list of spots featured for a user of the given session</summary>
        /// <param name="SessionID">ID of a Session</param>
        /// <param name="Count">Amount of featured spots to be retrieved</param>
        /// <returns>A list of the given session's tied user's most reserved spots</returns>
        //Post: SPOT/Featured
        [HttpPost("Featured")]
        public async Task<IActionResult> UserFeatured([FromBody] Guid SessionID, [FromQuery] int Count) {
            Session S = SessionManager.Manager.FindSession(SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            //Get featured for this user (their most reserved spots)
            List<Spot> Spots = await _context.MostReservedSpotsUser(Count, S.UserID, false);
            
            //If we don't have enough for the count, suplement it with generic featured.
            if (Spots.Count < Count) {
                int newCount = Count - Spots.Count;
                Spots.AddRange(await _context.MostReservedSpots(newCount, DateTime.Now.AddDays(-7)));
            }

            return Ok(Spots);
        }

        /// <summary>Gets a spot's image (resizing if necessary)</summary>
        /// <param name="ID">ID of a spot</param>
        /// <param name="Width">Width of the image to retrieve</param>
        /// <param name="Height">Height of the image to retrieve</param>
        /// <returns>Image of the given spot, resized if needed</returns>
        [HttpGet("Images/{id}.jpg")]
        public async Task<IActionResult> GetSpotImage(Guid ID, int? Width, int? Height) {
            //Get the spot
            Spot S = await _context.Spot.FirstOrDefaultAsync(m => m.ID == ID);
            if (S == null) { return NotFound("Spot could not be found"); }

            //Get the byte array
            byte[] B = S.Image;
            if (B == null) { B = DEFAULT_IMAGE; }

            //If Either Width or height are not null then its time to resize
            if (Width != null || Height != null) {
                Image I = ByteArrayToImage(B);
                I = ResizeImage(I, Width, Height);
                B = ImageToByteArray(I, ImageFormat.Jpeg);
            }

            //return the image
            return File(B, "image/jpeg");
        }


        /// <summary>Handles the creation or editing of a spot based on if the request has a spot ID or not</summary>
        /// <param name="Request">Request to modify a spot</param>
        /// <returns>Spot that's been created or updated</returns>
        // POST: SPOT
        [HttpPost]
        public async Task<IActionResult> CreateEdit(SpotModRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Spot Sp;
            Business B = await GetSessionBusiness(S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            if (Request.SpotID == Guid.Empty) {
                //This is a New spot
                Sp = new() {
                    Business = B,
                    Description = Request.Description,
                    Name=Request.Name
                };

                _context.Add(Sp);

            } else {

                //This is a modified spot.
                Sp = await _context.Spot.Include(Sp => Sp.Business).FirstOrDefaultAsync(Sp => Sp.ID == Request.SpotID);
                if (Sp == null) { return NotFound("Spot was not found"); }
                if (Sp.Business.ID != B.ID) { return Unauthorized("Session owner isn't this spot's owner"); }

                //Update the spot details
                Sp.Description = Request.Description;
                Sp.Name = Request.Name;

                _context.Update(Sp);
            }

            //Now save the asset
            await _context.SaveChangesAsync();
            return Ok(Sp);
        }

        /// <summary>Handles upload and saving of an image to DB for a spot</summary>
        /// <param name="Request">Request to update a spot's image</param>
        /// <returns>Updated spot</returns>
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
            Sp.Image = ConvertImageByteArray(Request.Image,ImageFormat.Jpeg);

            _context.Update(Sp);

            //Now save the asset
            await _context.SaveChangesAsync();
            return Ok(Sp);
        }

        /// <summary>Delets a spot from the DB</summary>
        /// <param name="Request">Request to delete a spot (Only really needs Session and Spot IDs)</param>
        /// <returns>The deleted spot</returns>
        //POST: SPOT
        [HttpDelete]
        public async Task<IActionResult> Delete(SpotModRequest Request) {
            Session S = SessionManager.Manager.FindSession(Request.SessionID);
            if (S == null) { return Unauthorized("Invalid session"); }

            Business B = await GetSessionBusiness (S);
            if (B == null) { return NotFound("Business not found, or session owner is not a business"); }

            Spot Sp = await _context.Spot.Include(Sp => Sp.Business).FirstOrDefaultAsync(Sp => Sp.ID == Request.SpotID);
            if (Sp == null) { return NotFound("Plot was not found"); }
            if (Sp.Business.ID != B.ID) { return Unauthorized("Session owner isn't this Plot's owner"); }

            _context.Remove(Sp);
            await _context.SaveChangesAsync();
            return Ok(Sp);
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

        /// <summary>Function to resize a given image</summary>
        /// <param name="I"></param>
        /// <param name="Width"></param>
        /// <param name="Height"></param>
        /// <returns></returns>
        public static Image ResizeImage(Image I, int? Width, int? Height) {
            if (Width == null && Height == null) { return I; } //No resize needed

            //Look at me declaring two variables on the same line it almost feels out of character
            int W, H;

            if (Width == null) {
                //Calcualte proportional Width
                H = Height.Value;

                //Width(H)==Height(W)
                //W=Width(H)/Height
                W = I.Width * H / I.Height; 

            } else if (Height == null) {
                //Calculate proportional Height
                W = Width.Value;

                //Width(H)==Height(W)
                //H=Height(W)/Wdith
                H = I.Height * W / I.Width;

            } else {
                //We have a specified width and height
                W = Width.Value;
                H = Height.Value;
            }

            return new Bitmap(I,W,H);

        }

        /// <summary>Converts an Image to a byte array of specified image format data</summary>
        /// <param name="I"></param>
        /// <param name="IF"></param>
        /// <returns></returns>
        private static byte[] ImageToByteArray(Image I, ImageFormat IF) {
            using MemoryStream ms = new();
            I.Save(ms, IF);
            return ms.ToArray();
        }

        /// <summary>Converts a byte array to an image object</summary>
        /// <param name="B"></param>
        /// <returns></returns>
        private static Image ByteArrayToImage(byte[] B) {
            using MemoryStream ms = new(B);

            //Load the image
            return Bitmap.FromStream(ms);
        }

        /// <summary>Converts an Image to a byte array of specified image format data</summary>
        /// <param name="B"></param>
        /// <param name="IF"></param>
        /// <returns></returns>
        private static byte[] ConvertImageByteArray(byte[] B, ImageFormat IF) {

            //Convert it back
            return ImageToByteArray(ByteArrayToImage(B), IF);

        }

        #endregion
    }
}
