import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../../../services/faculty.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class FacultyDashboardComponent implements OnInit {
  students: any[] = [];
  schedule: any[] = [];
  courses: any[] = [];
  activeTab = 'students';
  showSessionModal = false;
  showCourseModal = false;
  showEditCourseModal = false;
  showZoomModal = false;
  selectedSchedule: any = null;
  editingCourse: any = null;
  zoomResult: string = '';
  zoom = { scheduleId: '', topic: '', startTime: '' };
  session = {
    courseId: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
  };
  newCourse = {
    title: '',
    category: 'trending',
    tag: '',
    description: '',
    why: '',
    price: 0,
    duration: 8,
    certification: true,
    curriculum: [''],
  };
  message = '';

  constructor(
    private facultyService: FacultyService,
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    this.facultyService.getStudents().subscribe((d) => (this.students = d));
    this.loadSessions();
    this.loadCourses();
  }

  loadSessions() {
    this.facultyService.getSessions().subscribe((d) => (this.schedule = d));
  }

  loadCourses() {
    this.facultyService.getCourses().subscribe((d) => {
      this.courses = d;
    });
  }

  openSessionModal() {
    this.session = {
      courseId: '',
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
    };
    this.showSessionModal = true;
  }

  openCourseModal() {
    this.newCourse = {
      title: '',
      category: 'trending',
      tag: '',
      description: '',
      why: '',
      price: 0,
      duration: 8,
      certification: true,
      curriculum: [''],
    };
    this.showCourseModal = true;
  }

  editCourse(course: any) {
    this.editingCourse = { ...course };
    this.newCourse = {
      title: course.title,
      category: course.category,
      tag: course.tag,
      description: course.description,
      why: course.why,
      price: course.price,
      duration: course.duration || 8,
      certification: course.certification,
      curriculum: course.curriculum && course.curriculum.length > 0 ? [...course.curriculum] : [''],
    };
    this.showEditCourseModal = true;
  }

  updateCourse() {
    this.courseService.updateCourse(this.editingCourse.id, this.newCourse).subscribe(() => {
      this.showEditCourseModal = false;
      this.message = 'Course updated successfully.';
      this.loadCourses();
    });
  }

  createCourse() {
    this.courseService.createCourse(this.newCourse).subscribe(() => {
      this.showCourseModal = false;
      this.message = 'Course draft created successfully.';
      this.loadCourses();
    });
  }

  submitCourse(course: any) {
    this.courseService.submitCourse(course.id).subscribe(() => {
      this.message = 'Course submitted for review.';
      this.loadCourses();
    });
  }

  createSession() {
    this.facultyService.createSession(this.session).subscribe((res) => {
      this.showSessionModal = false;
      this.loadSessions();
      this.zoomResult = res.join_url;
    });
  }

  openZoomModal(sch: any) {
    this.selectedSchedule = sch;
    this.zoom = { scheduleId: sch.id, topic: sch.title, startTime: '' };
    this.showZoomModal = true;
  }

  createZoom() {
    this.facultyService.createZoom(this.zoom).subscribe((res) => {
      this.zoomResult = res.zoomLink;
      const sch = this.schedule.find((s) => s.id === this.zoom.scheduleId);
      if (sch) sch.zoomLink = res.zoomLink;
      this.showZoomModal = false;
    });
  }

  addCurriculumStep() {
    this.newCourse.curriculum.push('');
  }

  removeCurriculumStep(index: number) {
    this.newCourse.curriculum.splice(index, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
