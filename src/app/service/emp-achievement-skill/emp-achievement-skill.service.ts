import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpAchievementSkillService {
  private apiUrl = 'http://localhost:8081/emp-achievement-skill';

  constructor(private http: HttpClient) {}

  getAllEmpAchievementSkills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getAllAchievements(): Observable<any> {
    return this.http.get('http://localhost:8081/achievement/all');
  }

  getAllUsers(): Observable<any> {
    return this.http.get('http://localhost:8081/user/get/all');
  }

  getAllGroupAchievements(): Observable<any> {
    return this.http.get('http://localhost:8081/group-achievement/all');
  }

  getAchievementsByGroup(groupId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8081/achievement/get-by-groupid/${groupId}`
    );
  }

  saveEmpAchievementSkill(empAchievementSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, empAchievementSkill);
  }

  saveAllEmpAchievementSkills(empAchievementSkills: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-all`, empAchievementSkills);
  }

  updateEmpAchievementSkill(
    id: string,
    empAchievementSkill: any
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, empAchievementSkill);
  }

  getEmpAchievementSkillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteEmpAchievementSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
