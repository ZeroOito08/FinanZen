using System;
using System.ComponentModel.DataAnnotations;

namespace FinanZen.Server.Models.DTOs
{
    public class TransacaoDetalhesDTO
    {
        public int TransacaoID { get; set; }
        public string Descricao { get; set; } // 'required' foi removido
        public decimal Valor { get; set; }
        public DateOnly Data { get; set; } // O tipo foi alterado para DateOnly
        public int UsuarioID { get; set; }
        public int CategoriaID { get; set; }
        public string? CategoriaNome { get; set; }
        public string? Tipo { get; set; }

        public string TipoPagamento { get; set; } = string.Empty;
        public string Responsavel { get; set; } = string.Empty;

        // Nova propriedade adicionada para a Data de Vencimento
        public DateOnly? DataVencimento { get; set; } // O tipo foi alterado para DateOnly?
    }
}