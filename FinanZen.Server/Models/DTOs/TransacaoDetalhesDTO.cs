namespace FinanZen.Server.Models.DTOs
{
    public class TransacaoDetalhesDTO
    {
        public int TransacaoID { get; set; }
        public string Descricao { get; set; } // 'required' foi removido
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; }
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }
        public string? CategoriaNome { get; set; }
        public string? Tipo { get; set; }
    }
}