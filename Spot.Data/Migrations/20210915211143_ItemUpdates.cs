using Microsoft.EntityFrameworkCore.Migrations;

namespace OmegaSpot.Data.Migrations
{
    public partial class ItemUpdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Business",
                type: "varchar",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumbers",
                table: "Business",
                type: "varchar",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Business",
                type: "varchar",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "PhoneNumbers",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Business");
        }
    }
}
