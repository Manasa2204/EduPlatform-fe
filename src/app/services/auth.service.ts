import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

// const API = 'http://localhost:3000/api';
const API = 'https://edu-platform-be.vercel.app/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => { localStorage.setItem('token', res.token); localStorage.setItem('user', JSON.stringify(res.user)); this.userSubject.next(res.user); })
    );
  }

  signup(name: string, email: string, password: string, role: string) {
    return this.http.post<any>(`${API}/auth/signup`, { name, email, password, role }).pipe(
      tap(res => { localStorage.setItem('token', res.token); localStorage.setItem('user', JSON.stringify(res.user)); this.userSubject.next(res.user); })
    );
  }

  logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); this.userSubject.next(null); this.router.navigate(['/login']); }

  getToken() { return localStorage.getItem('token'); }
  getUser() { return this.userSubject.value; }
  isLoggedIn() { return !!this.getToken(); }
  getRole() { return this.getUser()?.role; }
  private getStoredUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
}
