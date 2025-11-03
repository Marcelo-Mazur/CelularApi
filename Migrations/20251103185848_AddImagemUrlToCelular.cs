using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CelularApi.Migrations
{
    /// <inheritdoc />
    public partial class AddImagemUrlToCelular : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagemUrl",
                table: "Celulares",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagemUrl",
                table: "Celulares");
        }
    }
}
