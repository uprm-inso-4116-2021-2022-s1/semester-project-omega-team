using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmegaSpot.Common {

    /// <summary>Holds the *absolute base* properties needed for an item in Spot</summary>
    internal interface ISpotBase {

        /// <summary>ID Of this object</summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ID { get; set; }

    }
}
