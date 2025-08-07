// src/app/models/transacao.model.ts
export interface TransacaoDetalhes {
    transacaoID: number;
    descricao: string;
    valor: number;
    data: string;
    categoriaID: number;
    categoriaNome?: string;
    tipo?: 'Receita' | 'Despesa';
    tipoPagamento: string;
    responsavel: string;
}

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}