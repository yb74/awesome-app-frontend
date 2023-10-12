import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  public loginRegister(value: Partial<{ username: string | null; password: string | null; }>): Observable<User> {
    console.log(value.username, value.password);

    return this.httpClient.post<User>(`${this.apiBaseUrl}/user`, value);
  }
}