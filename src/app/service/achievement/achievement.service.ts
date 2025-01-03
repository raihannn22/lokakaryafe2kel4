import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:8081/achievement';

  constructor(private http: HttpClient) {}

  getAllAchievements(
    page: number = 0,
    size: number = 10,
    sort: string = 'groupAchievement.id',
    direction: string = 'asc',
    searchKeyword: string = ''
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/paginated?page=${page}&size=${size}&sort=${sort}&direction=${direction}&searchKeyword=${searchKeyword}`
    );
  }

  // getAllAchievements(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/all`);
  // }

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

  getAllGroupAchievementsEnabled(): Observable<any> {
    return this.http.get(
      'http://localhost:8081/group-achievement/get/all/enabled'
    );
  }
}
