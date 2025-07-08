// Models/DTOs/CreateTransacaoDTO.cs
namespace FinanZen.Server.Models.DTOs
{
    public class CreateTransacaoDTO
    {
        public required string Descricao { get; set; }
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; }
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }
    }
}