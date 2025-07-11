namespace FinanZen.Server.Models.DTOs
{
    public class FluxoCaixaDTO
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<decimal> Receitas { get; set; } = new List<decimal>();
        public List<decimal> Despesas { get; set; } = new List<decimal>();
        public List<decimal> Saldos { get; set; } = new List<decimal>();
    }
}