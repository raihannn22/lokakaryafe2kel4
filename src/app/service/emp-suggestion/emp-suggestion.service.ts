import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpSuggestionService {
  private apiUrl = 'http://localhost:8081/emp-suggestion';

  constructor(private http: HttpClient) {}

  saveAllEmpSuggestions(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-all`, data);
  }

  getEmpSuggestionByUserId(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getEmpSuggestionByUserIdAndAssesmentYear(
    userId: string,
    assessmentYear: number
  ): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}/year/${assessmentYear}`
    );
  }
}
