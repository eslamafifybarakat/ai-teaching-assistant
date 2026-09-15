import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { QuestionBankItem } from '../../../../infrastructure/mock-data/models';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-question-bank',
  imports: [TranslatePipe, Card, Badge, Button, SearchInput, EmptyState],
  templateUrl: './question-bank.html',
  styleUrl: './question-bank.scss',
})
export class QuestionBank {
  private data = inject(MockDataService);
  private toast = inject(ToastService);

  all = signal<QuestionBankItem[]>(this.data.getQuestionBank());
  query = signal('');
  difficultyFilter = signal<string | null>(null);
  generating = signal(false);

  difficulties = ['easy', 'medium', 'hard'];

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.all().filter(item => {
      const matchesQuery = !q || item.prompt.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q);
      const matchesDiff = !this.difficultyFilter() || item.difficulty === this.difficultyFilter();
      return matchesQuery && matchesDiff;
    });
  });

  difficultyTone(d: string): 'success' | 'warning' | 'danger' {
    if (d === 'easy') return 'success';
    if (d === 'medium') return 'warning';
    return 'danger';
  }

  generateWithAi(): void {
    this.generating.set(true);
    setTimeout(() => {
      const generated: QuestionBankItem = {
        id: 'gen-' + Date.now(),
        topic: 'BCNF',
        prompt: 'أي من الحالات التالية تتطلب تطبيق BCNF بدلاً من الاكتفاء بـ 3NF؟',
        type: 'mcq',
        difficulty: 'hard',
        bloomLevel: 'Analyze',
        options: [
          { id: 'a', text: 'وجود أكثر من مفتاح مرشح متداخل', votes: 0 },
          { id: 'b', text: 'عدم وجود أي اعتماد وظيفي', votes: 0 },
          { id: 'c', text: 'جدول بعمود واحد فقط', votes: 0 },
          { id: 'd', text: 'وجود مفتاح أساسي بسيط', votes: 0 },
        ],
        correctOptionId: 'a',
        usageCount: 0,
        successRate: 0,
      };
      this.all.update(list => [generated, ...list]);
      this.generating.set(false);
      this.toast.success('✅ تم توليد سؤال جديد بالذكاء الاصطناعي');
    }, 1500);
  }
}
