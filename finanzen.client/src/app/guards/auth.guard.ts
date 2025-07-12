import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; // Data de expiração em segundos (Unix timestamp)
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000; // timestamp atual em segundos

    if (decoded.exp && decoded.exp < now) {
      // Token expirado
      authService.logout();
      router.navigate(['/login']);
      return false;
    }

    // Token válido
    return true;
  } catch (error) {
    // Token malformado ou não decodificável
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
};
