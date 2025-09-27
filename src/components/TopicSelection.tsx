import { useContext, useState } from 'react';
import { Heart, TrendingUp, Brain, Wallet, Briefcase, Leaf, Megaphone, Activity, Shield, Users } from 'lucide-react';
import { QuizContext } from '../context/QuizContext';
import { ThemeContext } from '../context/ThemeContext';
import { getThemeStyles } from '../styles/themeStyles';
import ThemeToggle from './ThemeToggle';
import { AIService } from '../services/AIService';


const topicDescriptions: Record<string, string> = {
  Wellness: 'Health, nutrition, and lifestyle',
  'Tech Trends': 'Latest in technology and innovation',
  'Personal Finance': 'Budgeting, saving, investing, and managing debt wisely',
  Entrepreneurship: 'Principles of starting, operating, and scaling your own business',
  'Sustainable Living': 'Eco-friendly habits to reduce your carbon footprint',
  'Digital Marketing': 'Promoting products and services using online platforms',
  'Health & Fitness': 'Exercise, nutrition, mental wellness, and healthy habits',
  'Cybersecurity Awareness': 'Protecting personal and organizational data online',
  'Leadership & Teamwork': 'Developing skills to lead and collaborate effectively'
};


const TopicSelection = () => {
  const { state, setState } = useContext(QuizContext);
  const { isDarkMode } = useContext(ThemeContext);
  const themeStyles = getThemeStyles(isDarkMode);

  const [listLayout, setListLayout] = useState<'default' | 'grid'>('default');

  const topics = [
    { name: 'Wellness', icon: Heart, color: isDarkMode ? '#ef4444' : '#10b981', description: topicDescriptions['Wellness'] },
    { name: 'Tech Trends', icon: TrendingUp, color: isDarkMode ? '#3b82f6' : '#6366f1', description: topicDescriptions['Tech Trends'] },
    { name: 'Personal Finance', icon: Wallet, color: isDarkMode ? '#f59e0b' : '#fbbf24', description: topicDescriptions['Personal Finance'] },
    { name: 'Entrepreneurship', icon: Briefcase, color: isDarkMode ? '#8b5cf6' : '#a78bfa', description: topicDescriptions['Entrepreneurship'] },
    { name: 'Sustainable Living', icon: Leaf, color: isDarkMode ? '#22c55e' : '#16a34a', description: topicDescriptions['Sustainable Living'] },
    { name: 'Digital Marketing', icon: Megaphone, color: isDarkMode ? '#ec4899' : '#f472b6', description: topicDescriptions['Digital Marketing'] },
    { name: 'Health & Fitness', icon: Activity, color: isDarkMode ? '#06b6d4' : '#0ea5e9', description: topicDescriptions['Health & Fitness'] },
    { name: 'Cybersecurity Awareness', icon: Shield, color: isDarkMode ? '#64748b' : '#94a3b8', description: topicDescriptions['Cybersecurity Awareness'] },
    { name: 'Leadership & Teamwork', icon: Users, color: isDarkMode ? '#f97316' : '#fb923c', description: topicDescriptions['Leadership & Teamwork'] },
  ];

  const isLoading = state.currentScreen === 'loading';

  const handleTopicSelect = async (topicName: string) => {
    setState(prev => ({
      ...prev,
      selectedTopic: topicName,
       currentScreen: 'loading',
       loadingType: 'questions',
    }));

    try {
      const topic = topics.find(t => t.name === topicName);
      if (!topic) throw new Error('Topic not found');

      const questions = await AIService.generateQuestions(topic.name);

      setState(prev => ({
        ...prev,
        questions,
        currentScreen: 'quiz',
        answers: new Array(questions.length).fill(-1),
        currentQuestionIndex: 0,
      }));
    } catch (error) {
      console.error('Failed to generate questions:', error);
      alert(`Failed to generate questions: ${(error as Error).message}`);
      setState(prev => ({
        ...prev,
        currentScreen: 'topic',
      }));
    }
  };

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
      <div style={{ maxWidth: '650px', width: '100%' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Brain style={{ width: 48, height: 48, color: themeStyles.primaryText }} />
            <h1
              style={{
                fontSize: '2.75rem',
                fontWeight: 'bold',
                color: themeStyles.primaryText,
                margin: 0,
              }}
            >
              AI Quiz
            </h1>
          </div>

          <button
            onClick={() =>
              setListLayout(listLayout === 'default' ? 'grid' : 'default')
            }
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: themeStyles.accentColor,
              color: '#fff',
              fontWeight: 700,
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              transition: 'background-color 0.3s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = themeStyles.accentColor + 'cc'; // slight lighten on hover
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = themeStyles.accentColor;
            }}
          >
            Toggle Layout ({listLayout === 'default' ? 'Grid' : 'List'})
          </button>
        </div>

        {/* Topics List */}
        <div
          style={{
            display: 'flex',
            flexDirection: listLayout === 'default' ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: listLayout === 'default' ? 'flex-start' : 'center',
          }}
        >
          {topics.map(topic => {
            const IconComponent = topic.icon;
            return (
              <button
                key={topic.name}
                onClick={() => handleTopicSelect(topic.name)}
                disabled={isLoading}
                style={{
                  width: listLayout === 'default' ? '100%' : 'calc(50% - 10px)',
                  ...themeStyles.glassCard,
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: isDarkMode
                    ? '0 4px 15px rgba(0,0,0,0.7)'
                    : '0 4px 8px rgba(0,0,0,0.1)',
                  userSelect: 'none',
                }}
                onMouseOver={e => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 8px 24px rgba(0,0,0,0.8)'
                      : '0 8px 16px rgba(0,0,0,0.15)';
                    e.currentTarget.style.background = isDarkMode
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.35)';
                  }
                }}
                onMouseOut={e => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 4px 15px rgba(0,0,0,0.7)'
                      : '0 4px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.background = themeStyles.glassCard.background;
                  }
                }}
              >
                <div
                  style={{
                    backgroundColor: topic.color,
                    padding: '14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent style={{ width: 28, height: 28, color: '#fff' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: themeStyles.primaryText,
                      margin: '0 0 6px 0',
                    }}
                  >
                    {topic.name}
                  </h3>
                  <p
                    style={{
                      color: themeStyles.secondaryText,
                      fontSize: '1rem',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {topic.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
