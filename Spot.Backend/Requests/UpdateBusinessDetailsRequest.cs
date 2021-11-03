using System;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to update a business's details</summary>
    public class UpdateBusinessDetailsRequest:ISpotRequest {
        
        /// <summary>ID of the session executing this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>Updated business name</summary>
        public string Name { get; set; }

        /// <summary>Updated business's open time</summary>
        public DateTime OpenTime { get; set; }

        /// <summary>Updated Business's close time</summary>
        public DateTime CloseTime { get; set; }

        /// <summary>Updated business's reservation approval requirement status</summary>
        public bool ReservationsRequireApproval { get; set; }

        /// <summary>Updated business's phone numbers</summary>
        public string PhoneNumbers { get; set; }

        /// <summary>Updated business's email</summary>
        public string Email { get; set; }

        /// <summary>Updated Business's website</summary>
        public string Website { get; set; }
    }
}
