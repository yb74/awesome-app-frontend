import { Component, HostListener, OnInit } from '@angular/core';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public isToastVisible$: Observable<boolean>;
  
  public token: string = localStorage.getItem("jwt")!;
  public remainingTime = this.tokenService.calculateTokenExpirationTime();

  public userProfile: User;
  public numClicks = 0;
  public countdownMsg = "";
  public showCountdownMsg = false;

  constructor(
    private loginService: LoginService,
    private toastService: ToastService,
    private tokenService: TokenService
  ) {
    this.userProfile = { name: "", email: "", roles: "", password: "" };
    this.isToastVisible$ = this.toastService.isToastVisible$;
  }

  ngOnInit(): void {
    const accessTokenJSON = JSON.parse(this.token).accessToken;
    this.getUserProfile(accessTokenJSON.toString());

    // Display counter with the remaining time until token expiration
    // if (this.remainingTime <= 10) {
      this.tokenService.getTokenExpirationCountdown$().subscribe((countdown) => {
        this.showCountdownMsg = true;
        this.countdownMsg = countdown
      })
    // }
  }
  
  @HostListener('document:click', ['$event'])
  onMouseclick(e: MouseEvent) {
    // code to refresh the token
    const jwtItem = localStorage.getItem("jwt");

    if (!jwtItem) {
      console.log("JWT token not found in localStorage.");
      return;
    }

    if (this.tokenService.calculateTokenExpirationTime() < 20) {
      this.numClicks +=1

      console.log("clicked refresh");
      if (this.numClicks >= 10) {
        this.numClicks = 0
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
              }
            });
        } catch (error) {
          // case where the stored JWT token is not in the expected JSON format.
          console.log("Invalid JWT token format in localStorage.");
        }
      }
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

  logout() {
    this.tokenService.clearAccessToken();
  }
}
