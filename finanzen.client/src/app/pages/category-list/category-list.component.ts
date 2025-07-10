import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

// A sua interface Categoria continua a mesma
export interface Categoria {
  categoriaID: number;
  nome: string;
  tipo: 'Receita' | 'Despesa';
  // Adicione a propriedade opcional de utilizador se o seu modelo a tiver
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
    this.http.get<Categoria[]>('/api/categorias').subscribe({
      next: (data) => { this.categorias = data; },
      error: (err) => { this.notification.showError('Falha ao carregar as categorias.'); }
    });
  }

  deletarCategoria(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.http.delete(`/api/categorias/${id}`).subscribe({
        next: () => {
          this.notification.showSuccess('Categoria excluída com sucesso!'); // USAR O SERVIÇO
          this.categorias = this.categorias.filter(c => c.categoriaID !== id);
        },
        error: (err) => { this.notification.showError(err.error || 'Falha ao excluir a categoria.'); } // USAR O SERVIÇO
      });
    }
  }

  // --- MÉTODOS ATUALIZADOS PARA LIDAR COM EDIÇÃO ---

  // Agora recebe uma categoria opcional. Se receber, estamos a editar.
  abrirModal(categoria?: Categoria): void {
    if (categoria) {
      // Clona o objeto para evitar alterações diretas na lista antes de salvar
      this.categoriaSelecionada = { ...categoria }; 
    } else {
      // Se nenhuma categoria for passada, estamos a criar uma nova
      this.categoriaSelecionada = null;
    }
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.categoriaSelecionada = null; // Limpa a seleção ao fechar
  }

  // Agora lida com os dois cenários: criar e atualizar
  salvarCategoria(categoriaParaSalvar: any): void {
    if (this.categoriaSelecionada && this.categoriaSelecionada.categoriaID) {
      this.http.put<Categoria>(`/api/categorias/${this.categoriaSelecionada.categoriaID}`, categoriaParaSalvar).subscribe({
        next: (categoriaAtualizada) => {
          this.notification.showSuccess('Categoria atualizada com sucesso!'); // USAR O SERVIÇO
          const index = this.categorias.findIndex(c => c.categoriaID === categoriaAtualizada.categoriaID);
          if (index !== -1) {
            this.categorias[index] = categoriaAtualizada;
          }
          this.fecharModal();
        },
        error: (err) => this.notification.showError('Erro ao atualizar a categoria.') // USAR O SERVIÇO
      });
    } else {
      this.http.post<Categoria>('/api/categorias', categoriaParaSalvar).subscribe({
        next: (categoriaCriada) => {
          this.notification.showSuccess('Categoria salva com sucesso!'); // USAR O SERVIÇO
          this.categorias.push(categoriaCriada);
          this.fecharModal();
        },
        error: (err) => this.notification.showError('Erro ao salvar a categoria.') // USAR O SERVIÇO
      });
    }
  }
}