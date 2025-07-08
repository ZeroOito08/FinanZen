// Nome do arquivo: Categoria.cs
// Pasta: Models

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models
{
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set; }

        [Required]
        [StringLength(100)]
        public required string Nome { get; set; }

        [Required]
        [StringLength(7)]
        public required string Tipo { get; set; } // "Receita" ou "Despesa"

        // Chave Estrangeira (pode ser nula para categorias padrão)
        public int? UsuarioID { get; set; }

        // Propriedades de Navegação
        public virtual Usuario? Usuario { get; set; }
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}