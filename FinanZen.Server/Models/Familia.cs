using System.ComponentModel.DataAnnotations;

namespace FinanZen.Server.Models
{
    public class Familia
    {
        [Key]
        public int FamiliaId { get; set; }

        [Required, StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
        public virtual ICollection<Orcamento> Orcamentos { get; set; } = new List<Orcamento>();
    }
}
