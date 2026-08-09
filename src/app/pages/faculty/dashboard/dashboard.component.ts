import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../../../services/faculty.service';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';
import moment from 'moment';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class FacultyDashboardComponent implements OnInit {
  students: any[] = [];
  schedule: any[] = [];
  previousSchedule: any[] = [];
  courses: any[] = [];
  deletedCourses: any[] = [];
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
    total_sessions: 10,
    certification: true,
    curriculum: [''],
  };
  message = '';
  selectedCourseId = '';

  get filteredStudents() {
    if (!this.selectedCourseId) return this.students;
    return this.students.filter(s => s.course_id === this.selectedCourseId);
  }

  openLiveClassModal() {
    this.openSessionModal();
    if (this.selectedCourseId) {
      this.session.courseId = this.selectedCourseId;
    }
  }

  constructor(
    private facultyService: FacultyService,
    private courseService: CourseService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.facultyService.getStudents().subscribe({
      next: (d) => (this.students = d),
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load students')
    });
    this.loadSessions();
    this.loadCourses();
  }

  loadSessions() {
    this.facultyService.getSessions().subscribe({
      next: (d) => {
        const now = moment();
        this.schedule = [];
        this.previousSchedule = [];
        
        d.forEach((session: any) => {
          let isPast = false;
          if (session.date && session.time) {
            const dateStr = typeof session.date === 'string' ? session.date.split('T')[0] : session.date;
            const sessionDateTime = moment(`${dateStr} ${session.time}`, 'YYYY-MM-DD HH:mm');
            if (sessionDateTime.isBefore(now)) {
              isPast = true;
            }
          }
          
          if (isPast) {
            this.previousSchedule.push(session);
          } else {
            this.schedule.push(session);
          }
        });
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load sessions')
    });
  }

  loadCourses() {
    this.facultyService.getCourses().subscribe({
      next: (d) => {
        this.courses = d;
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load courses')
    });
    this.courseService.getDeletedCourses().subscribe({
      next: (d) => {
        this.deletedCourses = d;
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to load deleted courses')
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
      total_sessions: 10,
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
      total_sessions: course.total_sessions || 10,
      certification: course.certification,
      curriculum: course.curriculum && course.curriculum.length > 0 ? [...course.curriculum] : [''],
    };
    this.showEditCourseModal = true;
  }

  updateCourse() {
    const payload = { ...this.newCourse, status: this.editingCourse.status };
    this.courseService.updateCourse(this.editingCourse.id, payload).subscribe({
      next: () => {
        this.showEditCourseModal = false;
        this.message = 'Course updated successfully.';
        this.toast.showSuccess(this.message);
        this.loadCourses();
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to update course')
    });
  }

  createCourse() {
    this.courseService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.showCourseModal = false;
        this.message = 'Course draft created successfully.';
        this.toast.showSuccess(this.message);
        this.loadCourses();
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to create course')
    });
  }

  submitCourse(course: any) {
    this.courseService.submitCourse(course.id).subscribe({
      next: () => {
        this.message = 'Course submitted for review.';
        this.toast.showSuccess(this.message);
        this.loadCourses();
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to submit course')
    });
  }

  deleteCourse(course: any) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.message = 'Course deleted successfully.';
          this.toast.showSuccess(this.message);
          this.loadCourses();
        },
        error: (err) => this.toast.showError(err.error?.message || 'Failed to delete course')
      });
    }
  }

  requestArchive(course: any) {
    if (confirm('Are you sure you want to request archiving this course?')) {
      this.courseService.requestArchive(course.id).subscribe({
        next: () => {
          this.message = 'Archive request submitted successfully.';
          this.toast.showSuccess(this.message);
          this.loadCourses();
        },
        error: (err) => this.toast.showError(err.error?.message || 'Failed to submit archive request')
      });
    }
  }

  get minDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  get minTime(): string {
    return moment().format('HH:mm');
  }

  createSession() {
    const sessionDateTime = moment(`${this.session.date} ${this.session.time}`, 'YYYY-MM-DD HH:mm');
    if (sessionDateTime.isBefore(moment())) {
      this.toast.showError('Cannot schedule a session in the past');
      return;
    }

    this.facultyService.createSession(this.session).subscribe({
      next: (res) => {
        this.showSessionModal = false;
        this.loadSessions();
        this.zoomResult = res.join_url;
        this.toast.showSuccess('Session created successfully');
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to create session')
    });
  }

  openZoomModal(sch: any) {
    this.selectedSchedule = sch;
    this.zoom = { scheduleId: sch.id, topic: sch.title, startTime: '' };
    this.showZoomModal = true;
  }

  createZoom() {
    this.facultyService.createZoom(this.zoom).subscribe({
      next: (res) => {
        this.zoomResult = res.zoomLink;
        const sch = this.schedule.find((s) => s.id === this.zoom.scheduleId);
        if (sch) sch.zoomLink = res.zoomLink;
        this.showZoomModal = false;
        this.toast.showSuccess('Zoom meeting created successfully');
      },
      error: (err) => this.toast.showError(err.error?.message || 'Failed to create Zoom meeting')
    });
  }

  addCurriculumStep() {
    this.newCourse.curriculum.push('');
  }

  removeCurriculumStep(index: number) {
    this.newCourse.curriculum.splice(index, 1);
  }

  formatTimeIST(timeStr: string): string {
    if (!timeStr) return '';
    return moment(timeStr, 'HH:mm').format('h:mm a');
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return moment(dateStr).format('DD-MM-YYYY');
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
