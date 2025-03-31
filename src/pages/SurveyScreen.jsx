import React, { useState, useEffect } from 'react';
import SingleChoice from '../components/survey-items/SingleChoice';
import { useNavigate } from 'react-router-dom';

// Storage keys
const SURVEY_ANSWERS_KEY = 'survey_answers';
const SURVEY_CURRENT_QUESTION_KEY = 'survey_current_question';

const QUESTIONS = [
  {
    id: 'q1',
    category: 'IDENTIFICAREA CU COMPANIA',
    text: 'Sunt mândru/ă să lucrez în OIG',
    number: 1,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q2',
    category: 'IDENTIFICAREA CU COMPANIA',
    text: 'Recomand prietenilor mei să facă cumpărături în magazinul în care lucrez sau în alte magazine din rețeaua OIG',
    number: 2,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q3',
    category: 'IDENTIFICAREA CU COMPANIA',
    text: 'Aș recomanda prietenilor sau familiei mele să lucreze în OIG',
    number: 3,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q4',
    category: 'IDENTIFICAREA CU COMPANIA',
    text: 'Asociez cariera mea viitoare cu OIG',
    number: 4,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q5',
    category: 'MEDIUL DE LUCRU',
    text: 'Mediul de lucru promovează colaborarea și comunicarea cu colegii mei de echipă?',
    number: 5,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q6',
    category: 'MEDIUL DE LUCRU',
    text: 'Mediul de lucru promovează colaborarea și comunicarea cu colegii din celelalte departamente?',
    number: 6,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q7',
    category: 'MEDIUL DE LUCRU',
    text: 'Am încredere în conducerea companiei',
    number: 7,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  },
  {
    id: 'q8',
    category: 'MEDIUL DE LUCRU',
    text: 'Conducerea companiei demonstrează grijă pentru angajați',
    number: 8,
    type: 'single_choice',
    options: [
      { text: 'Deloc', scores: {} },
      { text: 'În mică măsură', scores: {} },
      { text: 'Oarecum', scores: {} },
      { text: 'În mare măsură', scores: {} },
      { text: 'În totalitate', scores: {} }
    ]
  }
];

export default function SurveyScreen() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem(SURVEY_CURRENT_QUESTION_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(SURVEY_ANSWERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Save answers whenever they change
  useEffect(() => {
    localStorage.setItem(SURVEY_ANSWERS_KEY, JSON.stringify(answers));
  }, [answers]);

  // Save current question index whenever it changes
  useEffect(() => {
    localStorage.setItem(SURVEY_CURRENT_QUESTION_KEY, currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Handle survey completion
      console.log('Survey completed:', answers);
      // Clear stored survey data
      localStorage.removeItem(SURVEY_ANSWERS_KEY);
      localStorage.removeItem(SURVEY_CURRENT_QUESTION_KEY);
      navigate('/thank-you');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-deep-purple transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            {currentQuestion.category}
          </h1>
          <p className="text-gray-600">
            Întrebarea {currentQuestionIndex + 1} din {QUESTIONS.length}
          </p>
        </div>

        {/* Current question */}
        <div className="mb-8">
          <SingleChoice
            question={currentQuestion}
            selectedValue={answers[currentQuestion.id]}
            onSelect={(value) => handleSelect(currentQuestion.id, value)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors
              ${currentQuestionIndex > 0
                ? 'bg-white text-deep-purple border border-deep-purple hover:bg-deep-purple/5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
          >
            Înapoi
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors
              ${answers[currentQuestion.id] !== undefined
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finalizează' : 'Următorul'}
          </button>
        </div>
      </div>
    </div>
  );
} 