namespace OmegaSpot.Backend.Requests {

    /// <summary>Request to create a business user account and its business</summary>
    public class BusinessRegistrationRequest {

        /// <summary>Details for the new user to create</summary>
        public UserRegistrationRequest UserRequest { get; set; }

        /// <summary>Details for the new business to create (ID should be empty)</summary>
        public UpdateBusinessDetailsRequest BusinessDetails { get; set; }

    }
}
