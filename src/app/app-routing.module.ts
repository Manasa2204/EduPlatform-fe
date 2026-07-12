import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/student/courses/courses.component';
import { CourseDetailComponent } from './pages/student/course-detail/course-detail.component';
import { CartComponent } from './pages/student/cart/cart.component';
import { PaymentComponent } from './pages/student/payment/payment.component';
import { FacultyDashboardComponent } from './pages/faculty/dashboard/dashboard.component';
import { HireTalentLandingComponent } from './pages/hire-talent/landing/landing.component';
import { HireTalentApplyComponent } from './pages/hire-talent/apply/apply.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { InstructorProfileComponent } from './pages/student/instructor-profile/instructor-profile.component';
import { ProfileComponent } from './pages/student/profile/profile.component';
import { FacultyProfileComponent } from './pages/faculty/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'courses/:id', component: CourseDetailComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'faculty-profile/:id', component: InstructorProfileComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard], data: { roles: ['student'] } },
  { path: 'faculty', component: FacultyDashboardComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'faculty/profile', component: FacultyProfileComponent, canActivate: [AuthGuard], data: { roles: ['faculty'] } },
  { path: 'hire-tech-gurus', component: HireTalentLandingComponent },
  { path: 'hire-tech-gurus/apply', component: HireTalentApplyComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
