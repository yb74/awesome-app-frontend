import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, timer } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenTimerService {
  private toastMessageSubject = new BehaviorSubject<string>('');
  private showToastSubject = new BehaviorSubject<boolean>(false);

  toastMessage$: Observable<string> = this.toastMessageSubject.asObservable();
  showToast$: Observable<boolean> = this.showToastSubject.asObservable();

  constructor(private tokenService: TokenService) {
    // Start a timer to update the countdown every second
    timer(0, 1000)
      .pipe(
        switchMap(() => this.tokenService.getTokenExpirationCountdown$())
      )
      .subscribe((countdown) => {
        this.toastMessageSubject.next(countdown);
      });
  }

  show(message: string) {
    this.toastMessageSubject.next(message);
    this.showToastSubject.next(true);
  }

  hide() {
    this.showToastSubject.next(false);
  }
}
