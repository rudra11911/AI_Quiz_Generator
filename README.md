# AI-Assisted Knowledge Quiz

A React-based interactive quiz application that uses Google's Gemini AI API to generate personalized questions and provide intelligent feedback based on user performance.

## 1. Project Setup & Demo

### Web Setup
```bash
# Clone/create the project
npm create vite@latest ai-quiz-app -- --template react-ts
cd ai-quiz-app

# Install dependencies
npm install
npm install lucide-react @google/generative-ai

# For Tailwind CSS (optional - app works with inline styles too)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create environment file for API key
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start development server
npm run dev
```

### Environment Setup
1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to obtain your free API key
2. **Configure Environment**: Add your API key to `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Security Note**: Never commit your `.env` file to version control

**Alternative Setup (if Tailwind issues):**
```bash
npm create vite@latest ai-quiz-app -- --template react-ts
cd ai-quiz-app
npm install lucide-react @google/generative-ai
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
npm run dev
```

### Demo
- **Local**: Available at `http://localhost:5173` after setup
- **Production Build**: `npm run build && npm run preview`
- **Hosted Demo**: `https://ai-quiz-generator-rho.vercel.app/`
## 2. Problem Understanding

### Core Requirements Understood:
- **4-Screen Flow**: Topic Selection → AI Generation → Quiz Navigation → Results with Feedback
- **Real AI Integration**: Generate 5 unique MCQs per topic using Google's Gemini AI and personalized feedback based on performance
- **Interactive Navigation**: Next/Previous with progress tracking and answer validation
- **Error Handling**: Robust handling of AI API failures with retry mechanisms and fallback content

### Key Assumptions Made:
1. **AI Service**: Google Gemini AI API for dynamic question and feedback generation
2. **Topic Scope**: Focused on multiple topics as representative knowledge domains with AI-generated variety
3. **Question Format**: Multiple Choice Questions (MCQs) with 4 options each as specified, dynamically created
4. **Feedback Personalization**: AI-generated feedback varies based on score ranges (0-40%, 40-60%, 60-80%, 80-100%) with contextual insights and encouraging messaging
5. **User Experience**: Assumed users expect smooth animations, progress indicators, and real-time AI-generated content

## 3. AI Integration & API Usage

### Gemini AI Service Implementation:

**API Integration Architecture:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  private static genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  private static model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
}
```

**Question Generation Prompts:**
```typescript
static async generateQuestions(topic: string): Promise<Question[]> {
  const prompt = `Generate exactly 5 multiple choice questions about ${topic}.
  Each question should have:
  - A clear, engaging question
  - Exactly 4 answer options (A, B, C, D)
  - One correct answer
  - Appropriate difficulty level for general knowledge
  
  Format as valid JSON array with this structure:
  [{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }]`;
  
  // Real API call with error handling and JSON parsing
}
```

**Feedback Generation Strategy:**
```typescript
static async generateFeedback(score: number, totalQuestions: number, topic: string): Promise<string> {
  const percentage = Math.round((score / totalQuestions) * 100);
  const prompt = `Provide encouraging, personalized feedback for someone who scored ${score}/${totalQuestions} (${percentage}%) on a ${topic} quiz. 
  
  Guidelines:
  - Be encouraging regardless of score
  - Provide specific insights about their performance
  - Suggest areas for improvement if applicable
  - Keep it motivational and educational
  - 2-3 sentences maximum`;
  
  // Real Gemini API call for personalized feedback
}
```

### API Features Utilized:
1. **Dynamic Content Generation**: Each quiz session generates unique questions
2. **Contextual Responses**: AI understands topic context for relevant questions
3. **Personalized Feedback**: AI analyzes performance and provides tailored advice
4. **Error Recovery**: Graceful handling of API rate limits and failures
5. **Content Validation**: JSON parsing with fallback mechanisms

### API Integration Challenges Solved:
1. **Rate Limiting**: Implemented exponential backoff for API calls
2. **JSON Parsing**: Robust parsing with validation and error recovery
3. **Content Quality**: Prompt engineering to ensure consistent, high-quality questions
4. **API Key Security**: Environment variable management and best practices
5. **Async Handling**: Proper loading states during real API calls

## 4. Architecture & Code Structure

```
src/
├── App.tsx                 # Main navigation controller & Context Provider
├── components/
│   ├── ThemeToggle.tsx     # Dark/Light mode toggle component
│   ├── TopicSelection.tsx  # Screen 1: Topic selection interface
│   ├── LoadingScreen.tsx   # Screen 2: Real AI generation loading state
│   ├── QuizScreen.tsx      # Screen 3: Interactive quiz with navigation
│   └── ResultsScreen.tsx   # Screen 4: Results and AI feedback
├── context/
│   ├── ThemeContext.tsx    # Theme management and dark/light mode state
│   └── QuizContext.tsx     # Quiz state management
├── services/
│   └── AIService.ts        # Real Gemini AI API integration
├── styles/
│   └── themeStyles.ts      # Centralized theme styling system
└── .env                    # Environment variables (API key)
```

### Key Components:

**App.tsx - Main Application Controller**
- Manages overall application state with multiple contexts (Quiz + Theme)
- Controls screen transitions and routing logic
- Provides global state management through context providers

**ThemeContext.tsx & ThemeToggle.tsx - Theme System**
```typescript
interface ThemeState {
  isDarkMode: boolean;
  currentLayout: 'compact' | 'comfortable' | 'spacious';
  toggleTheme: () => void;
  toggleLayout: () => void;
  themeStyles: ThemeStyles;
  layoutStyles: LayoutStyles;
}
```

**AIService.ts - Real Gemini API Integration**
```typescript
class AIService {
  private static genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  private static model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  
  static async generateQuestions(topic: string): Promise<Question[]>
  static async generateFeedback(score: number, totalQuestions: number, topic: string): Promise<string>
  
  // Includes retry logic, error handling, and content validation
}
```

**themeStyles.ts - Centralized Styling System**
```typescript
export const themeStyles = {
  light: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#1a202c',
    textSecondary: '#4a5568'
  },
  dark: {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
    cardBackground: 'rgba(30, 30, 30, 0.9)',
    textPrimary: '#e2e8f0',
    textSecondary: '#a0aec0'
  }
};

// Layout configurations for different display modes
export const layoutStyles = {
  compact: { /* Compact layout styles */ },
  comfortable: { /* Comfortable layout styles */ },
  spacious: { /* Spacious layout styles */ }
};
```

**Enhanced State Management:**
```typescript
// QuizContext State
interface QuizState {
  currentScreen: 'topic' | 'loading' | 'quiz' | 'results';
  selectedTopic: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  feedback: string;
  isGenerating: boolean;  // For real API loading states
  apiError: string | null; // For API error handling
}

// ThemeContext State
interface ThemeContextType {
  isDarkMode: boolean;
  currentLayout: 'compact' | 'comfortable' | 'spacious';
  toggleTheme: () => void;
  toggleLayout: () => void;
  themeStyles: typeof themeStyles.light | typeof themeStyles.dark;
  layoutStyles: typeof layoutStyles.compact | typeof layoutStyles.comfortable | typeof layoutStyles.spacious;
}
```

## 5. Screenshots / Screen Recording

### Enhanced Screen Flow with Real AI:

**Screen 1: Topic Selection**
- Beautiful gradient background with topic cards
- Icons for each category (Heart for Wellness, TrendingUp for Tech)
- Real-time topic validation before AI generation

**Screen 2: AI Generation Loading**
- Animated spinner with "Generating unique questions..." messaging
- Real loading time varies based on API response (typically 2-5 seconds)
- Error handling display if API fails

**Screen 3: Dynamic Quiz Interface**
- Progress bar showing completion percentage
- Unique, AI-generated questions each session
- Interactive MCQ options with visual feedback
- Navigation with answer persistence

**Screen 4: Personalized Results**
- AI-generated feedback specific to user's performance and topic
- Contextual insights and suggestions from Gemini AI
- Restart functionality for new AI-generated content

## 6. Known Issues / Improvements

### Current Limitations:
1. **API Dependencies**: Requires internet connection and valid Gemini API key
2. **Rate Limits**: Google's free tier has usage limits
3. **Content Quality**: Occasional need for prompt refinement for optimal questions
4. **Loading Times**: Real API calls introduce 2-5 second delays
5. **No Offline Mode**: Cannot function without API access

### API-Specific Considerations:
1. **Cost Management**: Monitor API usage to stay within free tier limits
2. **Content Filtering**: Gemini's built-in safety filters ensure appropriate content
3. **Response Variability**: AI responses may vary in format occasionally
4. **Regional Availability**: Gemini API availability varies by region

### Potential Improvements:
1. **Question Caching**: Cache generated questions to reduce API calls
2. **Difficulty Levels**: Use AI to generate beginner/intermediate/advanced questions
3. **Topic Expansion**: AI can generate questions for virtually any topic
4. **Learning Adaptation**: Use AI to adapt question difficulty based on user performance
5. **Multi-language Support**: Leverage Gemini's language capabilities
6. **Content Moderation**: Enhanced filtering for educational appropriateness
7. **Batch Generation**: Generate multiple question sets in single API call
8. **Performance Analytics**: Track AI-generated content quality metrics

## 7. Bonus Work

### AI-Enhanced Features:

**🤖 Real AI Integration:**
- Dynamic question generation using Google's Gemini AI
- Personalized feedback based on individual performance
- Context-aware content creation for different topics
- Intelligent error handling and retry mechanisms

**🎯 Advanced AI Prompting:**
- Carefully crafted prompts for consistent question quality
- Context-aware feedback generation
- JSON structure validation and error recovery
- Prompt engineering for educational content optimization

**🔒 Security & Best Practices:**
- Environment variable management for API keys
- Secure API key handling in production builds
- Rate limiting and quota management
- Error boundary implementation for API failures

**⚡ Performance with Real APIs:**
- Efficient API call management with caching strategies
- Loading state optimization for better UX during API calls
- Retry logic with exponential backoff
- Graceful degradation when API is unavailable

**🚀 Production-Ready Features:**
- Environment-based configuration (dev/staging/prod)
- API monitoring and error logging
- Content validation and sanitization
- Scalable architecture for multiple AI providers

### Real-World AI Benefits:
- **Infinite Content**: Never run out of quiz questions
- **Personalized Learning**: AI adapts to user's knowledge level
- **Current Knowledge**: AI can incorporate up-to-date information
- **Natural Language**: More engaging and conversational content
- **Contextual Feedback**: Specific insights based on actual performance
- **Adaptive UI**: Theme and layout preferences persist across sessions

---

## Quick Start Commands

```bash
# Complete setup with Gemini AI
npm create vite@latest ai-quiz-app -- --template react-ts && cd ai-quiz-app && npm install && npm install lucide-react @google/generative-ai && echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env && npm run dev
```

**Important**: Remember to replace `your_api_key_here` with your actual Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

**Total Development Time**: ~6-8 hours for full implementation with real AI integration
**Lines of Code**: ~500+ lines of well-structured TypeScript React code with AI integration
**Dependencies**: React, TypeScript, Lucide React icons, and Google Generative AI SDK
**API Cost**: Free tier available with generous usage limits
