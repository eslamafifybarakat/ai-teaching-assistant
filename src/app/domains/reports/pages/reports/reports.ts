import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Button } from '../../../../shared/components/button/button';
import { Badge } from '../../../../shared/components/badge/badge';
import { Tabs, TabItem } from '../../../../shared/components/tabs/tabs';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ToastService } from '../../../../core/services/toast.service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-reports',
  imports: [TranslatePipe, Card, Button, Badge, Tabs, BarChart],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private data = inject(MockDataService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  activeTab = signal('lecture');
  tabs = computed<TabItem[]>(() => [
    { id: 'lecture', label: this.i18n.translate('reports.lectureReport'), icon: '🗓️' },
    { id: 'quiz', label: this.i18n.translate('reports.quizReport'), icon: '🧠' },
    { id: 'student', label: this.i18n.translate('reports.studentReport'), icon: '🧑‍🎓' },
    { id: 'course', label: this.i18n.translate('reports.courseReport'), icon: '📚' },
  ]);

  exporting = signal(false);

  weakConcepts = this.data.getWeakConcepts().map(w => ({ label: w.concept, value: w.score }));

  exportFile(kind: string): void {
    this.exporting.set(true);
    this.toast.info('⏳ ' + this.i18n.translate('reports.exportPreparing'));
    setTimeout(() => {
      this.exporting.set(false);
      this.toast.success('✅ ' + this.i18n.translate('reports.exportReady') + ' — ' + kind);
    }, 1400);
  }
}
