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
}
