import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiBaseUrl = environment.apiBaseUrl;
  
  constructor(private httpClient: HttpClient) { }
  
  public loginRegister(value: Partial<{ username: string | null; password: string | null; }>) {
      console.log(value.username, value.password)
    this.httpClient.post<any>(`${this.apiBaseUrl}/user`, value).subscribe( () => {
      console.log('OK');
    }
    )
  }
}


