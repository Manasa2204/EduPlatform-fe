import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({ selector: 'app-hire-talent-apply', templateUrl: './apply.component.html', styleUrls: ['./apply.component.scss'] })
export class HireTalentApplyComponent {
  form = { name: '', email: '', phone: '', expertise: '', experience: '', linkedin: '', bio: '', courseIdea: '', availability: '' };
  submitted = false;
  error = '';
  loading = false;

  constructor(private adminService: AdminService) {}

  submit() {
    this.loading = true; this.error = '';
    this.adminService.applyTalent(this.form).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: () => { this.error = 'Submission failed. Try again.'; this.loading = false; }
    });
  }
}
