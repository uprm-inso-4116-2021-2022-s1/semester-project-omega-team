using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;

namespace OmegaSpot.Backend {

    /// <summary>Main entrypoint class of the backend app</summary>
    public static class Program {

        /// <summary>Main entrypoint method of the backend app</summary>
        /// <param name="args"></param>
        public static void Main(string[] args) { CreateHostBuilder(args).Build().Run(); }

        /// <summary>Creates the webapp and runs it</summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.UseStartup<Startup>();
                });

        /// <summary>Flag to determine whether or not the program is running on Heroku or not</summary>
        public static bool OnHeroku {
            get {return !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("HEROKU"));}
        }

    }
}
