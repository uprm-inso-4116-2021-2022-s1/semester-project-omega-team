using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Spot.Common;
using Spot.Data;

namespace Spot.Backend.Controllers {

    [Route("User")] //This is the route the URL needs to go to
    [ApiController] //This indicates there's an API Controller 
    public class UsersController: Controller {
        private readonly SpotContext _context;

        public UsersController(SpotContext context) { _context = context; }
    
    
    }
}
