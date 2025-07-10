import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // BehaviorSubject guarda o último valor e emite-o para novos subscritores.
  // Começa com 'false' (não está a carregar).
  public isLoading = new BehaviorSubject<boolean>(false);
}