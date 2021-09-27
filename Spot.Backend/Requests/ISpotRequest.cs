namespace OmegaSpot.Backend.Requests {

    /// <summary>Minimum common information for a Spot request.</summary>
    public interface ISpotRequest {

        /// <summary>ID of the session executing this request</summary>
        public System.Guid SessionID { get; set; }

    }
}
