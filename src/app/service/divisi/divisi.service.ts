import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DivisiService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  createDivision(division: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/division/save`, division);
  }

  getAllDivisions(
    page: number = 0,
    size: number = 5,
    sort: string = 'divisionName',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/division/get/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
  }

  saveDivision(division: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/division/save`, division);
  }

  updateDivision(id: string, division: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/division/update/${id}`, division);
  }

  deleteDivision(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/division/delete/${id}`);
  }
}
