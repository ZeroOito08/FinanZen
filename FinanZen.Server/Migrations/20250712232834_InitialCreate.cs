using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinanZen.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "familias",
                columns: table => new
                {
                    familia_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_familias", x => x.familia_id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    usuario_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    senha_hash = table.Column<string>(type: "text", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    familia_id = table.Column<int>(type: "integer", nullable: true),
                    is_admin = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuarios", x => x.usuario_id);
                    table.ForeignKey(
                        name: "fk_usuarios_familias_familia_id",
                        column: x => x.familia_id,
                        principalTable: "familias",
                        principalColumn: "familia_id");
                });

            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    categoria_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    tipo = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    usuario_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categorias", x => x.categoria_id);
                    table.ForeignKey(
                        name: "fk_categorias_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "reset_senha_tokens",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    usuario_id = table.Column<int>(type: "integer", nullable: false),
                    token = table.Column<string>(type: "text", nullable: false),
                    expira_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reset_senha_tokens", x => x.id);
                    table.ForeignKey(
                        name: "fk_reset_senha_tokens_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "orcamentos",
                columns: table => new
                {
                    orcamento_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    familia_id = table.Column<int>(type: "integer", nullable: true),
                    usuario_id = table.Column<int>(type: "integer", nullable: false),
                    categoria_id = table.Column<int>(type: "integer", nullable: false),
                    valor = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    mes = table.Column<int>(type: "integer", nullable: false),
                    ano = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_orcamentos", x => x.orcamento_id);
                    table.ForeignKey(
                        name: "fk_orcamentos_categorias_categoria_id",
                        column: x => x.categoria_id,
                        principalTable: "categorias",
                        principalColumn: "categoria_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_orcamentos_familias_familia_id",
                        column: x => x.familia_id,
                        principalTable: "familias",
                        principalColumn: "familia_id");
                    table.ForeignKey(
                        name: "fk_orcamentos_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "transacoes",
                columns: table => new
                {
                    transacao_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    familia_id = table.Column<int>(type: "integer", nullable: true),
                    descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    data = table.Column<DateOnly>(type: "date", nullable: false),
                    usuario_id = table.Column<int>(type: "integer", nullable: false),
                    categoria_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transacoes", x => x.transacao_id);
                    table.ForeignKey(
                        name: "fk_transacoes_categorias_categoria_id",
                        column: x => x.categoria_id,
                        principalTable: "categorias",
                        principalColumn: "categoria_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_transacoes_familias_familia_id",
                        column: x => x.familia_id,
                        principalTable: "familias",
                        principalColumn: "familia_id");
                    table.ForeignKey(
                        name: "fk_transacoes_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_categorias_usuario_id",
                table: "categorias",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_orcamentos_categoria_id",
                table: "orcamentos",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "ix_orcamentos_familia_id",
                table: "orcamentos",
                column: "familia_id");

            migrationBuilder.CreateIndex(
                name: "ix_orcamentos_usuario_id",
                table: "orcamentos",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_reset_senha_tokens_usuario_id",
                table: "reset_senha_tokens",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_transacoes_categoria_id",
                table: "transacoes",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "ix_transacoes_familia_id",
                table: "transacoes",
                column: "familia_id");

            migrationBuilder.CreateIndex(
                name: "ix_transacoes_usuario_id",
                table: "transacoes",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_familia_id",
                table: "usuarios",
                column: "familia_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "orcamentos");

            migrationBuilder.DropTable(
                name: "reset_senha_tokens");

            migrationBuilder.DropTable(
                name: "transacoes");

            migrationBuilder.DropTable(
                name: "categorias");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "familias");
        }
    }
}
