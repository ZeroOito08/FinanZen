// Pasta: Models/DTOs/TransacaoDetalhesDTO.cs
namespace FinanZen.Server.Models.DTOs
{
    public class TransacaoDetalhesDTO
    {
        public int TransacaoID { get; set; }
        public required string Descricao { get; set; }
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; }
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }
        public string? CategoriaNome { get; set; } // Propriedade para o nome da categoria
    }
}