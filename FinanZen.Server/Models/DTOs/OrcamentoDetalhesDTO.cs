namespace FinanZen.Server.Models.DTOs
{
    public class OrcamentoDetalhesDTO
    {
        public int CategoriaID { get; set; }
        public required string CategoriaNome { get; set; }
        public decimal ValorOrcado { get; set; } // Valor do orçamento definido
        public decimal ValorGasto { get; set; } // Valor já gasto naquela categoria no mês
    }
}