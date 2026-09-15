import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  page = input(1);
  totalPages = input(1);
  changed = output<number>();

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  go(p: number): void {
    if (p < 1 || p > this.totalPages() || p === this.page()) return;
    this.changed.emit(p);
  }
}
