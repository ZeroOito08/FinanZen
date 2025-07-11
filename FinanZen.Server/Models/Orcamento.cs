using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models
{
    public class Orcamento
    {
        [Key]
        public int OrcamentoID { get; set; }

        public int? FamiliaId { get; set; }

        [Required]
        public int UsuarioID { get; set; }
        public Usuario? Usuario { get; set; }

        [Required]
        public int CategoriaID { get; set; }
        public Categoria? Categoria { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Valor { get; set; }

        [Required]
        public int Mes { get; set; }

        [Required]
        public int Ano { get; set; }

        public virtual Familia? Familia { get; set; }
    }
}