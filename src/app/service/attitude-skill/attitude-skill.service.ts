import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttitudeSkillService {
  private apiUrl = 'http://localhost:8081/attitude-skill';

  constructor(private http: HttpClient) {}

  getAllAttitudeSkills(
    page: number = 0,
    size: number = 10,
    sort: string = 'groupAttitudeSkill.id',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
  }

  getAllGroupAttitudeSkills(): Observable<any> {
    return this.http.get('http://localhost:8081/group-attitude-skill/all');
  }

  saveAttitudeSkill(attitudeSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, attitudeSkill);
  }

  updateAttitudeSkill(id: string, attitudeSkill: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, attitudeSkill);
  }

  getAttitudeSkillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteAttitudeSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getAllAttitudeSkillsEnabled(): Observable<any> {
    return this.http.get(
      `http://localhost:8081/group-attitude-skill/get/all/enabled`
    );
  }
}
