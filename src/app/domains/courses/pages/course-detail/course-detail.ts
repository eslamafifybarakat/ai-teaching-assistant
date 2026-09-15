import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { Tabs, TabItem } from '../../../../shared/components/tabs/tabs';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-course-detail',
  imports: [TranslatePipe, Card, Badge, Button, Tabs, Avatar, ProgressBar, BarChart],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail {
  private route = inject(ActivatedRoute);
  private data = inject(MockDataService);
  private i18n = inject(I18nService);
  router = inject(Router);

  courseId = this.route.snapshot.paramMap.get('courseId') ?? '';
  course = computed(() => this.data.getCourse(this.courseId));
  lectures = computed(() => this.data.getLectures(this.courseId));
  students = this.data.getStudents();
  weakConcepts = this.data.getWeakConcepts();

  activeTab = signal('overview');
  tabs = computed<TabItem[]>(() => [
    { id: 'overview', label: this.i18n.translate('courses.tabOverview'), icon: '📋' },
    { id: 'lectures', label: this.i18n.translate('courses.tabLectures'), icon: '🗓️' },
    { id: 'students', label: this.i18n.translate('courses.tabStudents'), icon: '👥' },
    { id: 'materials', label: this.i18n.translate('courses.tabMaterials'), icon: '📁' },
    { id: 'analytics', label: this.i18n.translate('courses.tabAnalytics'), icon: '📊' },
    { id: 'questionBank', label: this.i18n.translate('courses.tabQuestionBank'), icon: '🧠' },
  ]);

  toneForStatus(status: string): 'success' | 'neutral' | 'warning' {
    if (status === 'published') return 'success';
    if (status === 'scheduled') return 'warning';
    return 'neutral';
  }

  goToLecture(id: string): void {
    this.router.navigateByUrl('/app/lecture/' + id + '/slides');
  }

  newLecture(): void {
    this.router.navigateByUrl('/app/lecture/new');
  }
}
