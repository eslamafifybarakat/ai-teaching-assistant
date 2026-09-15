import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class Skeleton {
  width = input('100%');
  height = input('16px');
  radius = input('8px');
}
