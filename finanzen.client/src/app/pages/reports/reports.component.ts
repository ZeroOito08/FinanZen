import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// Importa os nossos modelos atualizados
import { TransacaoDetalhes, PaginatedResult } from '../../models/transacao.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @ViewChild('reportContent') reportContent!: ElementRef;

  public transacoes: TransacaoDetalhes[] = [];
  public dataGeracao: Date = new Date();
  public filtros = { dataInicio: '', dataFim: '', tipo: 'Todos' };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let params = new HttpParams();
    if (this.filtros.dataInicio) {
      params = params.append('dataInicio', this.filtros.dataInicio);
    }
    if (this.filtros.dataFim) {
      params = params.append('dataFim', this.filtros.dataFim);
    }
    if (this.filtros.tipo && this.filtros.tipo !== 'Todos') {
      params = params.append('tipo', this.filtros.tipo);
    }

    // AQUI ESTÁ A CORREÇÃO: Usamos o PaginatedResult
    this.http.get<PaginatedResult<TransacaoDetalhes>>('/api/transacoes', { params }).subscribe({
      next: (data) => {
        // Guardamos apenas a lista 'items' da resposta
        this.transacoes = data.items;
      },
      error: (err) => {
        alert('Falha ao carregar os dados para o relatório.');
      }
    });
  }

  public exportarParaPDF(): void {
    // ... (sua função de exportar continua a mesma)
  }
}