import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public token: string = localStorage.getItem("jwt")!;
  public userProfile: User;


  constructor(
    private loginService: LoginService
  ) {
    this.userProfile = {name: "", email: "", roles: "", password: ""}
  }

  ngOnInit(): void {
    const accessTokenJSON = JSON.parse(this.token).accessToken

    this.getUserProfile(accessTokenJSON.toString())
    console.log(accessTokenJSON)
  }

  getUserProfile(token: string) {
    this.loginService.getUserProfile(token)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return throwError(() => error);
          })
        )
        .subscribe((response: User) => {
          this.userProfile = response;
          console.log(response);
        });
  }

}
