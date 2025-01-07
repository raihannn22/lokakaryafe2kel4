import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevplanService {
  private apiUrl = 'http://localhost:8081/devPlan';

  constructor(private http: HttpClient) {}

  getAllDevplans(
    page: number = 0,
    size: number = 5,
    sort: string = 'plan',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/get/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
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
