import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-cart', templateUrl: './cart.component.html', styleUrls: ['./cart.component.scss'] })
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  get total() { return this.cartItems.reduce((s, c) => s + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0); }

  message = '';

  constructor(private courseService: CourseService, private router: Router, private toast: ToastService) { }

  ngOnInit() { this.loadCart(); }

  loadCart() { 
    this.courseService.getCart().subscribe({
      next: data => this.cartItems = data,
      error: err => this.toast.showError(err.error?.message || 'Failed to load cart')
    }); 
  }

  remove(id: string) { 
    this.courseService.removeFromCart(id).subscribe({
      next: () => {
        this.toast.showSuccess('Removed from cart');
        this.loadCart();
      },
      error: err => this.toast.showError(err.error?.message || 'Failed to remove item')
    }); 
  }

  checkout() {
    this.courseService.checkout().subscribe({
      next: () => {
        this.message = 'Order placed successfully! Our team will contact you to complete the payment and enroll you in the course.';
        this.toast.showSuccess(this.message);
        this.cartItems = [];
      },
      error: (err) => {
        console.error('Checkout failed', err);
        this.message = err.error?.message || 'Checkout failed. Please try again.';
        this.toast.showError(this.message);
      }
    });
  }
}
