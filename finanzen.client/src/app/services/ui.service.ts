// src/app/services/ui.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // A visibilidade começa como 'false'
  public showNavbar = new BehaviorSubject<boolean>(false);
}