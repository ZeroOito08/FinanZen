import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  // Correção: 'styleUrl' vira 'styleUrls' e o valor vira um array [ ]
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  // O restante do código que te passei (model, constructor, onSubmit)
  // continua exatamente o mesmo aqui dentro.

  model: any = {
    data: new Date().toISOString().split('T')[0]
  };

  constructor(private http: HttpClient) { }

  onSubmit() {
    const payload = {
      ...this.model,
      usuarioId: 1,
      categoriaId: 1
    };

    this.http.post('/api/transacoes', payload).subscribe({
      next: (response) => {
        alert('Transação salva com sucesso!');
      },
      error: (error) => {
        alert('Erro ao salvar transação.');
      }
    });
  }
}