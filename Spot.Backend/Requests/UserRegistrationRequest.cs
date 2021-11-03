﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OmegaSpot.Backend.Requests {
    public class UserRegistrationRequest {

        /// <summary>username of the user to register</summary>
        public string Username { get; set; }
        
        /// <summary>Real name of the user to register</summary>
        public string Name { get; set; }
        
        /// <summary>User's Password Registration</summary>
        public string Password { get; set; }

        /// <summary>Whether or not the registration is for a user or a business</summary>
        public bool IsOwner { get; set; }

    }
}