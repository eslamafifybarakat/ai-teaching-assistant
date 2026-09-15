import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  initials = input('؟');
  color = input('#4f5fd6');
  size = input<'sm' | 'md' | 'lg'>('md');
}
