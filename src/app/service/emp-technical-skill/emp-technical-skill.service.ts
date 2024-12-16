import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpTechnicalSkillService {
  private apiUrl = 'http://localhost:8081/emp-technical-skill';

  constructor(private http: HttpClient) {}

  getAllTechnicalSkills(): Observable<any> {
    return this.http.get<any>('http://localhost:8081/technical-skill/all');
  }

  saveAllEmpTechnicalSkills(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-all`, data);
  }

  getEmpTechnicalSkillByUserId(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getEmpTechnicalSkillsByUserIdAndAssesmentYear(
    userId: string,
    assessmentYear: number
  ): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}/year/${assessmentYear}`
    );
  }
}
