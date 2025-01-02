import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevplanService {
  private apiUrl = 'http://localhost:8081/devPlan';

  constructor(private http: HttpClient) {}

  getAllDevplans(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/all`);
  }

  saveDevPlan(devPlan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/save`, devPlan);
  }

  updateDevPlan(id: string, devPlan: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, devPlan);
  }

  deleteDevPlan(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
