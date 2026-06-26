import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}
  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }
  getStudents() {
    return this.http.get<any[]>(`${API}/faculty/students`, {
      headers: this.headers(),
    });
  }
  getSchedule() {
    return this.http.get<any[]>(`${API}/faculty/schedule`, {
      headers: this.headers(),
    });
  }
  getSessions() {
    return this.http.get<any[]>(`${API}/faculty/sessions`, {
      headers: this.headers(),
    });
  }
  getCourses() {
    return this.http.get<any[]>(`${API}/faculty/courses`, {
      headers: this.headers(),
    });
  }
  createSession(data: any) {
    return this.http.post<any>(`${API}/faculty/sessions`, data, {
      headers: this.headers(),
    });
  }
  createZoom(data: any) {
    return this.http.post<any>(`${API}/faculty/zoom`, data, {
      headers: this.headers(),
    });
  }
}
