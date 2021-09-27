﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace Spot.Data.Migrations
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
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "Reservation",
                type: "nvarchar(max)",
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
