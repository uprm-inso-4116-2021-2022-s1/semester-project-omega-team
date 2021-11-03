using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OmegaSpot.Common {

    /// <summary>Holds a Spot Spot</summary>
    public class Spot: ISpotBase {

        #region

        /// <summary>ID of this Spot</summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public Guid ID { get; set; }

        /// <summary>Name of this Spot</summary>
        public string Name { get; set; }

        /// <summary>Description of this spot</summary>
        public string Description { get; set; }

        /// <summary>Business this Spot belongs to</summary>
        public Business Business { get; set; }

        /// <summary>Image that represents this spot</summary>
        [JsonIgnore]
        public byte[] Image { get; set; }

        #endregion

    }
}
