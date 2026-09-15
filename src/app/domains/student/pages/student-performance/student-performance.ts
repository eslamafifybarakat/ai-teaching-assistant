import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { DonutChart } from '../../../../shared/components/donut-chart/donut-chart';
import { Button } from '../../../../shared/components/button/button';
import { LanguageSwitcher } from '../../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-student-performance',
  imports: [TranslatePipe, Card, Badge, ProgressBar, DonutChart, Button, LanguageSwitcher, ThemeToggle],
  templateUrl: './student-performance.html',
  styleUrl: './student-performance.scss',
})
export class StudentPerformance {
  auth = inject(AuthService);
  private router = inject(Router);

  overall = 78;
  participation = 91;
  badges = ['⭐ متفوق', '🏅 خبير 1NF', '🔥 5 أيام متتالية'];
  topics = [
    { name: '1NF', score: 92 },
    { name: '2NF', score: 81 },
    { name: '3NF', score: 64 },
    { name: 'BCNF', score: 48 },
  ];

  donutSegments = [
    { label: 'صحيح', value: 78, color: 'var(--color-success-500)' },
    { label: 'خاطئ', value: 22, color: 'var(--color-danger-500)' },
  ];

  logout(): void {
    this.auth.logout();
  }
}
