import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  course: any = null;
  loading = true;
  added = false;
  message = '';
  enrolled = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourse(id).subscribe((data) => {
      this.course = data;
      this.loading = false;
    });
  }

  addToCart() {
    this.courseService.addToCart(this.course.id).subscribe({
      next: () => {
        this.added = true;
        this.message = 'Course added to cart!';
      },
      error: () => {
        this.message = 'Please login to add courses.';
      },
    });
  }

  enrollNow() {
    this.courseService.enrollCourse(this.course.id).subscribe({
      next: () => {
        this.enrolled = true;
        this.message =
          'Enrollment successful! Check your profile for upcoming sessions.';
      },
      error: (err) => {
        this.message =
          err.error?.message || 'Enrollment failed. Please try again.';
      },
    });
  }
}
