using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OmegaSpot.Common {

    /// <summary>Holds a SPOT User</summary>
    public class User {

        #region Properties

        /// <summary>ID of this User</summary>
        [Key]
        public string Username { get; set; } = "";

        /// <summary>Password of this user</summary>
        [JsonIgnore] //Make sure the Password never gets serialized!!
        public string Password { get; set; } = "";

        /// <summary>The name of this user</summary>
        public string Name { get; set; } = "";

        /// <summary>Whether or not this user is an owner or not</summary>
        public bool IsOwner { get; set; } = false;

        /// <summary>
        /// Reservations this user has. 
        /// Ignored when seralizing as a JSON to avoid a circular loop.
        /// </summary>
        [JsonIgnore]
        public List<Reservation>? Reservations { get; set; }

        #endregion

    }
}
