import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupAchievementService {
  private apiUrl = 'http://localhost:8081/group-achievement';

  constructor(private http: HttpClient) {}

  // ENDPOINT LAMA :
  getAllGroupAchievements(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // ENPOINT BARU :
  // getAllGroupAchievements(page: number, size: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  // }

  saveGroupAchievement(groupAchievement: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, groupAchievement);
  }

  updateGroupAchievement(id: string, groupAchievement: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, groupAchievement);
  }

  getGroupAchievementById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteGroupAchievement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getAllGroupAchievementsEnabled(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/all/enabled`);
  }
}
