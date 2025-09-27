import React, { createContext, useState } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentScreen: 'topic' | 'loading' | 'quiz' | 'results';
  loadingType?: 'questions' | 'results';
  selectedTopic: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  feedback: string;
}

export const QuizContext = createContext<{
  state: QuizState;
  setState: React.Dispatch<React.SetStateAction<QuizState>>;
}>({
  state: {
    currentScreen: 'topic',
    selectedTopic: '',
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    feedback: '',
  },
  setState: () => {},
});

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<QuizState>({
    currentScreen: 'topic',
    selectedTopic: '',
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    feedback: '',
  });

  return <QuizContext.Provider value={{ state, setState }}>{children}</QuizContext.Provider>;
};
