import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://localhost:8081/emp-achievement-skill';
  private apiUrl2 = 'http://localhost:8081/emp-attitude-skill';

  constructor(private http: HttpClient) {

  }
  getEmpAchievementById(userId: string): Observable<any> {
    return this.http.get(`http://localhost:8081/emp-achievement-skill/get/user/${userId}`);
  }

  getEmpAttitudeSkillById(userId: string): Observable<any> {
    return this.http.get(`http://localhost:8081/emp-attitude-skill/user/${userId}`);
  }


}
