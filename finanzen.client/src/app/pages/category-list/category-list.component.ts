import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { environment } from 'src/environments/environment.prod'; // <-- Importação do ambiente

// A sua interface Categoria continua a mesma
export interface Categoria {
  categoriaID: number;
  nome: string;
  tipo: 'Receita' | 'Despesa';
  usuarioID?: number; 
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categorias: Categoria[] = [];
  public mostrarModal = false;
  public categoriaSelecionada: Categoria | null = null;

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    // CORREÇÃO: Usando a URL completa do ambiente
    this.http.get<Categoria[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { this.notification.showError('Falha ao carregar as categorias.'); }
    });
  }

  deletarCategoria(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      // CORREÇÃO: Usando a URL completa do ambiente
      this.http.delete(`${environment.apiUrl}/categorias/${id}`).subscribe({
        next: () => {
          this.notification.showSuccess('Categoria excluída com sucesso!');
          this.categorias = this.categorias.filter(c => c.categoriaID !== id);
        },
        error: (err) => { this.notification.showError(err.error || 'Falha ao excluir a categoria.'); }
      });
    }
  }

  abrirModal(categoria?: Categoria): void {
    if (categoria) {
      this.categoriaSelecionada = { ...categoria }; 
    } else {
      this.categoriaSelecionada = null;
    }
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.categoriaSelecionada = null;
  }

  salvarCategoria(categoriaParaSalvar: any): void {
    if (this.categoriaSelecionada && this.categoriaSelecionada.categoriaID) {
      // CORREÇÃO: Usando a URL completa do ambiente
      this.http.put<Categoria>(`${environment.apiUrl}/categorias/${this.categoriaSelecionada.categoriaID}`, categoriaParaSalvar).subscribe({
        next: (categoriaAtualizada) => {
          this.notification.showSuccess('Categoria atualizada com sucesso!');
          const index = this.categorias.findIndex(c => c.categoriaID === categoriaAtualizada.categoriaID);
          if (index !== -1) {
            this.categorias[index] = categoriaAtualizada;
          }
          this.fecharModal();
        },
        error: (err) => this.notification.showError('Erro ao atualizar a categoria.')
      });
    } else {
      // CORREÇÃO: Usando a URL completa do ambiente
      this.http.post<Categoria>(`${environment.apiUrl}/categorias`, categoriaParaSalvar).subscribe({
        next: (categoriaCriada) => {
          this.notification.showSuccess('Categoria salva com sucesso!');
          this.categorias.push(categoriaCriada);
          this.fecharModal();
        },
        error: (err) => this.notification.showError('Erro ao salvar a categoria.')
      });
    }
  }
}
