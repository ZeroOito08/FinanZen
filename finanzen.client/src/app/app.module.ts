import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Adicionado para formulários
import { HttpClientModule } from '@angular/common/http'; // <-- Adicionado para API

import { AppComponent } from './app.component';
// O Angular CLI já deve ter adicionado a linha abaixo para você:
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionFormComponent // Garantir que está aqui
  ],
  imports: [
    BrowserModule,
    FormsModule, // <-- Adicionar aqui
    HttpClientModule // <-- Adicionar aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }