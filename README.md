# QubiLearn - Qubic Smart Contract Learning Platform

A comprehensive, frontend-only educational platform for learning C++ smart contract development on the Qubic blockchain.

## Features

- **Interactive Courses**: Learn through structured lessons with progress tracking
- **AI Tutor**: Get personalized help with OpenAI GPT-4 integration
- **Code Editor**: Practice with Monaco Editor and C++ syntax highlighting
- **Quiz System**: Test your knowledge with interactive quizzes
- **Badge System**: Earn Soulbound Tokens (SBTs) for achievements
- **Progress Tracking**: Monitor your learning journey
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Simulated Blockchain**: Mock Qubic RPC interactions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### OpenAI Integration

To use the AI tutor:

1. Get an OpenAI API key from https://platform.openai.com/
2. Click the settings icon in the AI chat
3. Enter your API key (stored locally)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CourseCard.tsx
│   ├── CourseViewer.tsx
│   ├── Quiz.tsx
│   ├── CodeEditor.tsx
│   ├── AIChat.tsx
│   ├── BadgeModal.tsx
│   └── ProgressTracker.tsx
├── pages/              # Route components
│   ├── Home.tsx
│   ├── CoursesPage.tsx
│   ├── CoursePage.tsx
│   └── Profile.tsx
├── data/               # Static data files
│   ├── courses.json
│   ├── quizzes.json
│   └── templates.json
├── utils/              # Utility functions
│   ├── openai.ts
│   ├── qubicRpcSimulator.ts
│   └── localStorage.ts
├── contexts/           # React contexts
│   └── ThemeContext.tsx
└── types/              # TypeScript definitions
    └── index.ts
```

## Adding New Content

### Adding a New Course

1. Edit `src/data/courses.json`:
   ```json
   {
     "id": "new-course",
     "title": "New Course Title",
     "description": "Course description",
     "difficulty": "Beginner",
     "estimatedTime": "2 hours",
     "prerequisites": [],
     "lessons": [
       {
         "id": "lesson-1",
         "title": "Lesson Title",
         "content": "# Lesson Content\n\nMarkdown content here...",
         "codeExample": "// C++ code example",
         "estimatedTime": "15 min",
         "hasQuiz": true
       }
     ]
   }
   ```

2. Add corresponding quizzes to `src/data/quizzes.json`

### Adding a New Quiz

1. Edit `src/data/quizzes.json`:
   ```json
   {
     "id": "quiz-id",
     "courseId": "course-id",
     "lessonId": "lesson-id",
     "title": "Quiz Title",
     "questions": [
       {
         "id": "q1",
         "question": "Question text?",
         "choices": ["Option A", "Option B", "Option C", "Option D"],
         "correctAnswer": 0,
         "explanation": "Explanation of the correct answer"
       }
     ]
   }
   ```

### Adding Code Templates

1. Edit `src/data/templates.json`:
   ```json
   {
     "id": "template-id",
     "name": "Template Name",
     "description": "Template description",
     "language": "cpp",
     "code": "// C++ template code"
   }
   ```

## Customization

### Modifying AI Tutor Behavior

Edit the system prompt in `src/utils/openai.ts`:

```typescript
getSystemPrompt(): string {
  return `Your custom system prompt here...`;
}
```

### Adding New Badge Types

Edit badge logic in course completion handlers and add new badge types to the `Badge` interface.

### Styling

The project uses Tailwind CSS with a custom theme defined in `tailwind.config.js`. Modify colors, fonts, and animations there.

## Deployment

Build the project:
```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Netlify, Vercel, etc.).

## Future Enhancements

- Real Qubic blockchain integration
- Wallet connection
- User authentication
- Backend API integration
- More course content
- Video lessons
- Community features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.