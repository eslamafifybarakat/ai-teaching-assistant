import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  open = input(false);
  title = input('');
  size = input<'sm' | 'md' | 'lg'>('md');
  closed = output<void>();

  onBackdrop(): void {
    this.closed.emit();
  }
}
