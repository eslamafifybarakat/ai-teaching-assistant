import { LectureSummary } from './models';

export const MOCK_LECTURES: LectureSummary[] = [
  { id: 'lec-normalization', courseId: 'course-db', title: 'التطبيع في قواعد البيانات (Normalization)', status: 'published', durationMin: 90, updatedAt: '2026-09-10', avgScore: 74, participation: 91 },
  { id: 'lec-erd', courseId: 'course-db', title: 'مخططات العلاقات الكيانية (ERD)', status: 'published', durationMin: 60, updatedAt: '2026-09-03', avgScore: 82, participation: 88 },
  { id: 'lec-sql-joins', courseId: 'course-db', title: 'الربط بين الجداول (SQL Joins)', status: 'draft', durationMin: 75, updatedAt: '2026-09-13', },
  { id: 'lec-transactions', courseId: 'course-db', title: 'المعاملات (Transactions)', status: 'scheduled', durationMin: 60, updatedAt: '2026-09-14', },

  { id: 'lec-linked-lists', courseId: 'course-ds', title: 'القوائم المرتبطة (Linked Lists)', status: 'published', durationMin: 70, updatedAt: '2026-09-08', avgScore: 69, participation: 85 },
  { id: 'lec-trees', courseId: 'course-ds', title: 'الأشجار الثنائية (Binary Trees)', status: 'draft', durationMin: 80, updatedAt: '2026-09-12', },
  { id: 'lec-stacks-queues', courseId: 'course-ds', title: 'المكدسات والطوابير', status: 'scheduled', durationMin: 55, updatedAt: '2026-09-14', },

  { id: 'lec-life-cycle', courseId: 'course-science6', title: 'الكائنات الحية ودورة حياتها', status: 'published', durationMin: 45, updatedAt: '2026-09-12', avgScore: 88, participation: 95 },
  { id: 'lec-ecosystem', courseId: 'course-science6', title: 'النظام البيئي من حولنا', status: 'draft', durationMin: 40, updatedAt: '2026-09-13', },
];
