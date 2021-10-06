using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OmegaSpot.Common;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to modify, delete, or create a spot</summary>
    public class SpotModRequest:ISpotRequest {

        /// <summary>ID of the session execuitng this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>Spot to create, modify, or delete. This spot should NOT contain an image</summary>
        public Spot Spot { get; set; }

    }
}
