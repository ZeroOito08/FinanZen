// Pasta: Models/DTOs/ResumoFinanceiroDTO.cs
namespace FinanZen.Server.Models.DTOs
{
    public class ResumoFinanceiroDTO
    {
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}