import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpDevplanService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getAllDevPlan(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/devPlan/get/all`);
  }

  saveEmpDevPlan(empDevPlan: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/empDevPlan/create`, empDevPlan);
  }

  getAllEmpDevPlan(id: string, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/empDevPlan/get/${id}/${year}`);
  }
}
