import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({ selector: 'app-signup', templateUrl: './signup.component.html', styleUrls: ['./signup.component.scss'] })
export class SignupComponent {
  name = ''; email = ''; password = ''; role = 'student'; error = ''; loading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  signup() {
    this.error = ''; this.loading = true;
    this.auth.signup(this.name, this.email, this.password, this.role).subscribe({
      next: res => {
        this.toast.showSuccess('Signup successful!');
        this.router.navigate(['/courses']);
      },
      error: err => { 
        this.error = err.error?.message || 'Signup failed'; 
        this.toast.showError(this.error);
        this.loading = false; 
      }
    });
  }
}
