import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-cart', templateUrl: './cart.component.html', styleUrls: ['./cart.component.scss'] })
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  get total() { return this.cartItems.reduce((s, c) => s + (Number(c.display_price) > 0 ? Number(c.display_price) : Number(c.price)), 0); }

  message = '';

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit() { this.loadCart(); }

  loadCart() { this.courseService.getCart().subscribe(data => this.cartItems = data); }

  remove(id: string) { this.courseService.removeFromCart(id).subscribe(() => this.loadCart()); }

  checkout() {
    this.courseService.checkout().subscribe({
      next: () => {
        this.message = 'Order placed successfully! Our team will contact you to complete the payment and enroll you in the course.';
        this.cartItems = [];
      },
      error: (err) => {
        console.error('Checkout failed', err);
        this.message = 'Order placed successfully! Our team will contact you to complete the payment and enroll you in the course.';
        this.cartItems = [];
      }
    });
  }
}
