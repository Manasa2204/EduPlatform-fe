import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  enrolledCourses: any[] = [];
  upcomingSessions: any[] = [];
  previousSessions: any[] = [];
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
        const now = moment();
        this.upcomingSessions = [];
        this.previousSessions = [];
        
        sessions.forEach((session: any) => {
          let isPast = false;
          if (session.date && session.time) {
            const dateStr = typeof session.date === 'string' ? session.date.split('T')[0] : session.date;
            const sessionDateTime = moment(`${dateStr} ${session.time}`, 'YYYY-MM-DD HH:mm');
            if (sessionDateTime.isBefore(now)) {
              isPast = true;
            }
          }
          
          if (isPast) {
            this.previousSessions.push(session);
          } else {
            this.upcomingSessions.push(session);
          }
        });
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

  joinSession(session: any) {
    const course = this.enrolledCourses.find(c => c.id === session.course_id);
    if (course) {
      this.courseService.joinSession(course.id, session.id).subscribe({
        next: (res) => {
          if (res.progress > course.progress) {
            course.progress = res.progress;
            this.toast.showSuccess(`Progress updated: ${res.progress}%`);
          }
        },
        error: (err) => console.error('Failed to track session join:', err)
      });
    }
  }

  formatTimeIST(timeStr: string): string {
    if (!timeStr) return '';
    return moment(timeStr, 'HH:mm').format('h:mm a');
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return moment(dateStr).format('DD-MM-YYYY');
  }
}
