import { useContext } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider, QuizContext } from './context/QuizContext';
import TopicSelection from './components/TopicSelection';
import LoadingScreen from './components/LoadingScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';

const AppContent = () => {
  const { state } = useContext(QuizContext);

  switch (state.currentScreen) {
    case 'topic':
      return <TopicSelection />;
    case 'loading':
      // Pass loadingType based on an indicator, e.g. add it in your state
      const loadingType = state.loadingType || 'questions'; // fallback to questions
      return <LoadingScreen loadingType={loadingType} />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <TopicSelection />;
  }
};


const App = () => (
  <ThemeProvider>
    <QuizProvider>
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <AppContent />
      </div>
    </QuizProvider>
  </ThemeProvider>
);

export default App;
