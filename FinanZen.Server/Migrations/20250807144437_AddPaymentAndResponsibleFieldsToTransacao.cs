using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanZen.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentAndResponsibleFieldsToTransacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "responsavel",
                table: "transacoes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "tipo_pagamento",
                table: "transacoes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "responsavel",
                table: "transacoes");

            migrationBuilder.DropColumn(
                name: "tipo_pagamento",
                table: "transacoes");
        }
    }
}
