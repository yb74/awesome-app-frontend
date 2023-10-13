import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public token: string = localStorage.getItem("jwt")!;

  constructor(
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getUserProfile(this.token)
  }

  getUserProfile(token: any) {
    this.loginService.getUserProfile(token)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error.message);
            return throwError(() => error);
          })
        )
        .subscribe((response: any) => {

          console.log(response);
        });
  }

}
