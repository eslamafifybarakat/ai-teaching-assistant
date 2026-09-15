export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  avatarColor: string;
  overallScore: number;
  participation: number;
  badges: string[];
  topicScores: Record<string, number>;
}

export interface CourseSummary {
  id: string;
  name: string;
  stage: string;
  term: string;
  description: string;
  studentsCount: number;
  lecturesCount: number;
  avgScore: number;
  status: 'active' | 'archived';
  updatedAt: string;
  color: string;
  icon: string;
}

export interface LectureSummary {
  id: string;
  courseId: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled';
  durationMin: number;
  updatedAt: string;
  avgScore?: number;
  participation?: number;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  speakerNotes: string;
  aiGenerated: boolean;
  hasExample?: boolean;
  hasDiagram?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  votes: number;
}

export interface QuestionBankItem {
  id: string;
  topic: string;
  prompt: string;
  type: 'mcq' | 'trueFalse' | 'multiSelect';
  difficulty: 'easy' | 'medium' | 'hard';
  bloomLevel: string;
  options: QuestionOption[];
  correctOptionId: string;
  usageCount: number;
  successRate: number;
}

export interface ConceptScore {
  concept: string;
  score: number;
}
