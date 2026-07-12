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
  showCourseDetailsModal = false;

  // Form data
  selectedApplication: any = null;
  selectedCourse: any = null;
  selectedFaculty: any = null;
  editingCourse: any = null;
  approvedCredentials: any = null;

  selectedFacultyEmail = '';
  selectedFacultyId: string | null = null;

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
  ) { }

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
    this.adminService.approveApplication(id).subscribe({
      next: (res: any) => {
        this.approvedCredentials = {
          email: res.email,
          password: res.password
        };
        this.showSuccess('Application approved and faculty credentials generated!');
        this.loadAll();
      },
      error: (err: any) => {
        this.showError(err.error?.message || 'Failed to approve application.');
      }
    });
  }

  viewApplications(person: any) {
    this.selectedFaculty = person;
    this.showFacultyModal = true;
  }

  viewCourseDetails(course: any) {
    this.selectedCourse = course;
    this.showCourseDetailsModal = true;
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
      this.selectedFacultyId = null;
      return;
    }

    const facultyMember = this.faculty.find((f) => f.email === email);
    if (facultyMember) {
      this.selectedFacultyId = facultyMember.id;
      const app = facultyMember.applications?.[0];

      this.newMentor = {
        name: facultyMember.name,
        email: facultyMember.email,
        bio: app?.bio || '',
        avatar: `https://i.pravatar.cc/100?u=${facultyMember.email}`,
      };

      // Optionally prefill course data too
      if (!this.newCourse.title && facultyMember.expertise) {
        this.newCourse.tag = facultyMember.expertise.split(',')[0].trim();
        this.newCourse.why = `Learn ${facultyMember.expertise} from an industry expert.`;
        if (app?.courseIdea) {
          this.curriculumInput = this.generateCurriculum(
            facultyMember.expertise,
            app.courseIdea,
          ).join('\\n');
        }
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
      faculty_id: this.selectedFacultyId,
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
    this.selectedFacultyEmail = '';
    this.selectedFacultyId = null;
    this.resetMentorData();
    this.selectedApplication = null;
  }

  resetMentorData() {
    this.newMentor = { name: '', bio: '', avatar: '', email: '' };
    this.curriculumInput = '';
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
