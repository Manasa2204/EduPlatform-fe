import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-payment', templateUrl: './payment.component.html', styleUrls: ['./payment.component.scss'] })
export class PaymentComponent implements OnInit {
  cartItems: any[] = [];
  get total() { return this.cartItems.reduce((s, c) => s + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0); }
  step: 'details' | 'processing' | 'success' = 'details';
  card = { number: '', name: '', expiry: '', cvv: '' };
  order: any = null;

  constructor(private courseService: CourseService, private router: Router, private toast: ToastService) { }

  ngOnInit() { 
    this.courseService.getCart().subscribe({
      next: data => { if (!data.length) this.router.navigate(['/cart']); this.cartItems = data; },
      error: err => this.toast.showError(err.error?.message || 'Failed to load cart')
    }); 
  }

  pay() {
    this.step = 'processing';
    setTimeout(() => {
      this.courseService.checkout().subscribe({
        next: res => { 
          this.order = res.order; 
          this.step = 'success'; 
          this.toast.showSuccess('Payment successful!');
        },
        error: (err) => { 
          this.step = 'details'; 
          this.toast.showError(err.error?.message || 'Payment failed');
        }
      });
    }, 2000);
  }
}
