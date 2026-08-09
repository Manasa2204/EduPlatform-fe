import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../../../services/faculty.service';

import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class FacultyProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  email = '';
  isLoading = true;
  isSaving = false;
  isGoogleConnected = false;

  constructor(
    private facultyService: FacultyService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      expertise: ['', Validators.required],
      bio: [''],
      linkedin: [''],
      experience: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.facultyService.getProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        this.email = data.email || '';
        this.isLoading = false;
        this.checkGoogleStatus();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load profile details.';
        this.toast.showError(this.errorMessage);
        this.isLoading = false;
      }
    });

    // Check for Google OAuth success redirect
    this.route.queryParams.subscribe(params => {
      const googleConnected = params['googleConnected'];
      if (googleConnected === 'true') {
        this.successMessage = 'Google Calendar connected successfully!';
        this.isGoogleConnected = true;
        this.router.navigate([], { queryParams: { googleConnected: null }, queryParamsHandling: 'merge' });
      } else if (googleConnected === 'false') {
        this.errorMessage = 'Failed to connect Google Calendar.';
        this.router.navigate([], { queryParams: { googleConnected: null }, queryParamsHandling: 'merge' });
      }
    });
  }

  checkGoogleStatus() {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.authService.getGoogleStatus(user.id).subscribe({
        next: (res) => {
          this.isGoogleConnected = res.connected;
        }
      });
    }
  }

  connectGoogle() {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.authService.getGoogleAuthUrl(user.id).subscribe({
        next: (res) => {
          window.location.href = res.url;
        },
        error: () => {
          this.errorMessage = 'Failed to initiate Google connection.';
        }
      });
    } else {
      this.errorMessage = 'User not found, cannot connect Google Calendar.';
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.facultyService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.toast.showSuccess(this.successMessage);
          this.isSaving = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update profile. Please try again.';
          this.toast.showError(this.errorMessage);
          this.isSaving = false;
        }
      });
    }
  }
}

