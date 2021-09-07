using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Spot.Common;
using System;

namespace Spot.Data {
    public class SpotContext:DbContext {

        public const string ConString = "Data Source=localhost;Initial Catalog=Spot;Integrated Security=True";

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext() : base() { }

        /// <summary>Overrides onConfiguring to use <see cref="ConString"/></summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { optionsBuilder.UseSqlServer(ConString); }

        /// <summary>Overrides on model creation to remove the plural convention</summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            //This will singularize all table names
            foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes()) {
                entityType.SetTableName(entityType.DisplayName());
            }
        }

        /// <summary>Table that contains all <see cref="Common.Business"/></summary>
        public DbSet<Business> Business { get; set; }

        /// <summary>Table that contains all <see cref="Common.Spot"/></summary>
        public DbSet<Common.Spot> Spot { get; set; }
   
        /// <summary>Table that contains all <see cref="Common.Reservation"/></summary>
        public DbSet<Reservation> Reservation { get; set; }

        /// <summary>Table that contains all <see cref="Common.User"/></summary>
        public DbSet<Business> User { get; set; }

    }
}
