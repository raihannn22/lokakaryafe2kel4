import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private apiUrl = 'http://localhost:8081/emp-achievement-skill';
  private apiUrl2 = 'http://localhost:8081/emp-attitude-skill';

  constructor(private http: HttpClient) {}
  getEmpAchievementById(userId: string): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-achievement-skill/get/user/${userId}`
    );
  }

  getEmpAchievementByIdandYear(userId: string, year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-achievement-skill/get/user/${userId}/year/${year}`
    );
  }

  getAllAchievements(): Observable<any> {
    return this.http.get('http://localhost:8081/achievement/all');
  }

  getEmpAttitudeSkillById(userId: string): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-attitude-skill/user/${userId}`
    );
  }

  getEmpAttitudeSkillByIdandYear(
    userId: string,
    year: number
  ): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-attitude-skill/user/${userId}/year/${year}`
    );
  }

  getAllSuggestionByYear(userId: string, year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-suggestion/user/${userId}/year/${year}`
    );
  }

  getEmpAttitudeSkillByYear(year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-attitude-skill/get/year/${year}`
    );
  }

  getEmpAchievementByYear(year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/emp-achievement-skill/get/year/${year}`
    );
  }

  getTotalScore(year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/assessmentSummary/total/${year}`
    );
  }
  getUserAndSummary(year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/assessmentSummary/get/all/year/${year}`
    );
  }

  setAssessmentStatus1(userId: string, year: number): Observable<any> {
    return this.http.patch(
      `http://localhost:8081/assessmentSummary/update/${userId}/assessment/${year}/set/1`,
      {}
    );
  }

  setAssessmentStatus0(userId: string, year: number): Observable<any> {
    return this.http.patch(
      `http://localhost:8081/assessmentSummary/update/${userId}/assessment/${year}/set/0`,
      {}
    );
  }

  getAssessmentStatus(userId: string, year: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/assessmentSummary/get/${userId}/assessment/${year}`
    );
  }
}
