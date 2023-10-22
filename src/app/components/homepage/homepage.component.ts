import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenTimerService } from 'src/app/services/token-timer/token-timer.service';
import { TokenService } from 'src/app/services/token/token.service';

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
    private router: Router,
    private toastService: ToastService,
    private tokenTimerService: TokenTimerService,
    private tokenService: TokenService
  ) {
    this.userProfile = { name: "", email: "", roles: "", password: "" };
    this.isToastVisible$ = this.toastService.isToastVisible$;

    // Calculate the remaining time until token expiration
    const remainingTime = this.tokenService.calculateTokenExpirationTime();
    const countdown = this.tokenService.getTokenExpirationCountdown$();

    if (remainingTime <= 0) {
      this.tokenTimerService.show('Token has expired');
    } else {
      this.tokenTimerService.show(`Token will expire in ${countdown}`);
    }
  }

  ngOnInit(): void {
    const accessTokenJSON = JSON.parse(this.token).accessToken;
    this.getUserProfile(accessTokenJSON.toString());
  }

  @HostListener('document:click', ['$event'])
  onMouseclick(e: MouseEvent) {
    console.log("clicked refresh");

    // Your code to refresh the token
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
          catchError((error) => {
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
          if (!response.error) {
            console.log(response);
            console.log("token refreshed");

            // Update both the access token and refresh token in storage with the new values
            const updatedToken = {
              accessToken: response.accessToken,
              token: response.token // Update the refresh token as well
            };

            this.tokenService.setAccessToken(JSON.stringify(updatedToken));

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
              // this.router.navigate(['/home']);
            }
          }
        });
    } catch (error) {
      // Handle the case where the stored JWT token is not in the expected JSON format.
      console.log("Invalid JWT token format in localStorage.");
    }
  }

  getUserProfile(token: string) {
    this.loginService.getUserProfile(token)
      .pipe(
        catchError((error) => {
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
