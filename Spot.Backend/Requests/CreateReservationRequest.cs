using System;

namespace OmegaSpot.Backend.Requests {
    
    /// <summary>Request to create a reservation</summary>
    public class CreateReservationRequest:ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public Guid SessionID { get; set; }

        /// <summary>Reason this reservation is being made</summary>
        public string Reason { get; set; }

        /// <summary>Time this reservation will start at</summary>
        public DateTime StartTime { get; set; }

        /// <summary>Time this reservation will end at</summary>
        public DateTime EndTime { get; set; }

        /// <summary>ID Of the spot to Reserve</summary>
        public Guid SpotID { get; set; }

    }
}
