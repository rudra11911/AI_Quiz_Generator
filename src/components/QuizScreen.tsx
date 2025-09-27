import { useContext, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuizContext } from '../context/QuizContext';
import { ThemeContext } from '../context/ThemeContext';
import { getThemeStyles } from '../styles/themeStyles';
import { AIService } from '../services/AIService';
import ThemeToggle from './ThemeToggle';

const QuizScreen = () => {
  const { state, setState } = useContext(QuizContext);
  const { isDarkMode } = useContext(ThemeContext);
  const themeStyles = getThemeStyles(isDarkMode);
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  // Local state for card layout toggle: 'default' or 'split'
  const [cardLayout, setCardLayout] = useState<'default' | 'split'>('default');

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestionIndex] = answerIndex;
    setState(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleFinish = async () => {
    const score = state.answers.reduce((total, answer, index) => {
      return total + (answer === state.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    setState(prev => ({ ...prev, currentScreen: 'loading', loadingType: 'results', score }));

    try {
      const feedback = await AIService.generateFeedback(score, state.questions.length, state.selectedTopic);
      setState(prev => ({ ...prev, feedback, currentScreen: 'results' }));
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      setState(prev => ({
        ...prev,
        feedback: `You scored ${score}/${state.questions.length}! Great job on completing the quiz.`,
        currentScreen: 'results'
      }));
    }
  };

  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const hasAnswered = state.answers[state.currentQuestionIndex] !== -1;

  // Card layout toggle button
  const handleToggleLayout = () => {
    setCardLayout(prev => (prev === 'default' ? 'split' : 'default'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.backgroundGradient,
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <ThemeToggle />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleToggleLayout}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: themeStyles.accentColor,
              color: '#fff',
              fontWeight: '600'
            }}>
            Toggle Layout ({cardLayout === 'default' ? 'Split' : 'Default'})
          </button>

          <h2 style={{
            flexGrow: 1,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: themeStyles.primaryText,
            margin: '0 12px'
          }}>
            {state.selectedTopic} Quiz
          </h2>

          <span style={{
            fontSize: '0.9rem',
            background: themeStyles.glassCard.background,
            padding: '4px 12px',
            borderRadius: '20px',
            color: themeStyles.primaryText,
            backdropFilter: 'blur(10px)'
          }}>
            {state.currentQuestionIndex + 1} of {state.questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: themeStyles.progressBar.background,
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div 
            style={{
              height: '100%',
              background: themeStyles.progressBar.fill,
              borderRadius: '4px',
              transition: 'width 0.3s ease',
              width: `${progress}%`
            }}
          />
        </div>

        {/* Question Card */}
        {cardLayout === 'default' ? (
          <div style={{
            ...themeStyles.card,
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '36px',
            maxWidth: '700px',
            margin: 'auto',
            boxShadow: '0 30px 40px -10px rgba(0, 0, 0, 0.15)',
            backgroundColor: themeStyles.card.background,
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: themeStyles.card.color,
              marginBottom: '24px',
              lineHeight: '1.4'
            }}>
              {currentQuestion.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = state.answers[state.currentQuestionIndex] === index;
                const optionStyles = isSelected ? themeStyles.selectedOption : themeStyles.unselectedOption;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      textAlign: 'left',
                      borderRadius: '8px',
                      border: `2px solid ${optionStyles.borderColor}`,
                      background: optionStyles.background,
                      color: optionStyles.color,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = themeStyles.accentColor;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = optionStyles.borderColor;
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? themeStyles.accentColor : optionStyles.borderColor}`,
                        background: isSelected ? themeStyles.accentColor : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#ffffff'
                          }} />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{
            ...themeStyles.card,
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '28px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '24px',
            maxWidth: '900px',
            margin: 'auto',
            boxShadow: '0 25px 35px -12px rgba(0, 0, 0, 0.2)',
            backgroundColor: themeStyles.card.background,
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: themeStyles.card.color }}>
              {currentQuestion.question}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = state.answers[state.currentQuestionIndex] === index;
                const optionStyles = isSelected ? themeStyles.selectedOption : themeStyles.unselectedOption;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      textAlign: 'left',
                      borderRadius: '8px',
                      border: `2px solid ${optionStyles.borderColor}`,
                      background: optionStyles.background,
                      color: optionStyles.color,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = themeStyles.accentColor;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = optionStyles.borderColor;
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? themeStyles.accentColor : optionStyles.borderColor}`,
                        background: isSelected ? themeStyles.accentColor : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#ffffff'
                          }} />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={state.currentQuestionIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              ...themeStyles.secondaryButton,
              borderRadius: '8px',
              cursor: state.currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: state.currentQuestionIndex === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Previous</span>
          </button>

          <button
            onClick={isLastQuestion ? handleFinish : handleNext}
            disabled={!hasAnswered}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              ...themeStyles.primaryButton,
              borderRadius: '8px',
              cursor: !hasAnswered ? 'not-allowed' : 'pointer',
              opacity: !hasAnswered ? 0.5 : 1,
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            <span>{isLastQuestion ? 'Finish Quiz' : 'Next'}</span>
            {!isLastQuestion && <ArrowRight style={{ width: '16px', height: '16px' }} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
