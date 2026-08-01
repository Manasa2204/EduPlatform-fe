import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../../../services/faculty.service';

import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
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
      error: () => {
        this.errorMessage = 'Failed to load profile details.';
        this.isLoading = false;
      }
    });

    // Check for Google OAuth callback
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        const user = this.authService.getUser();
        if (user && user.id) {
          this.authService.connectGoogleCallback(code, user.id).subscribe({
            next: () => {
              this.successMessage = 'Google Calendar connected successfully!';
              this.isGoogleConnected = true;
              this.router.navigate([], { queryParams: { code: null }, queryParamsHandling: 'merge' });
            },
            error: () => {
              this.errorMessage = 'Failed to connect Google Calendar.';
            }
          });
        }
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
    this.authService.getGoogleAuthUrl().subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: () => {
        this.errorMessage = 'Failed to initiate Google connection.';
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.facultyService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.isSaving = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Failed to update profile. Please try again.';
          this.isSaving = false;
        }
      });
    }
  }
}

