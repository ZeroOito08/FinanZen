import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  public categorias: any[] = [];
  model: any = {};
  isEditMode = false;

  constructor(private http: HttpClient, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { transacaoData: any };
    if (state?.transacaoData) {
      this.isEditMode = true;
      this.model = { ...state.transacaoData }; // Clona o objeto
      // Converte a data para o formato YYYY-MM-DD que o input[type=date] espera
      this.model.data = new Date(this.model.data).toISOString().split('T')[0];
    }
  }

  ngOnInit(): void {
    this.carregarCategorias();
    if (!this.isEditMode) {
      this.model.data = new Date().toISOString().split('T')[0];
    }
  }

  carregarCategorias(): void {
    this.http.get<any[]>('/api/categorias').subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { alert('Falha ao carregar categorias.'); }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      // Chama o endpoint PUT para atualizar
      this.http.put(`/api/transacoes/${this.model.transacaoID}`, this.model).subscribe({
        next: () => {
          alert('Transação atualizada com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => alert('Falha ao atualizar a transação.')
      });
    } else {
      // Chama o endpoint POST para criar
      const payload = { ...this.model, usuarioId: 1 };
      this.http.post('/api/transacoes', payload).subscribe({
        next: () => {
          alert('Transação salva com sucesso!');
          this.router.navigate(['/minhas-transacoes']);
        },
        error: (err) => alert('Erro ao salvar transação.')
      });
    }
  }
}