import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, TranslatePipe, StatCard, Card, Badge, Button, ProgressBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private auth = inject(AuthService);
  private data = inject(MockDataService);
  router = inject(Router);

  user = computed(() => this.auth.currentUser());
  courses = this.data.getCourses();
  lectures = this.data.getLectures().slice(0, 4);
  weakConcepts = this.data.getWeakConcepts().sort((a, b) => a.score - b.score).slice(0, 3);

  totalStudents = computed(() => this.courses.reduce((sum, c) => sum + c.studentsCount, 0));
  avgScore = computed(() => Math.round(this.courses.reduce((sum, c) => sum + c.avgScore, 0) / this.courses.length));

  activity = [
    { icon: '📤', key: 'activityUploaded', target: 'التطبيع في قواعد البيانات', time: 'منذ ساعتين' },
    { icon: '🖼️', key: 'activityGenerated', target: 'مخططات العلاقات الكيانية', time: 'أمس' },
    { icon: '✅', key: 'activityGraded', target: 'اختبار القوائم المرتبطة', time: 'منذ يومين' },
    { icon: '💬', key: 'activityCommented', target: 'شريحة BCNF', time: 'منذ 3 أيام' },
  ];

  toneForStatus(status: string): 'success' | 'neutral' | 'warning' {
    if (status === 'published') return 'success';
    if (status === 'scheduled') return 'warning';
    return 'neutral';
  }

  newLecture(): void { this.router.navigateByUrl('/app/lecture/new'); }
  openCourse(id: string): void { this.router.navigateByUrl('/app/courses/' + id); }
}
