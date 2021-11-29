namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to authenticate and log in a user</summary>
    public class UserAuthRequest {

        /// <summary>Username of the user</summary>
        public string Username { get; set; }

        /// <summary>Password of the User</summary>
        public string Password { get; set; }

    }
}
