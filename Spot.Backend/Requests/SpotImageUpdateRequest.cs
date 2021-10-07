using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OmegaSpot.Common;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Holds a request to update a specified plot's image</summary>
    public class SpotImageUpdateRequest:ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>ID of the plot to update the image of</summary>
        public Guid SpotID { get; set; }

        /// <summary>Spot's new image</summary>
        public byte[] Image { get; set; }

    }
}
