import { QuestionBankItem } from './models';

export const NORMALIZATION_TOPICS = ['1NF', '2NF', '3NF', 'BCNF'];

export const MOCK_QUESTION_BANK: QuestionBankItem[] = [
  {
    id: 'q1', topic: '1NF', prompt: 'أي مما يلي يخالف الصيغة الطبيعية الأولى (1NF)؟',
    type: 'mcq', difficulty: 'easy', bloomLevel: 'Remember',
    options: [
      { id: 'a', text: 'عمود يحتوي قيمة نصية واحدة', votes: 4 },
      { id: 'b', text: 'عمود "أرقام الهاتف" يحتوي أكثر من رقم مفصول بفاصلة', votes: 61 },
      { id: 'c', text: 'جدول له مفتاح أساسي واحد', votes: 8 },
      { id: 'd', text: 'عمود تاريخ الميلاد', votes: 3 },
    ],
    correctOptionId: 'b', usageCount: 12, successRate: 82,
  },
  {
    id: 'q2', topic: '2NF', prompt: 'الاعتماد الجزئي (Partial Dependency) يحدث عندما...',
    type: 'mcq', difficulty: 'medium', bloomLevel: 'Understand',
    options: [
      { id: 'a', text: 'يعتمد عمود على جزء فقط من مفتاح مركّب', votes: 48 },
      { id: 'b', text: 'يعتمد عمود على عمود آخر غير أساسي', votes: 15 },
      { id: 'c', text: 'يحتوي الجدول على مفتاح أساسي واحد فقط', votes: 6 },
      { id: 'd', text: 'لا توجد علاقة بين الجداول', votes: 2 },
    ],
    correctOptionId: 'a', usageCount: 9, successRate: 68,
  },
  {
    id: 'q3', topic: '3NF', prompt: 'أي سيناريو يمثّل اعتمادًا انتقاليًا (Transitive Dependency)؟',
    type: 'mcq', difficulty: 'hard', bloomLevel: 'Analyze',
    options: [
      { id: 'a', text: 'رقم الطالب → اسم الطالب', votes: 10 },
      { id: 'b', text: 'رقم الموظف → رقم القسم → اسم مدير القسم', votes: 29 },
      { id: 'c', text: 'رقم المنتج → السعر', votes: 6 },
      { id: 'd', text: 'لا شيء مما سبق', votes: 3 },
    ],
    correctOptionId: 'b', usageCount: 7, successRate: 54,
  },
  {
    id: 'q4', topic: 'BCNF', prompt: 'صح أم خطأ: كل جدول في BCNF يكون بالضرورة في 3NF.',
    type: 'trueFalse', difficulty: 'hard', bloomLevel: 'Evaluate',
    options: [
      { id: 'a', text: 'صح', votes: 18 },
      { id: 'b', text: 'خطأ', votes: 26 },
    ],
    correctOptionId: 'a', usageCount: 5, successRate: 41,
  },
  {
    id: 'q5', topic: '1NF', prompt: 'ما هو الشرط الأساسي للوصول إلى 1NF؟',
    type: 'mcq', difficulty: 'easy', bloomLevel: 'Remember',
    options: [
      { id: 'a', text: 'قيم ذرية غير قابلة للتجزئة في كل خلية', votes: 55 },
      { id: 'b', text: 'وجود مفتاح خارجي', votes: 9 },
      { id: 'c', text: 'عدم وجود أعمدة نصية', votes: 2 },
      { id: 'd', text: 'استخدام فهرس فريد', votes: 4 },
    ],
    correctOptionId: 'a', usageCount: 15, successRate: 90,
  },
];

export const SCIENCE_TOPICS = ['دورة حياة الفراشة', 'دورة حياة الضفدع', 'النظام البيئي'];

export const MOCK_QUESTION_BANK_SCIENCE: QuestionBankItem[] = [
  {
    id: 'sq1', topic: 'دورة حياة الفراشة', prompt: 'ما هي المرحلة التي تأتي بعد اليرقة في حياة الفراشة؟',
    type: 'mcq', difficulty: 'easy', bloomLevel: 'Remember',
    options: [
      { id: 'a', text: 'بيضة', votes: 3 },
      { id: 'b', text: 'شرنقة', votes: 21 },
      { id: 'c', text: 'فراشة كاملة', votes: 5 },
      { id: 'd', text: 'لا شيء', votes: 1 },
    ],
    correctOptionId: 'b', usageCount: 4, successRate: 88,
  },
];
