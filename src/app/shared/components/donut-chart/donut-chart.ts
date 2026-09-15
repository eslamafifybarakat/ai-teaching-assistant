import { Component, computed, input } from '@angular/core';

export interface DonutSegment { label: string; value: number; color: string; }

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
})
export class DonutChart {
  segments = input.required<DonutSegment[]>();
  size = input(140);
  strokeWidth = input(18);

  total = computed(() => this.segments().reduce((sum, s) => sum + s.value, 0) || 1);
  radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  circumference = computed(() => 2 * Math.PI * this.radius());

  arcs = computed(() => {
    let offsetAcc = 0;
    return this.segments().map(seg => {
      const fraction = seg.value / this.total();
      const length = fraction * this.circumference();
      const dashArray = `${length} ${this.circumference() - length}`;
      const dashOffset = -offsetAcc;
      offsetAcc += length;
      return { ...seg, dashArray, dashOffset };
    });
  });
}
