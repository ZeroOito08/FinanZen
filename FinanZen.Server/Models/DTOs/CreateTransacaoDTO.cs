using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanZen.Server.Models.DTOs
{
    public class CreateTransacaoDTO
    {
        public string Descricao { get; set; } = string.Empty; // Inicializa com valor padrão
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; } // O tipo foi alterado para DateOnly
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }
        // Novos campos
        public string TipoPagamento { get; set; } = "Dinheiro";
        public string Responsavel { get; set; } = "Gabriel";

        // Nova propriedade adicionada para a Data de Vencimento
        public DateOnly? DataVencimento { get; set; } // O tipo foi alterado para DateOnly?
    }
}