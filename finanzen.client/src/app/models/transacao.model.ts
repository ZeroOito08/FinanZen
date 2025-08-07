// src/app/models/transacao.model.ts
export interface TransacaoDetalhes {
tipoPagamento: any;
responsavel: any;
    transacaoID: number;
    descricao: string;
    valor: number;
    data: string;
    categoriaID: number;
    categoriaNome?: string;
    tipo?: 'Receita' | 'Despesa';
}

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}