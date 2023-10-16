import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services//login/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';

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
    private toastService: ToastService
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
          console.log(error)
          if (error.status === 0) {
            this.toastService.updateToastMessage(
              'Network error. Please check your connection.'
            );
          } else {
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

          localStorage.setItem("jwt", response);
          if (!response.error) {
            this.router.navigate(['/home']);
          }
        });
    }
  }
}