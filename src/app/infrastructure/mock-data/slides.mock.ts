import { Slide } from './models';

export const NORMALIZATION_SLIDES: Slide[] = [
  {
    id: 'sl1',
    title: 'التطبيع في قواعد البيانات',
    content: 'مقدمة عن أهمية تنظيم البيانات وتقليل التكرار داخل قواعد البيانات العلائقية.',
    speakerNotes: 'ابدأ بسؤال الطلاب: هل واجهتم مشكلة تكرار بيانات في مشروع سابق؟',
    aiGenerated: true,
  },
  {
    id: 'sl2',
    title: 'لماذا نحتاج إلى التطبيع؟',
    content: 'التكرار غير الضروري → صعوبة التحديث → تضارب البيانات → استهلاك تخزين زائد.',
    speakerNotes: 'اعرض مثال جدول واحد يحتوي بيانات عميل ومنتجات متكررة.',
    aiGenerated: true,
    hasDiagram: true,
  },
  {
    id: 'sl3',
    title: 'الصيغة الطبيعية الأولى (1NF)',
    content: 'كل خلية تحتوي قيمة واحدة فقط (Atomic Values)، ولا توجد مجموعات متكررة.',
    speakerNotes: 'مثال: عمود "أرقام الهواتف" يحتوي أكثر من رقم مفصول بفاصلة — كيف نصلحه؟',
    aiGenerated: true,
    hasExample: true,
  },
  {
    id: 'sl4',
    title: 'الصيغة الطبيعية الثانية (2NF)',
    content: 'يجب أن تعتمد كل الأعمدة غير الأساسية على المفتاح الأساسي بالكامل، لا على جزء منه.',
    speakerNotes: 'وضّح الاعتماد الجزئي (Partial Dependency) بمثال جدول له مفتاح مركّب.',
    aiGenerated: true,
    hasExample: true,
  },
  {
    id: 'sl5',
    title: 'الصيغة الطبيعية الثالثة (3NF)',
    content: 'إزالة الاعتماد الانتقالي (Transitive Dependency) — الأعمدة غير الأساسية لا تعتمد على أعمدة غير أساسية أخرى.',
    speakerNotes: 'هذا الجزء عادة الأصعب على الطلاب — خصص وقتًا إضافيًا ومثالًا واقعيًا.',
    aiGenerated: true,
    hasExample: true,
    hasDiagram: true,
  },
  {
    id: 'sl6',
    title: 'صيغة بويس-كود الطبيعية (BCNF)',
    content: 'نسخة أكثر صرامة من 3NF تعالج حالات خاصة من الاعتماد الوظيفي المتداخل.',
    speakerNotes: 'مفهوم متقدم — يمكن الاكتفاء بمثال واحد بسيط لو الوقت ضيق.',
    aiGenerated: true,
  },
  {
    id: 'sl7',
    title: 'تمرين تطبيقي',
    content: 'حوّلوا الجدول التالي من صيغته غير الطبيعية إلى 3NF خطوة بخطوة.',
    speakerNotes: 'قسّم الطلاب في مجموعات صغيرة لمدة 10 دقائق.',
    aiGenerated: false,
  },
  {
    id: 'sl8',
    title: 'ملخص المحاضرة',
    content: '1NF: قيم ذرية → 2NF: إزالة الاعتماد الجزئي → 3NF: إزالة الاعتماد الانتقالي → BCNF: حالة خاصة أكثر صرامة.',
    speakerNotes: 'اختم بسؤال تحفيزي حي قبل الانتقال للاختبار السريع.',
    aiGenerated: true,
  },
];

export const LIFE_CYCLE_SLIDES: Slide[] = [
  {
    id: 'lc1',
    title: 'الكائنات الحية من حولنا 🌱',
    content: 'كل كائن حي يولد، ينمو، يتكاثر، ثم يموت — هذه هي دورة الحياة!',
    speakerNotes: 'ابدأ بعرض صور لفراشة وضفدع ونبات — اسأل: أيهما يتغير شكله أكثر؟',
    aiGenerated: true,
  },
  {
    id: 'lc2',
    title: 'دورة حياة الفراشة 🦋',
    content: 'بيضة ← يرقة ← شرنقة ← فراشة كاملة.',
    speakerNotes: 'استخدم فيديو قصير إن أمكن — التلاميذ يحبون هذا الجزء كثيرًا.',
    aiGenerated: true,
    hasDiagram: true,
  },
  {
    id: 'lc3',
    title: 'دورة حياة الضفدع 🐸',
    content: 'بيضة ← شرغوف (أبو ذنيبة) ← ضفدع صغير ← ضفدع بالغ.',
    speakerNotes: 'قارن مع الفراشة: هل التغيرات متشابهة؟',
    aiGenerated: true,
    hasExample: true,
  },
  {
    id: 'lc4',
    title: 'لعبة سريعة: رتّب المراحل!',
    content: 'رتّب صور دورة حياة النبات بالترتيب الصحيح.',
    speakerNotes: 'نشاط تفاعلي بسيط — استخدمه لتقييم الفهم بسرعة.',
    aiGenerated: false,
  },
];
