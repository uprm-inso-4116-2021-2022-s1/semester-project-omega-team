using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Spot.Common {

    /// <summary>Holds a SPOT Business</summary>
    public class Business: ISpotBase {

        #region Properties

        /// <summary>ID of this business</summary>
        public Guid ID { get; set; }

        /// <summary>Name of this business</summary>
        public string Name { get; set; }

        /// <summary>Owner of this business</summary>
        public User Owner { get; set; }

        /// <summary>
        /// Spots this business has.  
        /// Ignored when seralizing as a JSON to avoid a circular loop
        /// </summary>
        [JsonIgnore]
        public List<Spot> Spots { get; set; }

        /// <summary>Time at which this business opens (Date ignored)</summary>
        public DateTime OpenTime { get; set; }

        /// <summary>Time at which this business closes (Date ignored)</summary>
        public DateTime CloseTime { get; set; }

        /// <summary>Flag to determine if reservations made to this business require reservations or not</summary>
        public bool ReservationsRequireApproval { get; set; }

        /// <summary>Phone Number(s) for this location</summary>
        public string PhoneNumbers { get; set; }

        /// <summary>Email of this business</summary>
        public string Email { get; set; }

        /// <summary>URL to the website of this business</summary>
        public string Website { get; set; }

        #endregion

    }
}
