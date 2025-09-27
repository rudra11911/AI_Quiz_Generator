import { useContext } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizContext } from '../context/QuizContext';
import { ThemeContext } from '../context/ThemeContext';
import { getThemeStyles } from '../styles/themeStyles';
import ThemeToggle from './ThemeToggle';

const ResultsScreen = () => {
  const { state, setState } = useContext(QuizContext);
  const { isDarkMode } = useContext(ThemeContext);
  const themeStyles = getThemeStyles(isDarkMode);
  const percentage = (state.score / state.questions.length) * 100;

  const handleRestart = () => {
    setState({
      currentScreen: 'topic',
      selectedTopic: '',
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      feedback: ''
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.backgroundGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <ThemeToggle />
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{
          ...themeStyles.card,
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Score Display */}
          <div style={{ marginBottom: '32px' }}>
            {percentage >= 70 ? (
              <CheckCircle style={{
                width: '80px',
                height: '80px',
                color: isDarkMode ? '#22c55e' : '#10b981',
                margin: '0 auto 16px'
              }} />
            ) : (
              <XCircle style={{
                width: '80px',
                height: '80px',
                color: isDarkMode ? '#f97316' : '#f59e0b',
                margin: '0 auto 16px'
              }} />
            )}

            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: themeStyles.card.color,
              marginBottom: '8px'
            }}>
              Quiz Complete!
            </h2>
            <div style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: themeStyles.accentColor,
              marginBottom: '8px',
              lineHeight: '1'
            }}>
              {state.score}/{state.questions.length}
            </div>
            <p style={{
              fontSize: '1.5rem',
              color: themeStyles.secondaryText
            }}>
              {percentage.toFixed(0)}% Score
            </p>
          </div>

          {/* AI Feedback */}
          <div style={{
            background: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
            border: isDarkMode ? '1px solid rgba(51, 65, 85, 0.3)' : '1px solid rgba(226, 232, 240, 0.5)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: themeStyles.card.color,
              marginBottom: '12px'
            }}>
              🤖 AI Feedback
            </h3>
            <p style={{
              color: themeStyles.secondaryText,
              lineHeight: '1.6',
              fontSize: '1rem',
              margin: 0
            }}>
              {state.feedback}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRestart}
            style={{
              ...themeStyles.primaryButton,
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
            }}
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
