namespace FinanZen.Server.Models
{
    public class Familia
    {
        public int FamiliaID { get; set; }  // ID da família (chave primária)
        public string Nome { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }

        // Relacionamento opcional com os usuários
        public ICollection<Usuario>? Usuarios { get; set; }
    }
}
