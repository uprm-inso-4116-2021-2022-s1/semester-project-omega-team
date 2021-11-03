using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmegaSpot.Common {

    /// <summary>Status of a reservation</summary>
    public enum ReservationStatus { 
    
        /// <summary>Reservation is pending approval from the business owner</summary>
        PENDING = 0,

        /// <summary>Reservation was denied by the business owner and is no longer valid.</summary>
        DENIED = 1,

        /// <summary>Reservation is approved and has not been used</summary>
        APPROVED = 2,

        /// <summary>Reservation was missed, and is no longer valid</summary>
        MISSED = 3, 

        /// <summary>Reservation is currently being used and is in progress</summary>
        IN_PROGRESS = 4,

        /// <summary>Reservation is completed and was used</summary>
        COMPLETED = 5,

        /// <summary>Reservation was cancelled (either by business or reservation owner) and is no longer valid</summary>
        CANCELLED = 6
    }

    /// <summary>Holds a SPOT Reservation</summary>
    public class Reservation: ISpotBase  {

        #region Properties

        /// <summary>ID of this Reservation</summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ID { get; set; }

        /// <summary>Reason for this reservation (usually for requests that are <see cref="ReservationStatus.PENDING"/>)</summary>
        public string Reason { get; set; }

        /// <summary>Date and time this reservation starts</summary>
        public DateTime StartTime { get; set; }

        /// <summary>Date and time this reservetion ends</summary>
        public DateTime EndTime { get; set; }

        /// <summary>Spot this reservation reserves</summary>
        public Spot Spot { get; set; }

        /// <summary>User this reservation belongs to</summary>
        public User User { get; set; }

        /// <summary>Status of this reservation</summary>
        public ReservationStatus Status { get; set; }

        #endregion

        #region Methods

        /// <summary>Method to check if a reservation is valid or not</summary>
        /// <returns>True if and only if the <see cref="Status"/> is NOT <see cref="ReservationStatus.DENIED"/> or <see cref="ReservationStatus.CANCELLED"/></returns>
        public bool IsValid() { return Status != ReservationStatus.DENIED && Status != ReservationStatus.CANCELLED; }

        /// <summary>Advances the state of the reservation if needed</summary>
        public void AdvanceReservation() {
            switch (Status) {
                case ReservationStatus.PENDING:
                    if (DateTime.Now > StartTime.AddMinutes(15)) { Status = ReservationStatus.DENIED; }
                    break;
                case ReservationStatus.APPROVED:
                    if (DateTime.Now > StartTime.AddMinutes(15)) { Status = ReservationStatus.MISSED; }
                    break;
                case ReservationStatus.IN_PROGRESS:
                    if (DateTime.Now > EndTime) { Status = ReservationStatus.COMPLETED; }
                    break;
                case ReservationStatus.COMPLETED:
                case ReservationStatus.CANCELLED:
                case ReservationStatus.DENIED:
                case ReservationStatus.MISSED:
                default:
                    break;
            }

        }

        #endregion

    }
}
