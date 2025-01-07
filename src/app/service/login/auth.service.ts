import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/Auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.user.id);
        localStorage.setItem('full_name', response.user.full_name);
        localStorage.setItem(
          'role',
          response.user.app_role.map((role: any) => role.roleName)
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('full_name');
    localStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  changePassword(
    current_password: string,
    new_password: string,
    confirm_password: string
  ): Observable<any> {
    const url = 'http://localhost:8081/Auth/changePassword';
    const data = { current_password, new_password, confirm_password };
    return this.http.post(url, data);
  }
}
