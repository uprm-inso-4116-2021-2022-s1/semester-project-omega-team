namespace OmegaSpot.Backend.Requests {
    public class PasswordChangeRequest:ISpotRequest {
        /// <summary>ID of the session this PCR comes from</summary>
        public System.Guid SessionID { get; set; }

        /// <summary>User's current password</summary>
        public string CurrentPassword { get; set; }

        /// <summary>New Password</summary>
        public string NewPassword { get; set; }
    }
}
