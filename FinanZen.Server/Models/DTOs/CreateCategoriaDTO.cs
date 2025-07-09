namespace FinanZen.Server.Models.DTOs
{
    public class CreateCategoriaDTO
    {
        public required string Nome { get; set; }
        public required string Tipo { get; set; }
        public int? UsuarioID { get; set; }
    }
}