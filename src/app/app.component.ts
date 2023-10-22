import { Component } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoginService } from './services/login/login.service';
import { ToastService } from './services/toast/toast.service';
import { TokenTimerService } from './services/token-timer/token-timer.service'; // Adjust the import path as needed
import { TokenService } from './services/token/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'awesome-app';

  constructor(
    public tokenTimerService: TokenTimerService,
    private loginService: LoginService,
    private toastService: ToastService,
    private tokenService: TokenService
  ) {}

  toastMessage: string = ''; // Initialize with an empty string
  showToast: boolean = false; // Initialize as false


      // Handle token refresh
      handleTokenRefresh() {
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
    
                // // Calculate the remaining time until token expiration
                // const remainingTime = this.tokenService.calculateTokenExpirationTime();
                // const countdown = this.tokenService.getTokenExpirationCountdown$();
    
                // if (remainingTime <= 0) {
                //   this.tokenTimerService.show('Token has expired');
                //   console.log('Token has expired');
              
                //   // Set a timeout to hide the token timer component after 5 seconds
                //   // Hiding it after 5 secs doesn't work yet because guard redirect to login page when token expires
                //   setTimeout(() => {
                //     console.log("hide token")
                //     this.tokenTimerService.hide();
                //   }, 5000);
                // } else {
                //   this.tokenTimerService.show(`Token will expire in ${countdown}`);
                //   console.log(`Token will expire in ${countdown}`);
                // }
              }
            });
        } catch (error) {
          // Handle the case where the stored JWT token is not in the expected JSON format.
          console.log("Invalid JWT token format in localStorage.");
        }
      }
}