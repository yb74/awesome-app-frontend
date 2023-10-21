import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from './AuthGuard';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  constructor(private authGuard: AuthGuard, private router: Router) {}

  canActivate(): boolean {
    if (this.authGuard.isAuthenticated()) {
      this.router.navigateByUrl('/home'); // Redirect to the home page if already authenticated
      return false;
    }
    return true;
  }
}
