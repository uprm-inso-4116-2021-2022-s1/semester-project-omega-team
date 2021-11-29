using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OmegaSpot.Common {

    /// <summary>Holds a SPOT Business</summary>
    public class Business: ISpotBase {

        #region Properties

        /// <summary>ID of this business</summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ID { get; set; }

        /// <summary>Name of this business</summary>
        public string Name { get; set; } = "";

        /// <summary>Owner of this business</summary>
        public User? Owner { get; set; }

        /// <summary>
        /// Spots this business has.  
        /// Ignored when seralizing as a JSON to avoid a circular loop
        /// </summary>
        [JsonIgnore]
        public List<Spot>? Spots { get; set; }

        /// <summary>Time at which this business opens (Date ignored)</summary>
        public DateTime OpenTime { get; set; } = new DateTime(2020, 1, 1, 0, 0, 0);

        /// <summary>Time at which this business closes (Date ignored)</summary>
        public DateTime CloseTime { get; set; } = new DateTime(2020,1,1,23,59,59);

        /// <summary>Checks if the business is open 24 hours or not. This is defined by the opentime being exactly midnight, and the close time being 11:59:59 PM</summary>
        public bool Is24Hours { get {
                return OpenTime.Hour == 0 && OpenTime.Minute == 0 && OpenTime.Second == 0 &&
                    CloseTime.Hour == 23 && CloseTime.Minute == 59 && CloseTime.Second == 59;
            } 
        }

        /// <summary>Flag to determine if reservations made to this business require reservations or not</summary>
        public bool ReservationsRequireApproval { get; set; } = false;

        /// <summary>Phone Number(s) for this location</summary>
        public string PhoneNumbers { get; set; } = "";

        /// <summary>Email of this business</summary>
        public string Email { get; set; } = "";

        /// <summary>URL to the website of this business</summary>
        public string Website { get; set; } = "";

        #endregion

    }
}
