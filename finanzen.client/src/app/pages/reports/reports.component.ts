import { HttpClient, HttpParams } from '@angular/common/http';
// Importe ViewChild e ElementRef do Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransacaoDetalhes } from '../../models/transacao.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  // Usa @ViewChild para obter uma referência segura ao elemento #reportContent do HTML
  @ViewChild('reportContent') reportContent!: ElementRef;

  public transacoes: TransacaoDetalhes[] = [];
  public dataGeracao: Date = new Date();

  public filtros = {
    dataInicio: '',
    dataFim: '',
    tipo: 'Todos'
  };

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

    this.http.get<TransacaoDetalhes[]>('/api/transacoes', { params }).subscribe({
      next: (data) => { this.transacoes = data; },
      error: (err) => { alert('Falha ao carregar os dados para o relatório.'); }
    });
  }

  public exportarParaPDF(): void {
    // Agora usamos a referência injetada pelo @ViewChild
    const content = this.reportContent.nativeElement;

    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('relatorio_finanzen.pdf');
    });
  }
}