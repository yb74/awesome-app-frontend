import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {
  private tokenExpirationSubject = new Subject<void>();

  constructor(private tokenService: TokenService) {
    // Check the token expiration periodically and emit an event when it expires
    timer(0, 1000) // Check every second
      .subscribe(() => {
        if (this.tokenService.isTokenExpired()) {
          this.tokenExpirationSubject.next();
        }
      });
  }

  getTokenExpirationObservable(): Observable<void> {
    return this.tokenExpirationSubject.asObservable();
  }
}
