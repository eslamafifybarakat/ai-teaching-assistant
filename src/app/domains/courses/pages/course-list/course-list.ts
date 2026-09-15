import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Modal } from '../../../../shared/components/modal/modal';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-course-list',
  imports: [TranslatePipe, Card, Badge, Button, SearchInput, EmptyState, Modal],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList {
  private data = inject(MockDataService);
  private router = inject(Router);
  private toast = inject(ToastService);

  query = signal('');
  createOpen = signal(false);
  newCourseName = signal('');
  newCourseStage = signal('');

  courses = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.data.getCourses();
    if (!q) return all;
    return all.filter(c => c.name.toLowerCase().includes(q));
  });

  openCourse(id: string): void {
    this.router.navigateByUrl('/app/courses/' + id);
  }

  createCourse(): void {
    if (!this.newCourseName().trim()) return;
    this.toast.success('تم إنشاء المقرر بنجاح (تجريبي)');
    this.createOpen.set(false);
    this.newCourseName.set('');
    this.newCourseStage.set('');
  }
}
