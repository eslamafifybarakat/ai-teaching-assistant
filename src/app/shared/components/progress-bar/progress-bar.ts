import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  imports: [DecimalPipe],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  value = input(0);
  max = input(100);
  tone = input<'primary' | 'success' | 'warning' | 'danger'>('primary');
  showLabel = input(false);
  percent = computed(() => Math.max(0, Math.min(100, (this.value() / this.max()) * 100)));
}
