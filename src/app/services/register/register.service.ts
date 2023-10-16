import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  register(value: Partial<{ name: string | null; email: string | null; password: string | null; /*roles: string | null;*/}>): Observable<any> {
    console.log(value.name, value.email, value.password);
    let option: any;
    return this.httpClient.post<any>(`${this.apiBaseUrl}/auth/addNewUser`, value, {...option, responseType: 'text'} );
  }
}
