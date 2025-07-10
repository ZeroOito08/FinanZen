import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';

// Componentes
import { AppComponent } from './app.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TransactionListComponent } from './pages/transaction-list/transaction-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { BudgetManagementComponent } from './pages/budget-management/budget-management.component';

// Guards e Interceptors
import { authGuard } from './guards/auth.guard';
import { authInterceptor } from './interceptors/auth.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'transacoes', component: TransactionFormComponent, canActivate: [authGuard] },
  { path: 'minhas-transacoes', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'categorias', component: CategoryListComponent, canActivate: [authGuard] },
  { path: 'orcamentos', component: BudgetManagementComponent, canActivate: [authGuard] },
  { path: 'relatorios', component: ReportsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    TransactionFormComponent,
    LoginComponent,
    RegisterComponent,
    TransactionListComponent,
    NavbarComponent,
    DashboardComponent,
    CategoryListComponent,
    CategoryFormComponent,
    LoadingSpinnerComponent,
    ReportsComponent,
    BudgetManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgChartsModule
  ],
  providers: [
    // Forma correta de registar o interceptor de classe (Loading)
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    // Forma correta de registar o interceptor de função (Auth)
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }