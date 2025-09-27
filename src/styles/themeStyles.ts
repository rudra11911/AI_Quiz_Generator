export const getThemeStyles = (isDarkMode: boolean) => ({
  backgroundGradient: isDarkMode 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  card: {
    background: isDarkMode 
      ? 'rgba(30, 41, 59, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode 
      ? '1px solid rgba(148, 163, 184, 0.1)' 
      : '1px solid rgba(255, 255, 255, 0.2)',
    color: isDarkMode ? '#f1f5f9' : '#334155'
  },
  glassCard: {
    background: isDarkMode 
      ? 'rgba(30, 41, 59, 0.3)' 
      : 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid rgba(255, 255, 255, 0.3)',
  },
  primaryText: isDarkMode ? '#f1f5f9' : '#1e293b',
  secondaryText: isDarkMode ? '#cbd5e1' : '#475569',
  mutedText: isDarkMode ? '#94a3b8' : '#64748b',
  primaryButton: {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none'
  },
  secondaryButton: {
    background: isDarkMode 
      ? 'rgba(51, 65, 85, 0.6)' 
      : 'rgba(255, 255, 255, 0.2)',
    color: isDarkMode ? '#f1f5f9' : '#ffffff',
    border: isDarkMode 
      ? '1px solid rgba(148, 163, 184, 0.3)' 
      : '1px solid rgba(255, 255, 255, 0.3)'
  },
  selectedOption: {
    background: isDarkMode 
      ? 'rgba(59, 130, 246, 0.2)' 
      : 'rgba(59, 130, 246, 0.1)',
    borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
    color: isDarkMode ? '#93c5fd' : '#1d4ed8'
  },
  unselectedOption: {
    background: isDarkMode 
      ? 'rgba(51, 65, 85, 0.3)' 
      : 'rgba(248, 250, 252, 0.8)',
    borderColor: isDarkMode ? '#475569' : '#cbd5e1',
    color: isDarkMode ? '#e2e8f0' : '#475569'
  },
  progressBar: {
    background: isDarkMode 
      ? 'rgba(51, 65, 85, 0.5)' 
      : 'rgba(255, 255, 255, 0.3)',
    fill: isDarkMode 
      ? 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)' 
      : '#ffffff'
  },
  iconColor: isDarkMode ? '#94a3b8' : '#64748b',
  accentColor: isDarkMode ? '#3b82f6' : '#667eea'
});
