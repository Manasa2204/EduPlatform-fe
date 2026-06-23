import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  getDashboardRoute() {
    const role = this.auth.getRole();
    if (role === 'student') return '/courses';
    if (role === 'faculty') return '/faculty';
    if (role === 'admin') return '/admin';
    if (role === 'hire_talent') return '/hire-talent';
    return '/login';
  }

  logout() { this.auth.logout(); }
}
