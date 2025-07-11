using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinanZen.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFamiliaSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "familia_id",
                table: "usuarios",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "familia_id",
                table: "transacoes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "familia_id",
                table: "orcamentos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "familias",
                columns: table => new
                {
                    familia_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_familias", x => x.familia_id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_familia_id",
                table: "usuarios",
                column: "familia_id");

            migrationBuilder.CreateIndex(
                name: "ix_transacoes_familia_id",
                table: "transacoes",
                column: "familia_id");

            migrationBuilder.CreateIndex(
                name: "ix_orcamentos_familia_id",
                table: "orcamentos",
                column: "familia_id");

            migrationBuilder.AddForeignKey(
                name: "fk_orcamentos_familias_familia_id",
                table: "orcamentos",
                column: "familia_id",
                principalTable: "familias",
                principalColumn: "familia_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transacoes_familias_familia_id",
                table: "transacoes",
                column: "familia_id",
                principalTable: "familias",
                principalColumn: "familia_id");

            migrationBuilder.AddForeignKey(
                name: "fk_usuarios_familias_familia_id",
                table: "usuarios",
                column: "familia_id",
                principalTable: "familias",
                principalColumn: "familia_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_orcamentos_familias_familia_id",
                table: "orcamentos");

            migrationBuilder.DropForeignKey(
                name: "fk_transacoes_familias_familia_id",
                table: "transacoes");

            migrationBuilder.DropForeignKey(
                name: "fk_usuarios_familias_familia_id",
                table: "usuarios");

            migrationBuilder.DropTable(
                name: "familias");

            migrationBuilder.DropIndex(
                name: "ix_usuarios_familia_id",
                table: "usuarios");

            migrationBuilder.DropIndex(
                name: "ix_transacoes_familia_id",
                table: "transacoes");

            migrationBuilder.DropIndex(
                name: "ix_orcamentos_familia_id",
                table: "orcamentos");

            migrationBuilder.DropColumn(
                name: "familia_id",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "familia_id",
                table: "transacoes");

            migrationBuilder.DropColumn(
                name: "familia_id",
                table: "orcamentos");
        }
    }
}
