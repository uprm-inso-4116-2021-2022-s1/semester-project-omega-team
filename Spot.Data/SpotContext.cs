using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using OmegaSpot.Common;
using System;
using System.IO;

namespace OmegaSpot.Data {
    public class SpotContext:DbContext {

        /// <summary>Indicates whether or not this neco context is in Postgres Mode</summary>
        public bool PostgresMode { get; private set; } = false;

        /// <summary>Indicates whether or not to force no postgres</summary>
        private readonly bool ForceSQLServer = false;


        /// <summary>Override for Postgres server URL. <b></b></summary>
        private readonly string PostgresURL;

        /// <summary></summary>
        private readonly string SQLServerURL;

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext() : base() {
            if (!File.Exists("SpotConString.txt")) {
                File.WriteAllText("SpotConString.txt", "Data Source=localhost;Initial Catalog=Spot;Integrated Security=True");
            }

            SQLServerURL = File.ReadAllText("SpotConString.txt");
            PostgresURL = Environment.GetEnvironmentVariable("DATABASE_URL");
        }

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext(string SQLServerURL) : base() {
            this.SQLServerURL = SQLServerURL;
        }

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext(string SQLServerURL, string PostgresURL) : base() {
            this.SQLServerURL = SQLServerURL;
            this.PostgresURL = PostgresURL;
        }

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext(bool ForceSQLServer) : base() {
            this.ForceSQLServer = ForceSQLServer;
        }

        /// <summary>Creates an EverythingContext</summary>
        public SpotContext(bool ForceSQLServer, string SQLServerURL) : base() {
            this.ForceSQLServer = ForceSQLServer;
            this.SQLServerURL = SQLServerURL;
        }


        /// <summary>Overrides onConfiguring to use <see cref="SQLServerURL"/></summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {

            string PURL = PostgresURL;

            if (!string.IsNullOrWhiteSpace(PURL) && !ForceSQLServer) {

                //OK so now we have this
                //postgres://user:password@host:port/database

                //Drop the beginning 
                PURL = PURL.Replace("postgres://", "");

                //Split the beginning and end into two parts at the @
                string[] PurlSplit = PURL.Split('@');

                //We should now have:
                //user:password
                string Username = PurlSplit[0].Split(':')[0];
                string Password = PurlSplit[0].Split(':')[1];

                //And:
                //host:port/database

                //Split this again by /
                PurlSplit = PurlSplit[1].Split('/');

                //Now we should have
                //host:port
                string Host = PurlSplit[0].Split(':')[0];
                string Port = PurlSplit[0].Split(':')[1];

                //Database
                string Database = PurlSplit[1];

                optionsBuilder.UseNpgsql(@$"
                    Host={Host}; Port={Port}; 
                    Username={Username}; Password={Password};
                    Database={Database};
                    Pooling=true;
                    SSL Mode=Require;
                    TrustServerCertificate=True;
                ");

                PostgresMode = true;

            } else {

                //We do not have a URL to connect to a postgres db. Fallback to the local or configured sql server database
                optionsBuilder.UseSqlServer(SQLServerURL);
            }        
        }

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
