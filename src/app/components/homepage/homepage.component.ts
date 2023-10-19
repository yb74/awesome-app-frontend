import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public isToastVisible$: Observable<boolean>;
  public token: string = localStorage.getItem("jwt")!;
  public userProfile: User;

  constructor(
    private loginService: LoginService,
    private toastService: ToastService
  ) {
    this.userProfile = { name: "", email: "", roles: "", password: "" };
    this.isToastVisible$ = this.toastService.isToastVisible$;
  }

  ngOnInit(): void {
    const accessTokenJSON = JSON.parse(this.token).accessToken;
    this.getUserProfile(accessTokenJSON.toString());
    console.log(accessTokenJSON);
  }

  @HostListener('document:click', ['$event'])
  onMouseclick(e: MouseEvent) {
    console.log("clicked refresh");

    const jwtItem = localStorage.getItem("jwt");

    if (!jwtItem) {
      // Handle the case where the item is not found in localStorage.
      console.log("JWT token not found in localStorage.");
      return;
    }

    try {
      const jwt = JSON.parse(jwtItem);

      this.loginService.refreshToken(jwt.token)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error);

            if (error.status === 0) {
              this.toastService.updateToastMessage('Network error. Please check your connection.');
            } else if (error.status === 403) {
              console.log(error);
              this.toastService.updateToastMessage("Forbidden");
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
          console.log("token refreshed");
        
          // Update both the access token and refresh token in storage with the new values
          const updatedToken = {
            accessToken: response.accessToken,
            token: response.token // Update the refresh token as well
          };
        
          localStorage.setItem("jwt", JSON.stringify(updatedToken));
        });
    } catch (error) {
      // Handle the case where the stored JWT token is not in the expected JSON format.
      console.log("Invalid JWT token format in localStorage.");
    }
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
