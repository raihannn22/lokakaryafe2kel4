import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSkillService {
  private apiUrl = 'http://localhost:8081/technical-skill';

  constructor(private http: HttpClient) {}

  getAllTechnicalSkills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }


  saveTechnicalSkill(technicalSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save`, technicalSkill);
  }

  updateTechnicalSkill(id: string, technicalSkill: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, technicalSkill);
  }


  getTechnicalSkillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  deleteTechnicalSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
