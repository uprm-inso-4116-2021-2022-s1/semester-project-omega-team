namespace OmegaSpot.Backend.Requests {

    /// <summary>Holds a request to change the name of a User</summary>
    public class NameChangeRequest:ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public System.Guid SessionID { get; set; }

        /// <summary>New name of this user</summary>
        public string NewName { get; set; }

    }
}
