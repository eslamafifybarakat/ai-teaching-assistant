import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);
  type = input<'button' | 'submit'>('button');
  pressed = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;
    this.pressed.emit(event);
  }
}
