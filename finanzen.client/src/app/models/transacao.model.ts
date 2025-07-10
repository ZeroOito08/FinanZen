// src/app/models/transacao.model.ts
export interface TransacaoDetalhes {
    transacaoID: number;
    descricao: string;
    valor: number;
    data: string;
    categoriaID: number;
    categoriaNome?: string;
    tipo?: 'Receita' | 'Despesa';
}