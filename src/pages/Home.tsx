import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap, Code, Brain, Trophy, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Courses",
      description: "Learn Qubic smart contracts through hands-on lessons and practical examples"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Live Code Editor",
      description: "Practice C++ smart contract development with our integrated Monaco editor"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Tutor",
      description: "Get personalized help from our AI assistant powered by OpenAI GPT-4"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Earn Badges",
      description: "Collect Soulbound Tokens (SBTs) as you complete courses and pass quizzes"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Join thousands of developers learning the future of blockchain technology"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Qubic Network",
      description: "Master the quantum-resistant blockchain with AI-powered smart contracts"
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Blockchain Developer",
      content: "QubiLearn made learning Qubic development incredibly approachable. The AI tutor helped me understand complex concepts in minutes.",
      avatar: "AC"
    },
    {
      name: "Sarah Johnson",
      role: "Smart Contract Engineer",
      content: "The hands-on approach and real-time code editor are game-changers. I built my first Qubic smart contract in just a few hours.",
      avatar: "SJ"
    },
    {
      name: "Michael Rodriguez",
      role: "Blockchain Architect",
      content: "The gamification with SBT badges kept me motivated throughout the learning journey. Highly recommended!",
      avatar: "MR"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master <span className="text-yellow-400">Qubic</span>
              <br />
              Smart Contracts
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Learn C++ smart contract development on the quantum-resistant Qubic blockchain 
              with interactive courses, AI tutoring, and hands-on practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Learning</span>
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose QubiLearn?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The most comprehensive platform for learning Qubic blockchain development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-lg opacity-90">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg opacity-90">Code Examples</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands of developers who've mastered Qubic development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join the next generation of blockchain developers and start your Qubic journey today.
          </p>
          <Link
            to="/courses"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
          >
            <Award className="w-5 h-5" />
            <span>Start Learning Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;