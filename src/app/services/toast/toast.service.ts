import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  private toastMessage = new BehaviorSubject<string>(''); // Initial value
  private isToastVisible = new BehaviorSubject<boolean>(false);
  toastMessage$ = this.toastMessage.asObservable();
  isToastVisible$ = this.isToastVisible.asObservable();

  public updateToastMessage(newStatus: string) {
    this.toastMessage.next(newStatus);
  }

  public updateToastVisibility(newStatus: boolean) {
    this.isToastVisible.next(newStatus);
  }
}
