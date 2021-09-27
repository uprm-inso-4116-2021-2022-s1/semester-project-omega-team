using System;

namespace OmegaSpot.Common {

    /// <summary>Holds the *absolute base* properties needed for an item in Spot</summary>
    internal interface ISpotBase {

        /// <summary>ID Of this object</summary>
        public Guid ID { get; set; }

    }
}
