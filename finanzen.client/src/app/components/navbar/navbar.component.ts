import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 1. Importar

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isDarkMode = false;

  // 2. Injetar o AuthService
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    document.body.setAttribute('data-theme', savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  logout(): void {
    this.authService.logout(); // 3. AVISAR O SERVIÇO
    this.router.navigate(['/login']);
  }
}