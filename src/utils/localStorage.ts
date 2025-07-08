import { User, Badge, Course, Quiz } from '../types';
import { v4 as uuidv4 } from 'uuid';

const USER_KEY = 'qubilearn_user';
const PROGRESS_KEY = 'qubilearn_progress';
const BADGES_KEY = 'qubilearn_badges';
const QUIZ_RESULTS_KEY = 'qubilearn_quiz_results';
const THEME_KEY = 'qubilearn_theme';
const API_KEY = 'qubilearn_openai_key';

export const createDefaultUser = (): User => ({
  id: uuidv4(),
  name: 'Student',
  joinDate: new Date().toISOString(),
  coursesCompleted: 0,
  lessonsViewed: 0,
  quizzesPassed: 0,
  badges: [],
  streak: 0,
  totalScore: 0,
});

export const getUser = (): User => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : createDefaultUser();
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const updateUserProgress = (updates: Partial<User>): User => {
  const user = getUser();
  const updatedUser = { ...user, ...updates };
  saveUser(updatedUser);
  return updatedUser;
};

export const getLessonProgress = (lessonId: string): boolean => {
  const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  return progress[lessonId] || false;
};

export const setLessonProgress = (lessonId: string, completed: boolean): void => {
  const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  progress[lessonId] = completed;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getCourseProgress = (courseId: string, totalLessons: number): number => {
  const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  const completedLessons = Object.keys(progress).filter(
    key => key.startsWith(`${courseId}-`) && progress[key]
  ).length;
  return Math.round((completedLessons / totalLessons) * 100);
};

export const addBadge = (badge: Omit<Badge, 'earnedAt'>): void => {
  const badges = getBadges();
  const newBadge: Badge = {
    ...badge,
    earnedAt: new Date().toISOString(),
  };
  badges.push(newBadge);
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
};

export const getBadges = (): Badge[] => {
  const stored = localStorage.getItem(BADGES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuizResult = (quizId: string, score: number, passed: boolean): void => {
  const results = JSON.parse(localStorage.getItem(QUIZ_RESULTS_KEY) || '{}');
  results[quizId] = {
    score,
    passed,
    attempts: (results[quizId]?.attempts || 0) + 1,
    lastAttempt: new Date().toISOString(),
  };
  localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
};

export const getQuizResult = (quizId: string) => {
  const results = JSON.parse(localStorage.getItem(QUIZ_RESULTS_KEY) || '{}');
  return results[quizId] || null;
};

export const getTheme = (): string => {
  return localStorage.getItem(THEME_KEY) || 'dark';
};

export const setTheme = (theme: string): void => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getApiKey = (): string => {
  return localStorage.getItem(API_KEY) || '';
};

export const setApiKey = (key: string): void => {
  localStorage.setItem(API_KEY, key);
};

export const clearAllData = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(BADGES_KEY);
  localStorage.removeItem(QUIZ_RESULTS_KEY);
};