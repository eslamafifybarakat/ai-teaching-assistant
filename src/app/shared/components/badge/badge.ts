import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  tone = input<BadgeTone>('neutral');
  dot = input(false);
}
