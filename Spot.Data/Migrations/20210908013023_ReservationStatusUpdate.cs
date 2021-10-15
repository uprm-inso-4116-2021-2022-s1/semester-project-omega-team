using Microsoft.EntityFrameworkCore.Migrations;

namespace OmegaSpot.Data.Migrations
{
    public partial class ReservationStatusUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReservationsRequireApproval",
                table: "Business",
                type: "bool",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReservationsRequireApproval",
                table: "Business");
        }
    }
}
