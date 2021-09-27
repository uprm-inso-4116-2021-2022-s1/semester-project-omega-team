using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Spot.Backend.Requests {

    /// <summary>Minimum common information for a Spot request.</summary>
    public interface ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public Guid SessionID { get; set; }

    }
}
