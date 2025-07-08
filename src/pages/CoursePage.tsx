import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen, Code } from 'lucide-react';
import ProgressTracker from '../components/ProgressTracker';
import CodeEditor from '../components/CodeEditor';
import Quiz from '../components/Quiz';
import BadgeModal from '../components/BadgeModal';
import { Course, Lesson, Quiz as QuizType, Badge } from '../types';
import { setLessonProgress, getLessonProgress, addBadge, saveQuizResult, updateUserProgress } from '../utils/localStorage';
import { qubicRPC } from '../utils/qubicRpcSimulator';
import coursesData from '../data/courses.json';
import quizzesData from '../data/quizzes.json';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  useEffect(() => {
    const courseData = coursesData.find(c => c.id === courseId) as Course;
    if (courseData) {
      setCourse(courseData);
      setCurrentLesson(courseData.lessons[0]);
    }
  }, [courseId]);

  const handleLessonSelect = (lessonId: string) => {
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      setShowQuiz(false);
      setShowCodeEditor(false);
    }
  };

  const handleCompleteLesson = () => {
    if (!currentLesson || !course) return;

    setLessonProgress(currentLesson.id, true);
    updateUserProgress({ lessonsViewed: Date.now() });

    if (currentLesson.hasQuiz) {
      const quizData = quizzesData.find(q => q.lessonId === currentLesson.id) as QuizType;
      if (quizData) {
        setQuiz(quizData);
        setShowQuiz(true);
      }
    } else {
      goToNextLesson();
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    if (!quiz || !currentLesson) return;

    saveQuizResult(quiz.id, score, passed);
    
    if (passed) {
      updateUserProgress({ quizzesPassed: Date.now() });
      
      // Award badge for quiz completion
      const badge: Omit<Badge, 'earnedAt'> = {
        id: `quiz-${quiz.id}`,
        name: `Quiz Master`,
        description: `Passed ${quiz.title} with ${score}% score`,
        icon: '🧠',
        type: 'quiz'
      };
      
      addBadge(badge);
      
      // Mint SBT
      await qubicRPC.mintSBT('student', 'quiz_completion', {
        quizId: quiz.id,
        score,
        lessonId: currentLesson.id
      });
      
      setEarnedBadge({ ...badge, earnedAt: new Date().toISOString() });
      setShowBadge(true);
    }
    
    setShowQuiz(false);
    goToNextLesson();
  };

  const goToNextLesson = () => {
    if (!course || !currentLesson) return;

    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1]);
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !currentLesson) return;

    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1]);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return getLessonProgress(lessonId);
  };

  const canGoToNext = () => {
    if (!course || !currentLesson) return false;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex < course.lessons.length - 1;
  };

  const canGoToPrevious = () => {
    if (!course || !currentLesson) return false;
    const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
    return currentIndex > 0;
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (showQuiz && quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setShowQuiz(false)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lesson</span>
            </button>
          </div>
          <Quiz quiz={quiz} onComplete={handleQuizComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Code className="w-4 h-4" />
                <span>{showCodeEditor ? 'Hide Editor' : 'Show Editor'}</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {course.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {course.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProgressTracker
              lessons={course.lessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{currentLesson.estimatedTime}</span>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                {currentLesson.codeExample && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Code Example
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-800 dark:text-gray-200">
                        <code>{currentLesson.codeExample}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goToPreviousLesson}
                    disabled={!canGoToPrevious()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    {!isLessonCompleted(currentLesson.id) && (
                      <button
                        onClick={handleCompleteLesson}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete Lesson</span>
                      </button>
                    )}

                    <button
                      onClick={goToNextLesson}
                      disabled={!canGoToNext()}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            {showCodeEditor && (
              <div className="mb-8">
                <CodeEditor
                  initialCode={currentLesson.codeExample || ''}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge Modal */}
      {showBadge && earnedBadge && (
        <BadgeModal
          badge={earnedBadge}
          isOpen={showBadge}
          onClose={() => setShowBadge(false)}
        />
      )}
    </div>
  );
};

export default CoursePage;