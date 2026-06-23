import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';

@Component({ selector: 'app-courses', templateUrl: './courses.component.html', styleUrls: ['./courses.component.scss'] })
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  filtered: any[] = [];
  categories = ['all', 'trending', 'popular', 'new'];
  activeCategory = 'all';
  search = '';

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
      this.applyFilter();
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
