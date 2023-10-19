import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  /*
    function that send username and password to backend, backend check if data match user in db and generate a token
  */
  loginRegister(value: Partial<{ username: string | null; password: string | null; }>): Observable<any> {
    console.log(value.username, value.password);
    let option: any;
    return this.httpClient.post<string>(`${this.apiBaseUrl}/auth/generateToken`, value, {...option, responseType: 'text'} );
  }

  /*
    function that send details of the logged in user.
    it takes the token in request header and the backend decode it to send data of the user connected
  */
  getUserProfile(token: string) : Observable<User> {
    // Create headers with the Authorization header containing the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Include the headers in the HTTP request
    const options = { 
      headers: headers
    };

    // Make the request to the back-end
    return this.httpClient.get<User>(`${this.apiBaseUrl}/auth/user/userdetails`, options);
  }

  refreshToken(expiredTokenId: string) : Observable<string> {
    const body = {
      token: expiredTokenId
    }
    return this.httpClient.post<any>(`${this.apiBaseUrl}/auth/refreshToken`, body);
  }
}