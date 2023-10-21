import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenExpirationService } from '../token-expiration-service/token-expiration.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private tokenExpirationService: TokenExpirationService
    ) { }

  isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    return !!token; // Check if the token exists
  }

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    }
  
    this.tokenExpirationService.getTokenExpirationObservable().subscribe(() => {
      // Token is expired, redirect to /login
      this.router.navigateByUrl('/login');
    });
  
    return true;
  }
}