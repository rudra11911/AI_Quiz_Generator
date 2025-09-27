import { useContext } from 'react';
import { Loader2 } from 'lucide-react';
import { QuizContext } from '../context/QuizContext';
import { ThemeContext } from '../context/ThemeContext';
import { getThemeStyles } from '../styles/themeStyles';
import ThemeToggle from './ThemeToggle';

type LoadingType = 'questions' | 'results';

interface LoadingScreenProps {
  loadingType?: LoadingType; // default to "questions"
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingType = 'questions' }) => {
  const { state } = useContext(QuizContext);
  const { isDarkMode } = useContext(ThemeContext);
  const themeStyles = getThemeStyles(isDarkMode);

  const loadingText =
    loadingType === 'questions'
      ? `AI is creating personalized questions for ${state.selectedTopic}...`
      : 'Calculating your results and personalized feedback...';

  const headerText =
    loadingType === 'questions' ? 'Generating Questions' : 'Loading Results';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: themeStyles.backgroundGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <ThemeToggle />
      <div style={{ textAlign: 'center' }}>
        <Loader2
          style={{
            width: '64px',
            height: '64px',
            color: themeStyles.primaryText,
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px',
          }}
        />
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: themeStyles.primaryText,
            marginBottom: '8px',
            textShadow: isDarkMode
              ? '0 2px 4px rgba(0,0,0,0.3)'
              : '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {headerText}
        </h2>
        <p
          style={{
            color: themeStyles.secondaryText,
            fontSize: '1.1rem',
          }}
        >
          {loadingText}
        </p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
