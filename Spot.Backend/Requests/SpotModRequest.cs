using System;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to modify, delete, or create a spot</summary>
    public class SpotModRequest:ISpotRequest {

        /// <summary>ID of the session execuitng this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>ID of the spot to modify (Should be blank when creating)</summary>
        public Guid SpotID { get; set; }

        /// <summary>Name of the spot</summary>
        public string Name { get; set; }

        /// <summary>Description of the spot</summary>
        public string Description { get; set; }

    }
}
