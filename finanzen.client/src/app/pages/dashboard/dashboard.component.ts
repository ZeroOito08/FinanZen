import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js'; // Import ChartData

// Interface for the financial summary
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
  
  // --- Properties for the Pie Chart ---
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  // Correctly typed data object for the chart
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartLegend = true;
  // --- End of Chart Properties ---

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarDadosGrafico(); // This call is now correctly placed
  }

  carregarResumo(): void {
    this.http.get<ResumoFinanceiro>('/api/dashboard/resumo').subscribe({
      next: (data) => {
        this.resumo = data;
      },
      error: (err) => {
        console.error('Error loading financial summary', err);
      }
    });
  }

  // This function is now correctly defined as a method of the class
  carregarDadosGrafico(): void {
    this.http.get<any[]>('/api/dashboard/despesas-por-categoria').subscribe({
      next: (data) => {
        console.log("Chart data received:", data);
        
        // Update the properties of the pieChartData object
        this.pieChartData.labels = data.map(item => item.categoria);
        this.pieChartData.datasets[0].data = data.map(item => item.total);
      },
      error: (err) => {
        console.error('Error loading chart data', err);
      }
    });
  }
}