import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';
import { TokenTimerService } from 'src/app/services/token-timer/token-timer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isToastVisible$: Observable<boolean>;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastService: ToastService,
    private tokenService: TokenService,
    private tokenTimerService: TokenTimerService
  ) {
    this.isToastVisible$ = this.toastService.isToastVisible$;
  }

  shouldShowErrorStyle(): boolean {
    return this.loginForm.invalid;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.loginRegister(this.loginForm.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            if (error.status === 0) {
              this.toastService.updateToastMessage('Network error. Please check your connection.');
            } else if (error.status === 403) {
              console.log(error);
              this.toastService.updateToastMessage('Forbidden');
            } else {
              console.log(error);
              this.toastService.updateToastMessage(error.error);
            }
  
            this.toastService.updateToastVisibility(true);
            setTimeout(() => {
              this.toastService.updateToastVisibility(false);
            }, 5000);
  
            return throwError(() => error);
          })
        )
        .subscribe((response: any) => {
          console.log(response);
  
          if (!response.error) {
            // Use the TokenService to set the access token
            this.tokenService.setAccessToken(response);
  
            // Calculate the remaining time until token expiration
            const remainingTime = this.tokenService.calculateTokenExpirationTime();
            const countdown = this.tokenService.getTokenExpirationCountdown$();
  
            if (remainingTime <= 0) {
              this.tokenTimerService.show('Token has expired');
              console.log('Token has expired');
              // this.router.navigate(['/login']);
              // console.log("redirected to /login")
            } else {
              this.tokenTimerService.show(`Token will expire in ${countdown}`);
              console.log(`Token will expire in ${countdown}`);
              this.router.navigate(['/home']);
            }
          }
        });
    }
  }  
}