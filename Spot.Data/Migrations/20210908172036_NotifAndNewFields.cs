using Microsoft.EntityFrameworkCore.Migrations;

namespace OmegaSpot.Data.Migrations
{
    public partial class NotifAndNewFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Start",
                table: "Reservation",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "Reservation",
                newName: "EndTime");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "User",
                type: "varchar",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "Reservation",
                type: "varchar",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Reason",
                table: "Reservation");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Reservation",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Reservation",
                newName: "End");
        }
    }
}
