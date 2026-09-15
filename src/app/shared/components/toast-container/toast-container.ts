import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  toastService = inject(ToastService);

  iconFor(kind: string): string {
    switch (kind) {
      case 'success': return '✅';
      case 'error': return '⛔';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}
