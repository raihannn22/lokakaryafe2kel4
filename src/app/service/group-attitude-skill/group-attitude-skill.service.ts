import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'http';

@Injectable({
  providedIn: 'root',
})
export class GroupAttitudeSkillService {
  private apiUrl = 'http://localhost:8081/group-attitude-skill';

  constructor(private http: HttpClient) {}

  getAllGroupAttitudeSkills(
    page: number = 0,
    size: number = 10,
    sort: string = 'groupName',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
  }

  saveGroupAttitudeSkill(groupAttitudeSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, groupAttitudeSkill);
  }

  updateGroupAttitudeSkill(
    id: string,
    groupAttitudeSkill: any
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, groupAttitudeSkill);
  }

  getGroupAttitudeSkillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteGroupAttitudeSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getGroupAttitudeSkillsWithDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/with-details`);
  }

  getGroupAttitudeSkillsEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/all/enabled`);
  }
}
