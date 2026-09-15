import { Injectable } from '@angular/core';
import { MOCK_COURSES } from '../mock-data/courses.mock';
import { MOCK_LECTURES } from '../mock-data/lectures.mock';
import { generateStudents } from '../mock-data/students.mock';
import { NORMALIZATION_TOPICS, MOCK_QUESTION_BANK, MOCK_QUESTION_BANK_SCIENCE } from '../mock-data/questions.mock';
import { NORMALIZATION_SLIDES, LIFE_CYCLE_SLIDES } from '../mock-data/slides.mock';
import { CourseSummary, LectureSummary, QuestionBankItem, Slide, Student } from '../mock-data/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private students = generateStudents(NORMALIZATION_TOPICS, 0);

  getCourses(): CourseSummary[] {
    return MOCK_COURSES;
  }

  getCourse(id: string): CourseSummary | undefined {
    return MOCK_COURSES.find(c => c.id === id);
  }

  getLectures(courseId?: string): LectureSummary[] {
    return courseId ? MOCK_LECTURES.filter(l => l.courseId === courseId) : MOCK_LECTURES;
  }

  getLecture(id: string): LectureSummary | undefined {
    return MOCK_LECTURES.find(l => l.id === id);
  }

  getStudents(): Student[] {
    return this.students;
  }

  getQuestionBank(): QuestionBankItem[] {
    return [...MOCK_QUESTION_BANK, ...MOCK_QUESTION_BANK_SCIENCE];
  }

  getSlides(lectureId: string): Slide[] {
    if (lectureId === 'lec-life-cycle') return LIFE_CYCLE_SLIDES;
    return NORMALIZATION_SLIDES;
  }

  getWeakConcepts(): { concept: string; score: number }[] {
    const topics = NORMALIZATION_TOPICS;
    return topics.map(topic => {
      const avg = this.students.reduce((sum, s) => sum + (s.topicScores[topic] ?? 0), 0) / this.students.length;
      return { concept: topic, score: Math.round(avg) };
    });
  }
}
