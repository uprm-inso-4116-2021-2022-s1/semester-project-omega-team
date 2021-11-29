using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using OmegaSpot.Data;
using System;
using System.IO;
using System.Reflection;

namespace OmegaSpot.Backend {

    /// <summary>Class that ahndles startup of the backend</summary>
    public class Startup {

        /// <summary>Allow SpecificOrigins for CORS</summary>
        private readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        /// <summary>Creates a startup object</summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        /// <summary>Holds configuration of the startup</summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services) {

            services.AddControllers();
            services.AddDbContext<SpotContext>();

            services.AddCors(options => {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                    builder => {
                        builder.AllowAnyMethod();
                        builder.AllowAnyHeader();
                        builder.AllowAnyOrigin();
                    });
            });

            // Set the comments path for the Swagger JSON and UI.
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (Program.OnHeroku) { //If we're on Heroku:
                //override to contain the previously built version because Heroku's buildpack doesn't generate the xml file
                xmlPath = Path.Combine(AppContext.BaseDirectory,"..","Spot.Backend", xmlFile);
            }


            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1",
                    new OpenApiInfo {
                        Title = "Spot Backend API",
                        Version = "v1",
                        Description = "Spot's backend API that handles all operations for reserving/managing/editing spots",
                        Contact = new() {
                            Email = "igtampe@gmail.com",
                            Name = "Chopo",
                            Url = new("https://github.com/igtampe")
                        }
                    });
                c.IncludeXmlComments(xmlPath);
            });
        }


        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app"></param>
        public void Configure(IApplicationBuilder app) {

            app.UseCors(MyAllowSpecificOrigins);

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Spot.Backend v1"));
           
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
