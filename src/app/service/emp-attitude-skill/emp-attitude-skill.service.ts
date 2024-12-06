import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpAttitudeSkillService {
  private apiUrl = 'http://localhost:8081/emp-attitude-skill';

  constructor(private http: HttpClient) {}

  getAllGroupAttitudeWithDetails(): Observable<any> {
    return this.http.get('http://localhost:8081/group-attitude-skill/with-details');
  }

  saveAllEmpAttitudeSkills(empAttitudeSkills: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-all`, empAttitudeSkills);
  }

  getEmpAttitudeSkillByUserId(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // getEmpAttitudeSkillByUserId(userId: string): Observable<any[]> {
  // return this.http.get<any[]>(`/api/emp-attitude-skill/user/${userId}`); 
// }


}
