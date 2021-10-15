using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OmegaSpot.Data.Migrations
{
    public partial class ActuallyAddNotifs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    SentTime = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Username = table.Column<string>(type: "varchar(450)", nullable: true),
                    Text = table.Column<string>(type: "varchar", nullable: true),
                    Read = table.Column<bool>(type: "bool", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Notification_User_Username",
                        column: x => x.Username,
                        principalTable: "User",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Username",
                table: "Notification",
                column: "Username");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notification");
        }
    }
}
