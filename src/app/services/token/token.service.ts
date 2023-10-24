import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {}

  setAccessToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('jwt');
  }

  clearAccessToken(): void {
    localStorage.removeItem('jwt');
  }

  // Calculate and return the remaining time until token expiration in seconds
  calculateTokenExpirationTime(): number {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      return Math.max(0, Math.floor((expirationTime - currentTime) / 1000)); // Remaining seconds
    }
    return 0; // Return 0 if there's no token
  }

  // Calculate and return a countdown string for token expiration
  getTokenExpirationCountdown$(): Observable<string> {
    return this.calculateTokenExpirationTime$().pipe(
      map((remainingSeconds) => {
        if (remainingSeconds <= 0) {
          return 'Token has expired';
        }
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `Token will expire in ${minutes}m ${seconds}s`;
      })
    );
  }

  private calculateTokenExpirationTime$(): Observable<number> {
    return timer(0, 1000).pipe(
      map(() => this.calculateTokenExpirationTime())
    );
  }

  isTokenExpired(): boolean {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return currentTime > expirationTime;
    }
    return true; // If there's no token, consider it expired
  }
}
