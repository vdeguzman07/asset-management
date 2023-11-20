import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: Object) {
    return this.http.post(
      `https://reveal-server.netlify.app/.netlify/functions/server/api/v1/user/login`,
      body
    );
  }
}
