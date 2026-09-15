import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';
import { LanguageSwitcher } from '../../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-student-join',
  imports: [TranslatePipe, Button, Card, LanguageSwitcher, ThemeToggle],
  templateUrl: './student-join.html',
  styleUrl: './student-join.scss',
})
export class StudentJoin {
  private router = inject(Router);

  code = signal('');
  name = signal('');
  studentId = signal('');
  step = signal<'code' | 'details'>('code');

  scanning = signal(false);

  simulateScan(): void {
    this.scanning.set(true);
    setTimeout(() => {
      this.code.set('TB-4821');
      this.scanning.set(false);
      this.step.set('details');
    }, 1200);
  }

  submitCode(): void {
    if (this.code().trim().length < 3) return;
    this.step.set('details');
  }

  join(): void {
    if (!this.name().trim()) return;
    this.router.navigateByUrl('/student/quiz');
  }
}
