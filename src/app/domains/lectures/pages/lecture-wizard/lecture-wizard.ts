import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';
import { Badge } from '../../../../shared/components/badge/badge';
import { AiBadge } from '../../../../shared/components/ai-badge/ai-badge';
import { ToastService } from '../../../../core/services/toast.service';

type StepId = 'basics' | 'upload' | 'analysis' | 'objectives' | 'plan' | 'slides';

interface DetectedTopic { id: string; label: string; included: boolean; }
interface PlanItem { id: string; label: string; minutes: number; }

@Component({
  selector: 'app-lecture-wizard',
  imports: [TranslatePipe, Card, Button, Badge, AiBadge],
  templateUrl: './lecture-wizard.html',
  styleUrl: './lecture-wizard.scss',
})
export class LectureWizard {
  private router = inject(Router);
  private toast = inject(ToastService);

  steps: StepId[] = ['basics', 'upload', 'analysis', 'objectives', 'plan', 'slides'];
  stepKeys: Record<StepId, string> = {
    basics: 'wizard.stepBasics', upload: 'wizard.stepUpload', analysis: 'wizard.stepAnalysis',
    objectives: 'wizard.stepObjectives', plan: 'wizard.stepPlan', slides: 'wizard.stepSlides',
  };
  currentStepIndex = signal(0);
  currentStep = computed(() => this.steps[this.currentStepIndex()]);

  // Step 1 — basics
  lectureTitle = signal('التطبيع في قواعد البيانات');
  audience = signal('الفرقة الثالثة');
  duration = signal(90);
  lang = signal('ar');
  level = signal<'levelBeginner' | 'levelIntermediate' | 'levelAdvanced'>('levelIntermediate');

  // Step 2 — upload
  fileName = signal<string | null>(null);
  manualTopic = signal('');
  isDragging = signal(false);

  // Step 3 — analysis
  analyzing = signal(false);
  analyzed = signal(false);
  detectedTopics = signal<DetectedTopic[]>([]);

  // Step 4 — objectives
  objectives = signal<string[]>([]);
  newObjective = signal('');

  // Step 5 — plan
  plan = signal<PlanItem[]>([]);

  // Step 6 — slides
  generatingSlides = signal(false);
  slidesReady = signal(false);

  goTo(index: number): void {
    if (index < 0 || index >= this.steps.length) return;
    this.currentStepIndex.set(index);
  }

  next(): void { this.goTo(this.currentStepIndex() + 1); }
  back(): void { this.goTo(this.currentStepIndex() - 1); }

  simulateUpload(name: string): void {
    this.fileName.set(name);
    this.isDragging.set(false);
    this.toast.success(name + ' — تم الرفع بنجاح');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.simulateUpload('Database-Normalization-Chapter5.pdf');
  }

  removeFile(): void {
    this.fileName.set(null);
  }

  startAnalysis(): void {
    this.analyzing.set(true);
    this.analyzed.set(false);
    setTimeout(() => {
      this.detectedTopics.set([
        { id: 't1', label: 'مقدمة عن التطبيع', included: true },
        { id: 't2', label: 'الصيغة الطبيعية الأولى (1NF)', included: true },
        { id: 't3', label: 'الصيغة الطبيعية الثانية (2NF)', included: true },
        { id: 't4', label: 'الصيغة الطبيعية الثالثة (3NF)', included: true },
        { id: 't5', label: 'صيغة بويس-كود (BCNF) — متقدم', included: false },
      ]);
      this.objectives.set([
        'شرح مفهوم التطبيع وأهميته في تصميم قواعد البيانات.',
        'التمييز بين الصيغ الطبيعية الأولى والثانية والثالثة.',
        'تحويل جدول غير مطبّع إلى الصيغة الطبيعية الثالثة.',
        'تحديد المشكلات الشائعة الناتجة عن ضعف التطبيع.',
      ]);
      this.plan.set([
        { id: 'p1', label: 'مقدمة وتحفيز', minutes: 5 },
        { id: 'p2', label: 'لماذا نحتاج التطبيع؟', minutes: 10 },
        { id: 'p3', label: '1NF', minutes: 15 },
        { id: 'p4', label: '2NF', minutes: 20 },
        { id: 'p5', label: '3NF', minutes: 20 },
        { id: 'p6', label: 'تمرين تطبيقي', minutes: 15 },
        { id: 'p7', label: 'اختبار سريع وختام', minutes: 5 },
      ]);
      this.analyzing.set(false);
      this.analyzed.set(true);
    }, 1800);
  }

  toggleTopic(id: string): void {
    this.detectedTopics.update(list => list.map(t => t.id === id ? { ...t, included: !t.included } : t));
  }

  addObjective(): void {
    const v = this.newObjective().trim();
    if (!v) return;
    this.objectives.update(list => [...list, v]);
    this.newObjective.set('');
  }

  removeObjective(index: number): void {
    this.objectives.update(list => list.filter((_, i) => i !== index));
  }

  movePlanItem(index: number, dir: -1 | 1): void {
    const list = [...this.plan()];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    this.plan.set(list);
  }

  totalMinutes = computed(() => this.plan().reduce((sum, p) => sum + p.minutes, 0));

  generateSlides(): void {
    this.generatingSlides.set(true);
    setTimeout(() => {
      this.generatingSlides.set(false);
      this.slidesReady.set(true);
    }, 2000);
  }

  finish(): void {
    this.toast.success('تم إنشاء المحاضرة! جارِ فتح محرر الشرائح…');
    this.router.navigateByUrl('/app/lecture/lec-normalization/slides');
  }
}
