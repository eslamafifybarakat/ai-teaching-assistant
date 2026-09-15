import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';

export interface DropdownOption { id: string; label: string; icon?: string; }

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenu {
  options = input<DropdownOption[]>([]);
  align = input<'start' | 'end'>('end');
  isOpen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  toggle(): void { this.isOpen.update(v => !v); }

  select(id: string, emitter: (id: string) => void): void {
    emitter(id);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.isOpen.set(false);
  }
}
