import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'http://localhost:8081/achievement';

  constructor(private http: HttpClient) {}

  // getAllAchievements(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/all`);
  // }

  getAllAchievements(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }


  getAllGroupAchievements(): Observable<any> {
  return this.http.get('http://localhost:8081/group-achievement/all');
  }


  saveAchievement(achievement: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, achievement);
  }

  updateAchievement(id: string, achievement: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, achievement);
  }


  getAchievementById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteAchievement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
