import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-theme-toggle',
  imports: [TranslatePipe],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  theme = inject(ThemeService);
}
