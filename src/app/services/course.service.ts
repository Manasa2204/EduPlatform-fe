import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

// const API = 'http://localhost:3000/api';
const API = 'https://edu-platform-be.vercel.app/api';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { }

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getCourses() {
    return this.http.get<any[]>(`${API}/courses`);
  }
  getCourse(id: string) {
    return this.http.get<any>(`${API}/courses/${id}`);
  }
  getDeletedCourses() {
    return this.http.get<any[]>(`${API}/courses/deleted`, {
      headers: this.headers(),
    });
  }
  getCart() {
    return this.http.get<any[]>(`${API}/courses/cart/items`, {
      headers: this.headers(),
    });
  }
  getEnrolled() {
    return this.http.get<any[]>(`${API}/courses/enrolled`, {
      headers: this.headers(),
    });
  }
  getEnrolledSessions() {
    return this.http.get<any[]>(`${API}/courses/sessions`, {
      headers: this.headers(),
    });
  }
  addToCart(id: string) {
    return this.http.post(
      `${API}/courses/cart/add/${id}`,
      {},
      { headers: this.headers() },
    );
  }
  removeFromCart(id: string) {
    return this.http.delete(`${API}/courses/cart/remove/${id}`, {
      headers: this.headers(),
    });
  }
  checkout() {
    return this.http.post<any>(
      `${API}/courses/order/checkout`,
      {},
      { headers: this.headers() },
    );
  }
  submitCourse(id: string) {
    return this.http.post<any>(
      `${API}/courses/${id}/submit`,
      {},
      { headers: this.headers() },
    );
  }
  requestArchive(id: string) {
    return this.http.post<any>(
      `${API}/courses/${id}/archive-request`,
      {},
      { headers: this.headers() },
    );
  }
  enrollCourse(id: string) {
    return this.http.post<any>(
      `${API}/courses/${id}/enroll`,
      {},
      { headers: this.headers() },
    );
  }
  createCourse(data: any) {
    return this.http.post<any>(`${API}/courses`, data, {
      headers: this.headers(),
    });
  }
  updateCourse(id: string, data: any) {
    return this.http.put<any>(`${API}/courses/${id}`, data, {
      headers: this.headers(),
    });
  }
  deleteCourse(id: string) {
    return this.http.delete<any>(`${API}/courses/${id}`, {
      headers: this.headers(),
    });
  }
}
