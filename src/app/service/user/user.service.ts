import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/user';

  constructor(private http: HttpClient) {}

  getAllUsers(
    page: number = 0,
    size: number = 10,
    sort: string = 'username',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/get/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
  }

  // getAllUsers(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/get/all`);
  // }

  getUsersByDivisionId(divisionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/by-division-id`, {
      params: { divisionId },
    });
  }

  getAllDivision(): Observable<any> {
    return this.http.get(`http://localhost:8081/division/get/all`);
  }

  getAllRole(): Observable<any> {
    return this.http.get(`http://localhost:8081/appRole/get/all`);
  }

  saveUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  resertPassword(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reset-password/${id}`, {});
  }
}
