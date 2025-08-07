import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TransacaoDetalhes, PaginatedResult } from '../../models/transacao.model';
import { NotificationService } from '../../services/notification.service';
import { environment } from 'src/environments/environment.prod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Adicionei a biblioteca FileSaver para facilitar o download do arquivo
import { saveAs } from 'file-saver'; 

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

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) { }

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

    // Corrigido para buscar TODAS as transações para o relatório, não apenas a primeira página.
    // O backend precisa ser capaz de lidar com requisições sem paginação para relatórios.
    this.http.get<PaginatedResult<TransacaoDetalhes>>(`${environment.apiUrl}/transacoes`, { params }).subscribe({
      next: (data) => {
        this.transacoes = data.items;
      },
      error: (err) => {
        this.notification.showError('Falha ao carregar os dados para o relatório.');
      }
    });
  }

  // Função para exportar para PDF (lógica atualizada para usar html2canvas)
  public exportarParaPDF(): void {
    const data = this.reportContent.nativeElement;
    html2canvas(data).then(canvas => {
      // Gera a imagem do relatório em canvas
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save("relatorio-finan-zen.pdf");
      this.notification.showSuccess('Relatório exportado com sucesso para PDF!');
    });
  }

  // Nova função para exportar para XML
  public exportarParaXML(): void {
    // Cria o documento XML a partir dos dados das transações
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<transacoes>\n';
    this.transacoes.forEach(transacao => {
      xmlString += `  <transacao>\n`;
      xmlString += `    <id>${transacao.transacaoID}</id>\n`;
      xmlString += `    <descricao>${transacao.descricao}</descricao>\n`;
      xmlString += `    <valor>${transacao.valor}</valor>\n`;
      xmlString += `    <data>${transacao.data}</data>\n`;
      xmlString += `    <categoria>${transacao.categoriaNome}</categoria>\n`;
      xmlString += `    <tipo>${transacao.tipo}</tipo>\n`;
      xmlString += `  </transacao>\n`;
    });
    xmlString += '</transacoes>';

    // Cria um Blob e salva o arquivo usando a biblioteca FileSaver
    const blob = new Blob([xmlString], { type: 'application/xml' });
    saveAs(blob, `relatorio-finan-zen_${this.dataGeracao.toISOString()}.xml`);
    this.notification.showSuccess('Relatório exportado com sucesso para XML!');
  }
}
