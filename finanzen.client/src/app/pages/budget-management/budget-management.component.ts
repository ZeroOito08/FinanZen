import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

export interface OrcamentoDetalhes {
  categoriaID: number;
  categoriaNome: string;
  valorOrcado: number;
  valorGasto: number;
}

@Component({
  selector: 'app-budget-management',
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.css']
})
export class BudgetManagementComponent implements OnInit {

  public orcamentos: OrcamentoDetalhes[] = [];

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.http.get<OrcamentoDetalhes[]>('/api/orcamentos').subscribe({
      next: (data) => {
        this.orcamentos = data;
      },
      error: (err) => {
        this.notification.showError('Falha ao carregar os orçamentos.');
      }
    });
  }

  salvarOrcamento(orcamento: OrcamentoDetalhes): void {
    // A lógica para salvar (PUT ou POST) será adicionada no próximo passo
    console.log('A salvar:', orcamento);
    // Por enquanto, apenas damos um feedback de sucesso
    this.notification.showSuccess(`Orçamento para ${orcamento.categoriaNome} guardado!`);
  }
}