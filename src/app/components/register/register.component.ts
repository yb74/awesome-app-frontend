import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { RegisterService } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', [Validators.required, this.matchValidator('password')]],
    // roles: ['', Validators.required]
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService
    ) {
    }

    matchValidator(controlName: string) {
      return (control: any) => {
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
      console.log(this.registerForm.value)
      this.registerService.register(this.registerForm.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error.message);
            return throwError(() => error);
          })
        )
        .subscribe((response: any) => {
          console.log(response);
          if (!response.error) {
            this.router.navigate(['/login']);
          }
        });
    }
  }
}
