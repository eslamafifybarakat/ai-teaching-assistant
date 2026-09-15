import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';
import { AiBadge } from '../../../../shared/components/ai-badge/ai-badge';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { Slide } from '../../../../infrastructure/mock-data/models';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-slide-editor',
  imports: [TranslatePipe, Card, Button, AiBadge],
  templateUrl: './slide-editor.html',
  styleUrl: './slide-editor.scss',
})
export class SlideEditor {
  private route = inject(ActivatedRoute);
  private data = inject(MockDataService);
  private toast = inject(ToastService);
  router = inject(Router);

  lectureId = this.route.snapshot.paramMap.get('lectureId') ?? 'lec-normalization';
  slides = signal<Slide[]>(this.data.getSlides(this.lectureId));
  activeIndex = signal(0);
  activeSlide = computed(() => this.slides()[this.activeIndex()]);
  showNotes = signal(true);
  aiWorking = signal<string | null>(null);

  select(i: number): void { this.activeIndex.set(i); }

  updateTitle(v: string): void {
    this.patch({ title: v });
  }
  updateContent(v: string): void {
    this.patch({ content: v });
  }
  updateNotes(v: string): void {
    this.patch({ speakerNotes: v });
  }

  private patch(partial: Partial<Slide>): void {
    this.slides.update(list => list.map((s, i) => i === this.activeIndex() ? { ...s, ...partial } : s));
  }

  addSlide(): void {
    const newSlide: Slide = { id: 's' + Date.now(), title: 'شريحة جديدة', content: '', speakerNotes: '', aiGenerated: false };
    this.slides.update(list => {
      const copy = [...list];
      copy.splice(this.activeIndex() + 1, 0, newSlide);
      return copy;
    });
    this.activeIndex.update(i => i + 1);
  }

  duplicateSlide(): void {
    const current = this.activeSlide();
    const dup: Slide = { ...current, id: 's' + Date.now(), title: current.title + ' (نسخة)' };
    this.slides.update(list => {
      const copy = [...list];
      copy.splice(this.activeIndex() + 1, 0, dup);
      return copy;
    });
  }

  deleteSlide(): void {
    if (this.slides().length <= 1) return;
    this.slides.update(list => list.filter((_, i) => i !== this.activeIndex()));
    this.activeIndex.update(i => Math.max(0, i - 1));
  }

  moveSlide(dir: -1 | 1): void {
    const i = this.activeIndex();
    const target = i + dir;
    if (target < 0 || target >= this.slides().length) return;
    const list = [...this.slides()];
    [list[i], list[target]] = [list[target], list[i]];
    this.slides.set(list);
    this.activeIndex.set(target);
  }

  runAiAction(action: string): void {
    this.aiWorking.set(action);
    setTimeout(() => {
      const current = this.activeSlide();
      const suffix: Record<string, string> = {
        simplify: '\n\n(نسخة مبسّطة: تم تقليل المصطلحات التقنية وإضافة تشبيه واقعي.)',
        expand: '\n\n(تفصيل إضافي: تمت إضافة سياق تاريخي وحالة استخدام صناعية.)',
        addExample: '\n\nمثال: نظام حجوزات فندقي يحتوي بيانات عميل مكررة في كل حجز.',
        addStatistic: '\n\nإحصائية: 68% من مشاكل قواعد البيانات في الإنتاج ناتجة عن ضعف التطبيع (بيانات توضيحية).',
        addQuestion: '\n\nسؤال سريع: أي مما يلي يمثل انتهاكًا لـ 2NF؟',
      };
      this.patch({ content: current.content + (suffix[action] ?? ''), aiGenerated: true });
      this.aiWorking.set(null);
      this.toast.success('تم تحديث الشريحة بواسطة الذكاء الاصطناعي');
    }, 1100);
  }

  startPresentation(): void {
    this.router.navigateByUrl('/present/' + this.lectureId);
  }
}
