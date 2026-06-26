import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (this.auth.isLoggedIn()) this.redirectByRole(this.auth.getRole());
  }

  login() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => this.redirectByRole(res.user.role),
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }

  redirectByRole(role: string) {
    const map: any = {
      student: '/courses',
      faculty: '/faculty',
      admin: '/admin',
    };
    this.router.navigate([map[role] || '/login']);
  }

  fillDemo(role: string) {
    const demos: any = {
      student: 'student@demo.com',
      faculty: 'faculty@demo.com',
      admin: 'admin@demo.com',
    };
    this.email = demos[role];
    this.password = 'password';
  }
}
