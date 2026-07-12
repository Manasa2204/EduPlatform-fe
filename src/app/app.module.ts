import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
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
import { ZoomCountPipe } from './pipes/zoom-count.pipe';
import { PendingCountPipe } from './pipes/pending-count.pipe';
import { ProfileComponent } from './pages/student/profile/profile.component';
import { FacultyProfileComponent } from './pages/faculty/profile/profile.component';
import { InstructorProfileComponent } from './pages/student/instructor-profile/instructor-profile.component';

@NgModule({
  declarations: [
    AppComponent, NavbarComponent, LoginComponent, SignupComponent, HomeComponent,
    CoursesComponent, CourseDetailComponent, CartComponent, PaymentComponent,
    FacultyDashboardComponent, HireTalentLandingComponent, HireTalentApplyComponent, AdminDashboardComponent, ZoomCountPipe, PendingCountPipe, ProfileComponent, FacultyProfileComponent, InstructorProfileComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
