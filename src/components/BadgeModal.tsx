import React from 'react';
import { X, Award, Star } from 'lucide-react';
import { Badge } from '../types';

interface BadgeModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ badge, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'quiz': return '🧠';
      case 'streak': return '🔥';
      case 'achievement': return '🏆';
      default: return '⭐';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{getBadgeIcon(badge.type)}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-lg opacity-90">You've earned a new badge!</p>
          </div>
        </div>

        {/* Badge Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {badge.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
          </div>

          {/* Badge Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Badge Type
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {badge.type}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Earned
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(badge.earnedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* SBT Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              🔗 Soulbound Token (SBT)
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              This badge has been minted as a Soulbound Token on the Qubic blockchain, 
              permanently linked to your learning journey.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;