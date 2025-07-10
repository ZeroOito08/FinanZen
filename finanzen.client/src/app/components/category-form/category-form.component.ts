import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  // Recebe os dados da categoria a ser editada (se houver)
  @Input() categoriaParaEditar: any | null = null;
  
  // Eventos para comunicar com o componente pai
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  // Modelo de dados local para o formulário
  public categoria: any = {};
  public tituloModal = 'Nova Categoria';

  constructor() { }

  ngOnInit(): void {
    // Se recebermos uma categoria para editar, preenchemos o formulário com ela
    if (this.categoriaParaEditar) {
      this.tituloModal = 'Editar Categoria';
      this.categoria = { ...this.categoriaParaEditar }; // Clona o objeto
    } else {
      // Se não, inicia um formulário em branco para uma nova categoria
      this.tituloModal = 'Nova Categoria';
      this.categoria = { nome: '', tipo: 'Despesa' };
    }
  }

  onSubmit(): void {
    // Emite o evento 'salvar' com os dados atuais do formulário
    this.salvar.emit(this.categoria);
  }
}