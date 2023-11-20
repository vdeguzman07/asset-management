import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: Object) {
    return this.http.post(
      `https://sfeast-server-238a9fe9c893.herokuapp.com/api/v1/auth/login`,
      body
    );
  }
}
