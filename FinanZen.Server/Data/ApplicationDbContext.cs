// Nome do arquivo: ApplicationDbContext.cs
// Pasta: Data

using FinanZen.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanZen.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        // O construtor é essencial para a configuração no Program.cs
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Cada DbSet<T> representa uma tabela no banco de dados.
        // O nome da propriedade (ex: Usuarios) é como vamos nos referir
        // a essa tabela no nosso código C#.
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
    }
}