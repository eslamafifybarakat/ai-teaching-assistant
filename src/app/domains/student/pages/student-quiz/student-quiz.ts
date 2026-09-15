import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';

type Phase = 'waiting' | 'question' | 'submitted' | 'feedback';

@Component({
  selector: 'app-student-quiz',
  imports: [TranslatePipe, Card, Button],
  templateUrl: './student-quiz.html',
  styleUrl: './student-quiz.scss',
})
export class StudentQuiz {
  private router = inject(Router);

  phase = signal<Phase>('waiting');
  selected = signal<string | null>(null);
  wasCorrect = signal(false);

  question = {
    prompt: 'أي مما يلي يخالف الصيغة الطبيعية الأولى (1NF)؟',
    options: [
      { id: 'a', text: 'عمود يحتوي قيمة نصية واحدة' },
      { id: 'b', text: 'عمود "أرقام الهاتف" يحتوي أكثر من رقم مفصول بفاصلة' },
      { id: 'c', text: 'جدول له مفتاح أساسي واحد' },
      { id: 'd', text: 'عمود تاريخ الميلاد' },
    ],
    correctId: 'b',
  };

  constructor() {
    setTimeout(() => this.phase.set('question'), 2500);
  }

  select(id: string): void {
    if (this.phase() !== 'question') return;
    this.selected.set(id);
  }

  submit(): void {
    if (!this.selected()) return;
    this.phase.set('submitted');
    setTimeout(() => {
      this.wasCorrect.set(this.selected() === this.question.correctId);
      this.phase.set('feedback');
    }, 1400);
  }

  goToPerformance(): void {
    this.router.navigateByUrl('/student/performance');
  }
}
