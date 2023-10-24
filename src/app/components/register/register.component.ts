import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { RegisterService } from 'src/app/services/register/register.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public isToastVisible$: Observable<boolean>;

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_\-])[A-Za-z\d@$!%*?_\-]{6,}$/)]],
    // password: ['', [Validators.required,  this.matchValidator('password')]],
    repeatPassword: ['', [Validators.required, this.matchValidator('password')]]
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private loginService: LoginService,
    private toastService: ToastService,
    private tokenService: TokenService
    ) {
      this.isToastVisible$ = this.toastService.isToastVisible$;
    }

    matchValidator(controlName: string) {
      return (control: AbstractControl) => {
        if (this.registerForm && control.value === this.registerForm.get(controlName)?.value) {
          return null;
        }
        return { notMatching: true };
      };
    }

    shouldShowErrorStyle(): boolean {
      return this.registerForm.invalid;
    }

    onSubmit() {
      if (this.registerForm.valid) {
        console.log(this.registerForm.value);
    
        this.registerService.register(this.registerForm.value)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.log(error.message);
              return throwError(() => error);
            }),
            switchMap((response: any) => {
              if (!response.error) {
                return this.loginService.loginRegister({ username: this.registerForm.value.name, password: this.registerForm.value.password });
              } else {
                return throwError(() => new Error("User registration failed"));
              }
            })
          )
          .subscribe((loginResponse: any) => {
            if (loginResponse) {
              this.tokenService.setAccessToken(loginResponse);
    
              if (!loginResponse.error) {
                this.router.navigate(['/home']);
              }
            }
          });
      }
    }
}
