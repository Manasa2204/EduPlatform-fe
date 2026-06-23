import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`app-navbar { display: block; }`]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
