import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';

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

  pendingCourses: any[] = [];

  constructor(
    private auth: AuthService,
    private courseService: CourseService,
    private toast: ToastService
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolled().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses.filter((c: any) => c.order_status !== 'pending');
        this.pendingCourses = courses.filter((c: any) => c.order_status === 'pending');
        this.totalSpent = this.enrolledCourses.reduce((sum, c) => sum + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0);
        this.loadUpcomingSessions();
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load courses')
    });
  }

  loadUpcomingSessions() {
    this.courseService.getEnrolledSessions().subscribe({
      next: (sessions) => {
        this.upcomingSessions = sessions;
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load sessions')
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
    
    // Only call the API if there is an actual increase
    if (newProgress > (course.progress || 0)) {
      this.courseService.updateProgress(course.id, newProgress).subscribe({
        next: () => {
          course.progress = newProgress;
          this.toast.showSuccess('Progress updated');
        },
        error: (err) => this.toast.showError(err.error?.message || 'Failed to update progress')
      });
    }
  }

  joinSession(session: any) {
    const course = this.enrolledCourses.find(c => c.id === session.course_id);
    if (course) {
      this.updateProgress(course);
    }
  }
}
