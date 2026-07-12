import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-cart', templateUrl: './cart.component.html', styleUrls: ['./cart.component.scss'] })
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  get total() { return this.cartItems.reduce((s, c) => s + (c.display_price > 0 ? c.display_price : c.price), 0); }

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() { this.loadCart(); }

  loadCart() { this.courseService.getCart().subscribe(data => this.cartItems = data); }

  remove(id: string) { this.courseService.removeFromCart(id).subscribe(() => this.loadCart()); }

  checkout() { this.router.navigate(['/payment']); }
}
