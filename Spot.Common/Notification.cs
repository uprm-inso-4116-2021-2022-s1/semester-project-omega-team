using System;

namespace OmegaSpot.Common {
    /// <summary>Holds a Spot notification, which informs a <see cref="Common.User"/> about <see cref="Reservation"/> changes</summary>
    public class Notification: ISpotBase {

        /// <summary>ID of this notification</summary>
        public Guid ID { get; set; }

        /// <summary>Time and date at which it was sent out</summary>
        public DateTime SentTime { get; set; }

        /// <summary>User this notification was sent to</summary>
        public User User { get; set; }

        /// <summary>Text of this notification</summary>
        public string Text { get; set; }

        /// <summary>Whether or not this notification has been read by the user</summary>
        public bool Read { get; set; }
    }
}
