import { Component, input, output } from '@angular/core';

export interface TabItem { id: string; label: string; icon?: string; }

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  tabs = input.required<TabItem[]>();
  activeId = input.required<string>();
  changed = output<string>();
}
