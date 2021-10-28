using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using OmegaSpot.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace OmegaSpot.Data {
    public class SpotContext: DbContext {

        /// <summary>Indicates whether or not this neco context is in Postgres Mode</summary>
        public bool PostgresMode { get; private set; } = false;

        /// <summary>Indicates whether or not to force no postgres</summary>
        private readonly bool ForceSQLServer = false;

        /// <summary>Override for Postgres server URL. <b></b></summary>
        private readonly string PostgresURL;

        /// <summary></summary>
        private readonly string SQLServerURL;

        /// <summary>Underlying one for the prop <see cref="SqlConnection"/></summary>
        private SqlConnection SCON;

        /// <summary>Underlying SQL connection for raw SQL queries</summary>
        private SqlConnection SqlConnection {
            get {
                if (SCON == null) { SCON = Database.GetDbConnection() as SqlConnection; SCON.Open(); }
                return SCON;
            }
        }

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

        #region tables

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

        #endregion

        #region Functions

        /// <summary>Gets a list of the most reserved spots in descending order (from an optional cut off date)</summary>
        /// <param name="Count"></param>
        /// <param name="Cutoff"></param>
        /// <returns></returns>
        public async Task<List<Spot>> MostReservedSpots(int Count, DateTime? Cutoff = null) {
            DateTime RealCutOff = Cutoff ?? DateTime.MinValue;

            using SqlCommand C = new(); 
            C.CommandText = SqlStringTopSpotsCutoff();
            C.Parameters.Add("@Cutoff", System.Data.SqlDbType.DateTime2);
            C.Parameters["@Cutoff"].Value = RealCutOff;
            C.Connection = SqlConnection;

            List<Spot> Spots = await TopSpotCommandToListSpot(C,Count);

            return Spots;
        }

        /// <summary>Gets a list of the most reserved spots in descending order from a user</summary>
        /// <param name="Count"></param>
        /// <param name="Username"></param>
        /// <param name="Filler">Whether or not to fill the list with filler spots if there aren't enough spots to reach the count</param>
        /// <returns></returns>
        public async Task<List<Spot>> MostReservedSpotsUser(int Count, string Username, bool Filler) {
          
            using SqlCommand C = new();
            C.CommandText = SqlStringTopSpotsUser();
            C.Parameters.Add("@Username", System.Data.SqlDbType.VarChar);
            C.Parameters["@Username"].Value = Username;
            C.Connection = SqlConnection;

            List<Spot> Spots = await TopSpotCommandToListSpot(C, Count);
            if (Spots.Count == Count || !Filler) { return Spots; }

            //If we're here, it means we're out of spots and we still need more

            int NewCount = Count - Spots.Count;
            Spots.AddRange(await MostReservedSpots(Count));

            //Should we check for repeats?

//            foreach (Spot S in await MostReservedSpots(NewCount)) {
//                if (!Spots.Contains(S)) {
//                    Spots.Add(S);
//                    if (Spots.Count == Count) { return Spots; }
//                }
//            }

            //If we're here then we're out of spots entirely to add to the list so uh....
            //b y e

            return Spots;
        }

        #endregion

        #region FunctionHelpers

        //why did I sign up for this recommendation system

        private async Task<List<Spot>> TopSpotCommandToListSpot(SqlCommand Command, int Count) {
            List<Spot> Spots = new();

            SqlDataReader Reader = await Command.ExecuteReaderAsync();

            while (await Reader.ReadAsync()) {
                Spot S = new();
                S.ID = Reader.GetGuid(0);
                S.Name = Reader.GetString(1);
                S.Description = Reader.GetString(2);
                S.Business = new() { Name = Reader.GetString(3) };
                Spots.Add(S);
                if (Spots.Count == Count) { return Spots; }
            }

            return Spots;
        }

        #endregion

        #region SqlStrings

        private string SqlStringTopSpotsCutoff() {
            if (PostgresMode) {
                return "Select r.\"SpotID\" as SpotID, S.\"Name\" as SpotName, S.\"Description\" as SpotDescription, B.\"Name\" as BusinessName, Count(*) as ReservationCount " +
                    "from \"Reservation\" as R inner join \"Spot\" as S on R.\"SpotID\" = S.\"ID\" inner join \"Business\" as B on S.\"BusinessID\" = B.\"ID\" " +
                    "where R.\"StartTime\" > @Cutoff " +
                    "group by R.\"SpotID\", S.\"Name\", S.\"Description\", B.\"Name\", B.\"ID\" " +
                    "order by count(*) desc";
            }

            return @"Select R.SpotID, S.Name as SpotName, S.Description as SpotDescription, B.Name as BusinessName, Count(*) as ReservationCount 
                from [Reservation] R inner join [dbo].[Spot] S on R.SpotID = S.ID inner join Business B on S.BusinessID = B.ID 
                where R.StartTime > @Cutoff 
                group by R.SpotID, S.Name, S.Description, B.Name, B.ID 
                order by count(*) desc";
        }

        private string SqlStringTopSpotsUser() {
            if (PostgresMode) {
                return "Select r.\"SpotID\" as SpotID, S.\"Name\" as SpotName, S.\"Description\" as SpotDescription, B.\"Name\" as BusinessName, Count(*) as ReservationCount " +
                    "from \"Reservation\" as R inner join \"Spot\" as S on R.\"SpotID\" = S.\"ID\" inner join \"Business\" as B on S.\"BusinessID\" = B.\"ID\" " +
                    "where R.\"Username\" = @Username " +
                    "group by R.\"SpotID\", S.\"Name\", S.\"Description\", B.\"Name\", B.\"ID\" " +
                    "order by count(*) desc";
            }

            return @"Select R.SpotID, S.Name as SpotName, S.Description as SpotDescription, B.Name as BusinessName, Count(*) as ReservationCount 
                from [Reservation] R inner join [dbo].[Spot] S on R.SpotID = S.ID inner join Business B on S.BusinessID = B.ID 
                where R.Username = @Username 
                group by R.SpotID, S.Name, S.Description, B.Name, B.ID 
                order by count(*) desc";

        }

        #endregion


    }
}
