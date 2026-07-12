import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrl: './instructor-profile.component.scss'
})
export class InstructorProfileComponent implements OnInit {
  faculty: any = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`/api/faculty/${id}/profile`).subscribe({
        next: (data) => {
          this.faculty = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Could not load instructor profile.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid instructor ID.';
      this.loading = false;
    }
  }
}
