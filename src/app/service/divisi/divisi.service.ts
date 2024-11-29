import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisiService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  createDivision(division: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/division/save`, division);
  }
  getAllDivisions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/division/get/all`);
  }

  saveDivision(division: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/division/save`, division);
  }

  updateDivision(id: string, division: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/division/update/${id}`, division);
  }

  deleteDivision(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/division`);
  }
}
