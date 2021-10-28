using OmegaSpot.Common;

namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to update a reservation's status</summary>
    public class UpdateReservationRequest:ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public System.Guid SessionID { get; set; }

        /// <summary>ID of the reservation to update the status of</summary>
        public System.Guid ReservationID { get; set; }

        /// <summary>New status of the reservation</summary>
        public ReservationStatus NewStatus { get; set; }

    }
}
