import React, { useState, useEffect } from 'react';
import { User, Award, BookOpen, Brain, Calendar, Trophy, Download, Share2 } from 'lucide-react';
import { User as UserType, Badge } from '../types';
import { getUser, getBadges, getQuizResult } from '../utils/localStorage';
import coursesData from '../data/courses.json';
import quizzesData from '../data/quizzes.json';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'progress'>('overview');

  useEffect(() => {
    setUser(getUser());
    setBadges(getBadges());
  }, []);

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'quiz': return '🧠';
      case 'streak': return '🔥';
      case 'achievement': return '🏆';
      default: return '⭐';
    }
  };

  const getQuizStats = () => {
    const allQuizzes = quizzesData;
    const results = allQuizzes.map(quiz => ({
      quiz,
      result: getQuizResult(quiz.id)
    }));
    
    const attempted = results.filter(r => r.result !== null).length;
    const passed = results.filter(r => r.result?.passed).length;
    const averageScore = results.reduce((sum, r) => sum + (r.result?.score || 0), 0) / attempted || 0;
    
    return { attempted, passed, averageScore: Math.round(averageScore) };
  };

  const getCourseProgress = () => {
    const totalCourses = coursesData.length;
    const completedCourses = coursesData.filter(course => 
      course.lessons.every(lesson => 
        JSON.parse(localStorage.getItem('qubilearn_progress') || '{}')[lesson.id]
      )
    ).length;
    
    return { totalCourses, completedCourses };
  };

  const exportProfile = () => {
    const profileData = {
      user,
      badges,
      quizStats: getQuizStats(),
      courseProgress: getCourseProgress(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qubilearn-profile-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const quizStats = getQuizStats();
  const courseProgress = getCourseProgress();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-lg opacity-90">
                  Qubic Developer • Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">{badges.length} badges</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{user.totalScore} points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportProfile}
                className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {courseProgress.completedCourses}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Courses Completed
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {courseProgress.totalCourses} total courses
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizStats.passed}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Quizzes Passed
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {quizStats.attempted} attempted
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {badges.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Badges Earned
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              SBT tokens minted
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {quizStats.averageScore}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Average Score
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Quiz performance
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: User },
                { key: 'badges', label: 'Badges', icon: Award },
                { key: 'progress', label: 'Progress', icon: BookOpen }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Learning Journey
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Recent Activity
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined QubiLearn</span>
                          <span className="text-xs">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Lessons viewed: {user.lessonsViewed}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4" />
                          <span>Quizzes passed: {user.quizzesPassed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Next Goals
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>Complete first course</div>
                        <div>Earn 10 badges</div>
                        <div>Build your first smart contract</div>
                        <div>Pass all quizzes with 80%+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Earned Badges ({badges.length})
                </h3>
                {badges.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No badges yet
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete lessons and pass quizzes to earn your first badge!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{getBadgeIcon(badge.type)}</div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {badge.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {badge.description}
                          </p>
                          <div className="text-xs text-purple-600 dark:text-purple-400">
                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Course Progress
                </h3>
                <div className="space-y-4">
                  {coursesData.map((course) => {
                    const completedLessons = course.lessons.filter(lesson => 
                      JSON.parse(localStorage.getItem('qubilearn_progress') || '{}')[lesson.id]
                    ).length;
                    const progress = Math.round((completedLessons / course.lessons.length) * 100);
                    
                    return (
                      <div
                        key={course.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </h4>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {completedLessons}/{course.lessons.length} lessons
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {progress}% complete
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;