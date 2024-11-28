import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupAttitudeSkillService {
  private apiUrl = 'http://localhost:8081/group-attitude-skill';

  constructor(private http: HttpClient) {}

  getAllGroupAttitudeSkills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }


  saveGroupAttitudeSkill(groupAttitudeSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, groupAttitudeSkill);
  }

  updateGroupAttitudeSkill(id: string, groupAttitudeSkill: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, groupAttitudeSkill);
  }


  getGroupAttitudeSkillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteGroupAttitudeSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}