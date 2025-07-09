import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token'); // Busca o token no navegador

  if (token) {
    // Se o token existe, o usuário pode acessar a rota.
    return true;
  } else {
    // Se não há token, redireciona para a página de login.
    router.navigate(['/login']);
    return false;
  }
};