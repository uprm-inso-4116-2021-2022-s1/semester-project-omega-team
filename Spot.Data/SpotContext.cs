using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using OmegaSpot.Common;
using System;
using System.IO;

namespace OmegaSpot.Data {
    public class SpotContext:DbContext {

        public readonly string ConString;

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext() : base() {
            if (!File.Exists("SpotConString.txt")) {
                File.WriteAllText("SpotConString.txt", "Data Source=localhost;Initial Catalog=Spot;Integrated Security=True");
            }

            ConString = File.ReadAllText("SpotConString.txt");
        }

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
        public DbSet<Spot> Spot { get; set; }
   
        /// <summary>Table that contains all <see cref="Common.Reservation"/></summary>
        public DbSet<Reservation> Reservation { get; set; }

        /// <summary>Table that contains all <see cref="Common.User"/></summary>
        public DbSet<User> User { get; set; }

        /// <summary>Table that contains all <see cref="Common.Notification"/></summary>
        public DbSet<Notification> Notification { get; set; }

    }
}
