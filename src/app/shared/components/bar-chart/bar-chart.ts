import { Component, computed, input } from '@angular/core';

export interface BarDatum { label: string; value: number; tone?: string; }

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {
  data = input.required<BarDatum[]>();
  maxValue = input<number | null>(null);
  suffix = input('%');

  computedMax = computed(() => this.maxValue() ?? Math.max(100, ...this.data().map(d => d.value)));
}
