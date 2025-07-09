import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Guarda o estado de visibilidade do menu. Começa como 'false' (escondido).
  public showNavbar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}