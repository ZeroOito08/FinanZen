import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // 1. Importar o Router
import { TransacaoDetalhes } from '../../models/transacao.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  
  public transacoes: TransacaoDetalhes[] = [];

  // 2. Injetar o Router no construtor
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.carregarTransacoes();
  }

  carregarTransacoes(): void {
    this.http.get<TransacaoDetalhes[]>('/api/transacoes').subscribe({
      next: (data) => {
        this.transacoes = data;
      },
      error: (err) => {
        alert('Falha ao carregar as transações.');
      }
    });
  }

  // 3. Implementação correta do método para editar
  editarTransacao(transacao: TransacaoDetalhes): void {
    // Navega para a rota '/transacoes' e passa os dados da transação
    // através do objeto 'state'.
    this.router.navigate(['/transacoes'], { state: { transacaoData: transacao } });
  }

  deletarTransacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.http.delete(`/api/transacoes/${id}`).subscribe({
        next: () => {
          alert('Transação excluída com sucesso!');
          this.transacoes = this.transacoes.filter(t => t.transacaoID !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir transação', err);
          alert('Falha ao excluir a transação.');
        }
      });
    }
  }
}