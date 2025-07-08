export interface User {
  id: string;
  name: string;
  joinDate: string;
  coursesCompleted: number;
  lessonsViewed: number;
  quizzesPassed: number;
  badges: Badge[];
  streak: number;
  totalScore: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  lessons: Lesson[];
  completed: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  estimatedTime: string;
  completed: boolean;
  hasQuiz: boolean;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'course' | 'quiz' | 'streak' | 'achievement';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
}