import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth/login',
    loadComponent: () => import('./domains/auth/pages/login/login').then(m => m.Login),
  },
  {
    path: 'student',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'join' },
      { path: 'join', loadComponent: () => import('./domains/student/pages/student-join/student-join').then(m => m.StudentJoin) },
      { path: 'quiz', loadComponent: () => import('./domains/student/pages/student-quiz/student-quiz').then(m => m.StudentQuiz) },
      { path: 'performance', loadComponent: () => import('./domains/student/pages/student-performance/student-performance').then(m => m.StudentPerformance) },
    ],
  },
  {
    path: 'present/:lectureId',
    loadComponent: () => import('./domains/lectures/pages/presentation-mode/presentation-mode').then(m => m.PresentationMode),
    canActivate: [authGuard],
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell/shell').then(m => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./domains/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'courses', loadComponent: () => import('./domains/courses/pages/course-list/course-list').then(m => m.CourseList) },
      { path: 'courses/:courseId', loadComponent: () => import('./domains/courses/pages/course-detail/course-detail').then(m => m.CourseDetail) },
      { path: 'lecture/new', loadComponent: () => import('./domains/lectures/pages/lecture-wizard/lecture-wizard').then(m => m.LectureWizard) },
      { path: 'lecture/:lectureId/slides', loadComponent: () => import('./domains/lectures/pages/slide-editor/slide-editor').then(m => m.SlideEditor) },
      { path: 'quiz/:lectureId', loadComponent: () => import('./domains/quiz/pages/live-quiz/live-quiz').then(m => m.LiveQuiz) },
      { path: 'question-bank', loadComponent: () => import('./domains/question-bank/pages/question-bank/question-bank').then(m => m.QuestionBank) },
      { path: 'analytics', loadComponent: () => import('./domains/analytics/pages/analytics/analytics').then(m => m.Analytics) },
      { path: 'reports', loadComponent: () => import('./domains/reports/pages/reports/reports').then(m => m.Reports) },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
