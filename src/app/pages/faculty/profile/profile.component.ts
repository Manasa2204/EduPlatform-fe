import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class FacultyProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
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
    this.http.get<any>('/api/faculty/profile').subscribe(data => {
      this.profileForm.patchValue(data);
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.http.put('/api/faculty/profile', this.profileForm.value).subscribe(() => {
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      });
    }
  }
}
