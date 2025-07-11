// Nome do arquivo: Usuario.cs
// Pasta: Models

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models
{ // Garante que o nome da tabela no DB seja "Usuarios"
    public class Usuario
    {
        public int UsuarioID { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public int? FamiliaId { get; set; }
        public virtual Familia? Familia { get; set; }

        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
        public virtual ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();

        public bool IsAdmin { get; set; } = false;
    }
}