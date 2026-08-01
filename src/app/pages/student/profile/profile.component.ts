import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  enrolledCourses: any[] = [];
  upcomingSessions: any[] = [];
  totalSpent = 0;

  constructor(
    private auth: AuthService,
    private courseService: CourseService,
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolled().subscribe((courses) => {
      this.enrolledCourses = courses;
      this.totalSpent = courses.reduce((sum, c) => sum + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0);
      this.loadUpcomingSessions();
    });
  }

  loadUpcomingSessions() {
    this.courseService.getEnrolledSessions().subscribe((sessions) => {
      this.upcomingSessions = sessions;
    });
  }

  getJoinDate() {
    // Simulate join date
    return new Date(2024, 0, 15).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getAvgProgress() {
    if (!this.enrolledCourses.length) return 0;
    const total = this.enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    return Math.floor(total / this.enrolledCourses.length);
  }

  updateProgress(course: any) {
    const modules = course.curriculum?.length || 1;
    const increment = Math.ceil(100 / modules);
    let newProgress = (course.progress || 0) + increment;
    if (newProgress > 100) newProgress = 100;
    this.courseService.updateProgress(course.id, newProgress).subscribe(() => {
      course.progress = newProgress;
    });
  }
}
