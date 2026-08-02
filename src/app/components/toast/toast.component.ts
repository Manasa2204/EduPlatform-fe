import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toastMessage: ToastMessage | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.toastState.subscribe((message) => {
      this.toastMessage = message;
      setTimeout(() => {
        this.close();
      }, 5000); // close after 5 seconds
    });
  }

  close(): void {
    this.toastMessage = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
