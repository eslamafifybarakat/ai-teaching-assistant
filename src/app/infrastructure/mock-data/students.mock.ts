import { Student } from './models';

const NAMES = [
  'يوسف كريم', 'مريم عادل', 'عمر سامي', 'نور الهدى', 'كريم عاطف', 'سلمى وليد',
  'أحمد جمال', 'هنا محمود', 'زياد فتحي', 'ياسمين طارق', 'محمد إبراهيم', 'ليلى حسام',
  'علي رضا', 'دينا شريف', 'حسين عمرو', 'رنا ماجد', 'مصطفى نبيل', 'جنى سليم',
];

const COLORS = ['#4f5fd6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateStudents(topics: string[], seedOffset = 0): Student[] {
  return NAMES.map((name, i) => {
    const seed = i + seedOffset;
    const base = 70 + Math.floor(seededRandom(seed * 3.1) * 25);
    const topicScores: Record<string, number> = {};
    topics.forEach((t, ti) => {
      // Later topics in the sequence are deliberately harder, producing a
      // believable "1NF strong -> BCNF weak" story instead of pure noise.
      const difficultyPenalty = ti * 11;
      const variance = Math.floor(seededRandom(seed * 7.3 + ti) * 20) - 8;
      topicScores[t] = Math.max(15, Math.min(100, base - difficultyPenalty + variance));
    });
    const overall = Math.round(
      Object.values(topicScores).reduce((a, b) => a + b, 0) / topics.length
    );
    const badges: string[] = [];
    if (overall > 85) badges.push('⭐ متفوق');
    if ((topicScores[topics[0]] ?? 0) > 90) badges.push('🏅 خبير ' + topics[0]);
    return {
      id: `s${i + 1}${seedOffset}`,
      name,
      studentNumber: `2026${String(1000 + i + seedOffset)}`,
      avatarColor: COLORS[i % COLORS.length],
      overallScore: overall,
      participation: 70 + Math.floor(seededRandom(seed * 5.7) * 30),
      badges,
      topicScores,
    };
  });
}
