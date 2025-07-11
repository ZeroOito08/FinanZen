// Nome do arquivo: Transacao.cs
// Pasta: Models

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models
{
    public class Transacao
    {
        [Key]
        public int TransacaoID { get; set; }
        public int? FamiliaId { get; set; }

        [Required]
        [StringLength(200)]
        public required string Descricao { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")] // Define o tipo exato no banco de dados
        public decimal Valor { get; set; }

        [Required]
        public DateOnly Data { get; set; }

        // Chaves Estrangeiras
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }

        public virtual Familia? Familia { get; set; }
        // Propriedades de Navegação
        public virtual Usuario? Usuario { get; set; }
        public virtual Categoria? Categoria { get; set; }
    }
}