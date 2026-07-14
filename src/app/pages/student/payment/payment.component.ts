import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-payment', templateUrl: './payment.component.html', styleUrls: ['./payment.component.scss'] })
export class PaymentComponent implements OnInit {
  cartItems: any[] = [];
  get total() { return this.cartItems.reduce((s, c) => s + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0); }
  step: 'details' | 'processing' | 'success' = 'details';
  card = { number: '', name: '', expiry: '', cvv: '' };
  order: any = null;

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit() { this.courseService.getCart().subscribe(data => { if (!data.length) this.router.navigate(['/cart']); this.cartItems = data; }); }

  pay() {
    this.step = 'processing';
    setTimeout(() => {
      this.courseService.checkout().subscribe({
        next: res => { this.order = res.order; this.step = 'success'; },
        error: () => { this.step = 'details'; }
      });
    }, 2000);
  }
}
