import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { Lesson } from '../types';
import { getLessonProgress } from '../utils/localStorage';

interface ProgressTrackerProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  lessons,
  currentLessonId,
  onLessonSelect
}) => {
  const isLessonUnlocked = (lesson: Lesson, index: number) => {
    if (index === 0) return true;
    const previousLesson = lessons[index - 1];
    return getLessonProgress(previousLesson.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Course Progress
      </h3>
      
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isCompleted = getLessonProgress(lesson.id);
          const isUnlocked = isLessonUnlocked(lesson, index);
          const isCurrent = lesson.id === currentLessonId;

          return (
            <div
              key={lesson.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isUnlocked && onLessonSelect(lesson.id)}
            >
              <div className="flex-shrink-0">
                {!isUnlocked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCurrent 
                    ? 'text-purple-900 dark:text-purple-200' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lesson.estimatedTime}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;