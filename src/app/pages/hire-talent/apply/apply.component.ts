import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-hire-talent-apply', templateUrl: './apply.component.html', styleUrls: ['./apply.component.scss'] })
export class HireTalentApplyComponent {
  form = { name: '', email: '', phone: '', expertise: '', experience: '', linkedin: '', bio: '', courseIdea: '', availability: '' };
  submitted = false;
  error = '';
  loading = false;

  constructor(private adminService: AdminService, private toast: ToastService) {}

  submit() {
    this.loading = true; this.error = '';
    this.adminService.applyTalent(this.form).subscribe({
      next: () => { 
        this.submitted = true; 
        this.loading = false; 
        this.toast.showSuccess('Application submitted successfully!');
      },
      error: (err) => { 
        this.error = err.error?.message || 'Submission failed. Try again.'; 
        this.toast.showError(this.error);
        this.loading = false; 
      }
    });
  }
}
