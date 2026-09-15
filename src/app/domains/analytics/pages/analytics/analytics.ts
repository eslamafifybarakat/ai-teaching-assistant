import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';
import { DonutChart } from '../../../../shared/components/donut-chart/donut-chart';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';

@Component({
  selector: 'app-analytics',
  imports: [TranslatePipe, Card, StatCard, BarChart, DonutChart],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private data = inject(MockDataService);

  range = signal<'last7' | 'last30' | 'thisTerm'>('last30');

  weakConcepts = this.data.getWeakConcepts().map(w => ({ label: w.concept, value: w.score }));

  lecturesEngagement = [
    { label: 'التطبيع', value: 91 },
    { label: 'ERD', value: 88 },
    { label: 'القوائم المرتبطة', value: 85 },
    { label: 'الأشجار الثنائية', value: 79 },
  ];

  attendanceSegments = [
    { label: 'حضور', value: 88, color: 'var(--color-success-500)' },
    { label: 'غياب', value: 12, color: 'var(--color-danger-500)' },
  ];

  questionTypeSegments = [
    { label: 'اختيار من متعدد', value: 62, color: 'var(--color-primary-500)' },
    { label: 'صح/خطأ', value: 23, color: 'var(--color-accent-500)' },
    { label: 'إجابات متعددة', value: 15, color: 'var(--color-success-500)' },
  ];

  topStudents = this.data.getStudents().slice().sort((a, b) => b.overallScore - a.overallScore).slice(0, 5);
}
