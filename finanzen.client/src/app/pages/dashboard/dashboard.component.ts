import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js'; // 1. Importar ChartData

// Interface para o resumo financeiro
interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public resumo: ResumoFinanceiro | null = null;

  // --- Propriedades Corrigidas para o Gráfico ---
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  // 2. Tipagem correta para os dados do gráfico
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartLegend = true;
  // --- Fim das Propriedades do Gráfico ---

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarDadosGrafico(); // Chamada agora está no lugar certo
  }

  carregarResumo(): void {
    this.http.get<ResumoFinanceiro>('/api/dashboard/resumo').subscribe({
      next: (data) => {
        this.resumo = data;
      },
      error: (err) => {
        console.error('Erro ao carregar resumo financeiro', err);
        alert('Falha ao carregar o resumo financeiro.');
      }
    });
  }

  // 3. Função movida para fora do subscribe, para o corpo da classe
  carregarDadosGrafico(): void {
    this.http.get<any[]>('/api/dashboard/despesas-por-categoria').subscribe({
      next: (data) => {
        console.log("Dados do gráfico recebidos:", data);
        
        // Atualiza as propriedades do objeto pieChartData
        this.pieChartData.labels = data.map(item => item.categoria);
        this.pieChartData.datasets[0].data = data.map(item => item.total);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico', err);
      }
    });
  }
}