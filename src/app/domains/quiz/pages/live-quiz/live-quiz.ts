import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';
import { Badge } from '../../../../shared/components/badge/badge';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { ToastService } from '../../../../core/services/toast.service';

type QType = 'typeMcq' | 'typeTrueFalse' | 'typeMultiSelect';
type Difficulty = 'diffEasy' | 'diffMedium' | 'diffHard';

interface LiveOption { id: string; text: string; votes: number; correct: boolean; }

const QUESTION_BANK: { prompt: string; topic: string; options: LiveOption[] }[] = [
  {
    prompt: 'أي مما يلي يخالف الصيغة الطبيعية الأولى (1NF)؟', topic: '1NF',
    options: [
      { id: 'a', text: 'عمود يحتوي قيمة نصية واحدة', votes: 0, correct: false },
      { id: 'b', text: 'عمود "أرقام الهاتف" يحتوي أكثر من رقم مفصول بفاصلة', votes: 0, correct: true },
      { id: 'c', text: 'جدول له مفتاح أساسي واحد', votes: 0, correct: false },
      { id: 'd', text: 'عمود تاريخ الميلاد', votes: 0, correct: false },
    ],
  },
  {
    prompt: 'ما هو الاعتماد الجزئي (Partial Dependency)؟', topic: '2NF',
    options: [
      { id: 'a', text: 'اعتماد عمود على جزء فقط من مفتاح مركّب', votes: 0, correct: true },
      { id: 'b', text: 'اعتماد عمود على عمود آخر غير أساسي', votes: 0, correct: false },
      { id: 'c', text: 'عدم وجود أي مفتاح', votes: 0, correct: false },
      { id: 'd', text: 'وجود مفتاح خارجي فقط', votes: 0, correct: false },
    ],
  },
  {
    prompt: 'رقم الموظف → رقم القسم → اسم مدير القسم — أي مفهوم يمثل هذا؟', topic: '3NF',
    options: [
      { id: 'a', text: 'اعتماد جزئي', votes: 0, correct: false },
      { id: 'b', text: 'اعتماد انتقالي (Transitive)', votes: 0, correct: true },
      { id: 'c', text: 'لا يوجد اعتماد', votes: 0, correct: false },
      { id: 'd', text: 'مفتاح مركّب', votes: 0, correct: false },
    ],
  },
];

@Component({
  selector: 'app-live-quiz',
  imports: [TranslatePipe, Card, Button, Badge, BarChart],
  templateUrl: './live-quiz.html',
  styleUrl: './live-quiz.scss',
})
export class LiveQuiz {
  private route = inject(ActivatedRoute);
  private data = inject(MockDataService);
  private toast = inject(ToastService);
  router = inject(Router);

  lectureId = this.route.snapshot.paramMap.get('lectureId') ?? 'lec-normalization';

  qType = signal<QType>('typeMcq');
  difficulty = signal<Difficulty>('diffMedium');
  topic = signal('1NF');
  topics = ['1NF', '2NF', '3NF', 'BCNF'];

  question = signal<{ prompt: string; topic: string; options: LiveOption[] } | null>(null);
  live = signal(false);
  revealAnswer = signal(false);
  responseCount = computed(() => this.question()?.options.reduce((s, o) => s + o.votes, 0) ?? 0);
  joinCode = signal('TB-4821');

  private cursor = 0;
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  weakConcepts = this.data.getWeakConcepts().map(w => ({ label: w.concept, value: w.score }));

  generateQuestion(): void {
    if (this.tickHandle) clearInterval(this.tickHandle);
    const q = QUESTION_BANK[this.cursor % QUESTION_BANK.length];
    this.cursor++;
    this.question.set({ ...q, options: q.options.map(o => ({ ...o, votes: 0 })) });
    this.live.set(true);
    this.revealAnswer.set(false);
    this.joinCode.set('TB-' + (4000 + Math.floor(Math.random() * 999)));
    this.simulateResponses();
  }

  private simulateResponses(): void {
    let ticks = 0;
    this.tickHandle = setInterval(() => {
      const q = this.question();
      if (!q) return;
      ticks++;
      const correctIdx = q.options.findIndex(o => o.correct);
      const list = [...q.options];
      const weightedIdx = Math.random() < 0.68 ? correctIdx : Math.floor(Math.random() * list.length);
      list[weightedIdx] = { ...list[weightedIdx], votes: list[weightedIdx].votes + 1 };
      this.question.set({ ...q, options: list });
      if (ticks >= 40 && this.tickHandle) {
        clearInterval(this.tickHandle);
      }
    }, 300);
  }

  toggleReveal(): void {
    this.revealAnswer.update(v => !v);
  }

  closeQuestion(): void {
    if (this.tickHandle) clearInterval(this.tickHandle);
    this.live.set(false);
  }

  saveToBank(): void {
    this.toast.success('✅ تم حفظ السؤال في بنك الأسئلة');
  }

  correctPercent = computed(() => {
    const q = this.question();
    if (!q) return 0;
    const total = this.responseCount() || 1;
    const correctVotes = q.options.find(o => o.correct)?.votes ?? 0;
    return Math.round((correctVotes / total) * 100);
  });

  barData = computed(() => {
    const q = this.question();
    if (!q) return [];
    return q.options.map(o => ({ label: o.text, value: o.votes, tone: o.correct && this.revealAnswer() ? 'var(--color-success-500)' : 'var(--color-primary-400)' }));
  });
}
