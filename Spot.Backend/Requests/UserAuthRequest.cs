using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to authenticate and log in a user</summary>
    public class UserAuthRequest : ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>Username of the user</summary>
        public string Username { get; set; }

        /// <summary>Password of the User</summary>
        public string Password { get; set; }

    }
}
