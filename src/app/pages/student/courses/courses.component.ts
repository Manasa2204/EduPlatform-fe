import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-courses', templateUrl: './courses.component.html', styleUrls: ['./courses.component.scss'] })
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  filtered: any[] = [];
  categories = ['all', 'trending', 'popular', 'new'];
  activeCategory = 'all';
  search = '';

  constructor(private courseService: CourseService, private toast: ToastService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: data => {
        this.courses = data;
        this.applyFilter();
      },
      error: err => this.toast.showError(err.error?.message || 'Failed to load courses')
    });
  }

  applyFilter() {
    this.filtered = this.courses.filter(c => {
      const matchCat = this.activeCategory === 'all' || c.category === this.activeCategory;
      const matchSearch = c.title.toLowerCase().includes(this.search.toLowerCase()) || c.tag.toLowerCase().includes(this.search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  setCategory(cat: string) { this.activeCategory = cat; this.applyFilter(); }
}
