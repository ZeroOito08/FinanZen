import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

// 1. Definição da interface que estava faltando
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
  
  // --- Gráfico de Pizza ---
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };
  // 2. Inicialização correta do objeto, com as propriedades que ele exige
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartLegend = true;

  // --- Gráfico de Linhas ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Saldo Diário',
        borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.3)', fill: 'origin', tension: 0.4 },
      { data: [], label: 'Receitas', borderColor: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.3)', fill: 'origin' },
      { data: [], label: 'Despesas', borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.3)', fill: 'origin' }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };
  public lineChartLegend = true;
  public periodoSelecionado = '7dias';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarDadosGraficoPizza();
    this.carregarDadosGraficoLinhas(this.periodoSelecionado);
  }

  carregarResumo(): void {
    this.http.get<ResumoFinanceiro>('/api/dashboard/resumo').subscribe({
      next: (data) => { this.resumo = data; },
      error: (err) => { console.error('Erro ao carregar resumo financeiro', err); }
    });
  }
  
  carregarDadosGraficoPizza(): void {
    this.http.get<any[]>('/api/dashboard/despesas-por-categoria').subscribe({
      next: (data) => {
        this.pieChartData.labels = data.map(item => item.categoria);
        this.pieChartData.datasets[0].data = data.map(item => item.total);
      },
      error: (err) => { console.error('Erro ao carregar dados do gráfico de pizza', err); }
    });
  }

  carregarDadosGraficoLinhas(periodo: string): void {
    this.periodoSelecionado = periodo;
    let params = new HttpParams().set('periodo', periodo );

    this.http.get<any>('/api/dashboard/fluxo-caixa', { params }).subscribe({
      next: (data) => {
        this.lineChartData.labels = data.labels;
        this.lineChartData.datasets[0].data = data.saldos; // <-- Usa a nova linha de saldos
        this.lineChartData.datasets[1].data = data.receitas;
        this.lineChartData.datasets[2].data = data.despesas;
        // Força a atualização do gráfico
        this.lineChartData = { ...this.lineChartData };
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico de linhas', err);
      }
    });
  }
}