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

  loginRegister(value: Partial<{ username: string | null; password: string | null; }>): Observable<any> {
    console.log(value.username, value.password);
    let option: any;
    return this.httpClient.post<any>(`${this.apiBaseUrl}/auth/generateToken`, value, {...option, responseType: 'text'} );
  }

  getUserProfile(token: string) : Observable<any> {
    // Create headers with the Authorization header containing the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': ' http://localhost:4200',
      // 'Access-Control-Allow-Credentials': 'true',
      // 'Access-Control-Allow-Methods': '*',
      // 'Access-Control-Max-Age': ' 3600',
      // 'Access-Control-Allow-Headers': '*'
    });

    // Include the headers in the HTTP request
    const options = { 
      headers: headers
    };

    // Make the request to the back-end
    return this.httpClient.get<any>(`${this.apiBaseUrl}/auth/user/userProfile`, options);
  }
}