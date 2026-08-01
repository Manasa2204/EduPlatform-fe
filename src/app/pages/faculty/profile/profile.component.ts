import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacultyService } from '../../../services/faculty.service';

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

  constructor(private facultyService: FacultyService, private fb: FormBuilder) {
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
      },
      error: () => {
        this.errorMessage = 'Failed to load profile details.';
        this.isLoading = false;
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

