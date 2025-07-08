// Nome do arquivo: Usuario.cs
// Pasta: Models

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models
{ // Garante que o nome da tabela no DB seja "Usuarios"
    public class Usuario
    {
        [Key] // Marca esta propriedade como a Chave Primária
        public int UsuarioID { get; set; }

        [Required] // Garante que o campo não pode ser nulo
        [StringLength(100)] // Define o tamanho máximo
        public required string Nome { get; set; }

        [Required]
        [StringLength(150)]
        public required string Email { get; set; }

        [Required]
        public required string SenhaHash { get; set; }

        public DateTime DataCriacao { get; set; }

        // Propriedade de Navegação: Um usuário pode ter muitas transações
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

        // Propriedade de Navegação: Um usuário pode ter muitas categorias
        public virtual ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
    }
}