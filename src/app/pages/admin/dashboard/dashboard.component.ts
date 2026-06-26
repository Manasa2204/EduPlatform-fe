import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  applications: any[] = [];
  faculty: any[] = [];
  courses: any[] = [];
  pendingCourses: any[] = [];
  activeTab = 'applications';

  // Modal states
  showCourseModal = false;
  showEditCourseModal = false;
  showFacultyModal = false;

  // Form data
  selectedApplication: any = null;
  selectedCourse: any = null;
  selectedFaculty: any = null;
  editingCourse: any = null;

  newCourse = {
    title: '',
    category: 'trending',
    tag: '',
    description: '',
    why: '',
    price: 0,
    duration: '',
    certification: true,
    curriculum: [] as string[],
  };
  newMentor = { name: '', bio: '', avatar: '', email: '' };
  curriculumInput = '';
  successMsg = '';
  errorMsg = '';

  constructor(
    private adminService: AdminService,
    private courseService: CourseService,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.adminService
      .getApplications()
      .subscribe((d) => (this.applications = d));
    this.adminService.getFaculty().subscribe((d) => (this.faculty = d));
    this.adminService.getCourses().subscribe((d) => (this.courses = d));
    this.adminService
      .getPendingCourses()
      .subscribe((d) => (this.pendingCourses = d));
  }

  // Group applications by person (email)
  get groupedApplications() {
    const grouped: any = {};
    this.applications.forEach((app) => {
      if (!grouped[app.email]) {
        grouped[app.email] = {
          person: {
            name: app.name,
            email: app.email,
            phone: app.phone,
            linkedin: app.linkedin,
          },
          applications: [],
        };
      }
      grouped[app.email].applications.push(app);
    });
    return Object.values(grouped);
  }

  // Application Management
  approve(id: string) {
    this.adminService.approveApplication(id).subscribe(() => {
      this.showSuccess('Application approved and faculty added!');
      this.loadAll();
    });
  }

  viewApplications(person: any) {
    this.selectedFaculty = person;
    this.showFacultyModal = true;
  }

  // Course Creation from Application
  createCourseFromApplication(applicationId: string) {
    this.adminService.getApplication(applicationId).subscribe((app) => {
      this.selectedApplication = app;
      this.prefillCourseData(app);
      this.showCourseModal = true;
    });
  }

  // Manual Course Creation
  createManualCourse() {
    this.resetForm();
    this.showCourseModal = true;
  }

  // Pending courses approval
  approveCourse(id: string) {
    this.adminService.approveCourse(id).subscribe(() => {
      this.showSuccess('Course approved successfully!');
      this.loadAll();
    });
  }

  rejectCourse(id: string) {
    this.adminService.rejectCourse(id).subscribe(() => {
      this.showSuccess('Course rejected successfully!');
      this.loadAll();
    });
  }

  // Faculty Selection for Manual Course
  onFacultySelect(event: any) {
    const email = event.target.value;
    if (!email) {
      this.resetMentorData();
      return;
    }

    const facultyMember = this.faculty.find((f) => f.email === email);
    if (
      facultyMember &&
      facultyMember.applications &&
      facultyMember.applications.length > 0
    ) {
      // Use the first application for mentor data (or let admin choose)
      const app = facultyMember.applications[0];
      this.newMentor = {
        name: app.name,
        email: app.email,
        bio: app.bio,
        avatar: `https://i.pravatar.cc/100?u=${app.email}`,
      };

      // Optionally prefill course data too
      if (!this.newCourse.title) {
        this.newCourse.tag = app.expertise.split(',')[0].trim();
        this.newCourse.why = `Learn ${app.expertise} from an industry expert with ${app.experience} of experience.`;
        this.curriculumInput = this.generateCurriculum(
          app.expertise,
          app.courseIdea,
        ).join('\\n');
      }
    }
  }

  // Course CRUD Operations
  addCourse() {
    const curriculum = this.curriculumInput
      .split('\\n')
      .filter((item) => item.trim());
    const courseData = {
      ...this.newCourse,
      curriculum,
      mentor: this.newMentor,
      applicationId: this.selectedApplication?.id,
    };

    this.courseService.createCourse(courseData).subscribe(() => {
      this.showCourseModal = false;
      this.resetForm();
      this.loadAll();
      this.showSuccess('Course created successfully!');
    });
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
      duration: course.duration,
      certification: course.certification,
      curriculum: [...course.curriculum],
    };
    this.newMentor = { ...course.mentor };
    this.curriculumInput = course.curriculum.join('\\n');
    this.showEditCourseModal = true;
  }

  updateCourse() {
    const curriculum = this.curriculumInput
      .split('\\n')
      .filter((item) => item.trim());
    const courseData = {
      ...this.newCourse,
      curriculum,
      mentor: this.newMentor,
    };

    this.courseService
      .updateCourse(this.editingCourse.id, courseData)
      .subscribe(() => {
        this.showEditCourseModal = false;
        this.loadAll();
        this.showSuccess('Course updated successfully!');
      });
  }

  deleteCourse(id: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadAll();
        this.showSuccess('Course deleted successfully!');
      });
    }
  }

  // Faculty Management
  deleteFaculty(id: string, name: string) {
    if (
      confirm(
        `Are you sure you want to remove "${name}" from faculty? This will not delete their talent applications.`,
      )
    ) {
      this.adminService.deleteFaculty(id).subscribe(() => {
        this.loadAll();
        this.showSuccess('Faculty member removed successfully!');
      });
    }
  }

  // Helper Methods
  prefillCourseData(app: any) {
    this.newCourse = {
      title: this.extractCourseTitle(app.courseIdea),
      category: 'new',
      tag: app.expertise.split(',')[0].trim(),
      description: app.courseIdea,
      why: `Learn ${app.expertise} from an industry expert with ${app.experience} of experience.`,
      price: this.suggestPrice(app.expertise),
      duration: this.suggestDuration(app.availability),
      certification: true,
      curriculum: this.generateCurriculum(app.expertise, app.courseIdea),
    };
    this.newMentor = {
      name: app.name,
      bio: app.bio,
      avatar: `https://i.pravatar.cc/100?u=${app.email}`,
      email: app.email,
    };
    this.curriculumInput = this.newCourse.curriculum.join('\\n');
  }

  resetForm() {
    this.newCourse = {
      title: '',
      category: 'trending',
      tag: '',
      description: '',
      why: '',
      price: 0,
      duration: '',
      certification: true,
      curriculum: [] as string[],
    };
    this.resetMentorData();
    this.selectedApplication = null;
  }

  resetMentorData() {
    this.newMentor = { name: '', bio: '', avatar: '', email: '' };
    this.curriculumInput = '';
  }

  extractCourseTitle(courseIdea: string): string {
    const words = courseIdea.split(' ').slice(0, 4);
    return (
      words.join(' ') +
      (words.length < courseIdea.split(' ').length ? ' Course' : '')
    );
  }

  suggestPrice(expertise: string): number {
    const prices: any = {
      java: 4999,
      python: 4499,
      devops: 5999,
      react: 3499,
      node: 3999,
    };
    const key = expertise.toLowerCase().split(',')[0].trim();
    return prices[key] || 3999;
  }

  suggestDuration(availability: string): string {
    const durations: any = {
      'full-time': '8 weeks',
      'part-time': '12 weeks',
      evenings: '16 weeks',
    };
    return durations[availability] || '10 weeks';
  }

  generateCurriculum(expertise: string, courseIdea: string): string[] {
    const topics = expertise.split(',').map((s) => s.trim());
    const base = [
      'Introduction & Basics',
      'Core Concepts',
      'Advanced Topics',
      'Hands-on Projects',
      'Best Practices',
      'Certification Prep',
    ];
    return base.map(
      (item, i) =>
        `${item}: ${topics[i % topics.length] || 'Practical Applications'}`,
    );
  }

  showSuccess(message: string) {
    this.successMsg = message;
    this.errorMsg = '';
    setTimeout(() => (this.successMsg = ''), 4000);
  }

  showError(message: string) {
    this.errorMsg = message;
    this.successMsg = '';
    setTimeout(() => (this.errorMsg = ''), 4000);
  }
}
