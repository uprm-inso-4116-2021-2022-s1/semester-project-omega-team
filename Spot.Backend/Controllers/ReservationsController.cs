using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using OmegaSpot.Common;
using OmegaSpot.Data;

namespace OmegaSpot.Backend.Controllers {

    [Route("Reservation")]
    [ApiController]
    public class ReservationsController : Controller {
        private readonly SpotContext _context;

        public ReservationsController(SpotContext context) { _context = context; }

    }
}
