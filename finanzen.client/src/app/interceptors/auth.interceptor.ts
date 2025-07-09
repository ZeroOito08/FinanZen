import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('jwt_token');

  if (token) {
    // Clona a requisição original e adiciona o novo cabeçalho
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Envia a requisição clonada com o cabeçalho
    return next(clonedReq);
  }

  // Se não houver token, apenas passa a requisição original adiante
  return next(req);
};