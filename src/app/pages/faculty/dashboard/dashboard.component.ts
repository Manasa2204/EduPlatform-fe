import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../../../services/faculty.service';

@Component({ selector: 'app-faculty-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class FacultyDashboardComponent implements OnInit {
  students: any[] = [];
  schedule: any[] = [];
  activeTab = 'students';
  showZoomModal = false;
  selectedSchedule: any = null;
  zoomResult: string = '';
  zoom = { scheduleId: '', topic: '', startTime: '' };

  constructor(private facultyService: FacultyService) {}

  ngOnInit() {
    this.facultyService.getStudents().subscribe(d => this.students = d);
    this.facultyService.getSchedule().subscribe(d => this.schedule = d);
  }

  openZoomModal(sch: any) { this.selectedSchedule = sch; this.zoom = { scheduleId: sch.id, topic: sch.title, startTime: '' }; this.showZoomModal = true; }

  createZoom() {
    this.facultyService.createZoom(this.zoom).subscribe(res => {
      this.zoomResult = res.zoomLink;
      const sch = this.schedule.find(s => s.id === this.zoom.scheduleId);
      if (sch) sch.zoomLink = res.zoomLink;
      this.showZoomModal = false;
    });
  }
}
