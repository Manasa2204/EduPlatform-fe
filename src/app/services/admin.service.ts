import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  private headers() { return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }); }
  applyTalent(data: any) { return this.http.post<any>(`${API}/admin/apply`, data); }
  getApplications() { return this.http.get<any[]>(`${API}/admin/applications`, { headers: this.headers() }); }
  getApplication(id: string) { return this.http.get<any>(`${API}/admin/applications/${id}`, { headers: this.headers() }); }
  approveApplication(id: string) { return this.http.post<any>(`${API}/admin/applications/${id}/approve`, {}, { headers: this.headers() }); }
  getFaculty() { return this.http.get<any[]>(`${API}/admin/faculty`, { headers: this.headers() }); }
  deleteFaculty(id: string) { return this.http.delete<any>(`${API}/admin/faculty/${id}`, { headers: this.headers() }); }
}
