import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  localStorageUpdated: Subject<any> = new Subject<any>();
  checkLocalStorageUpdate: Observable<number> = this.localStorageUpdated.asObservable();

  constructor() { }
}
