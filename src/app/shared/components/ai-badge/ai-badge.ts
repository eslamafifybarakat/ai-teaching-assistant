import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-ai-badge',
  imports: [TranslatePipe],
  templateUrl: './ai-badge.html',
  styleUrl: './ai-badge.scss',
})
export class AiBadge {}
