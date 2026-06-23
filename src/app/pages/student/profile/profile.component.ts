import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  enrolledCourses: any[] = [];
  totalSpent = 0;
  
  constructor(private auth: AuthService, private courseService: CourseService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses() {
    this.courseService.getEnrolled().subscribe(courses => {
      this.enrolledCourses = courses;
      this.totalSpent = courses.reduce((sum, c) => sum + c.price, 0);
    });
  }

  getJoinDate() {
    // Simulate join date
    return new Date(2024, 0, 15).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getCompletionPercentage() {
    if (!this.enrolledCourses.length) return 0;
    // Simulate random progress
    return Math.floor(Math.random() * 60) + 20; // 20-80%
  }
}