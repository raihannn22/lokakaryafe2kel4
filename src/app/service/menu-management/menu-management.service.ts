import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  gettAllMenu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/appMenu/get/all`);
  }

  gettAllRole(): Observable<any> {
    return this.http.get(`${this.apiUrl}/appRole/get/all`);
  }

  updateRoleMenu(roleMenuData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/appRoleMenu/create`, roleMenuData); // Endpoint update role-menu
  }

  getAllRoleMenu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/appRoleMenu/get/all`); // Endpoint get all role-menu
  }

  getMenuByUserId(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/appMenu/get/byUserId/${userId}`); // Endpoint get menu by user id
  }
}
