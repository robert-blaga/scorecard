import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SingleChoice from '../components/survey-items/SingleChoice';
import { getScorecard } from '../utils/scorecardUtils';

// Storage keys
const SURVEY_ANSWERS_KEY = 'survey_answers';
const SURVEY_CURRENT_QUESTION_KEY = 'survey_current_question';

export default function SurveyScreen() {
  const navigate = useNavigate();
  const { id: scorecardId } = useParams();
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem(`${scorecardId}_${SURVEY_CURRENT_QUESTION_KEY}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`${scorecardId}_${SURVEY_ANSWERS_KEY}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Save answers whenever they change
  useEffect(() => {
    if (scorecardId) {
      localStorage.setItem(`${scorecardId}_${SURVEY_ANSWERS_KEY}`, JSON.stringify(answers));
    }
  }, [answers, scorecardId]);

  // Save current question index
  useEffect(() => {
    if (scorecardId) {
      localStorage.setItem(`${scorecardId}_${SURVEY_CURRENT_QUESTION_KEY}`, currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex, scorecardId]);

  // Load scorecard data
  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const scorecardData = await getScorecard(scorecardId);
        if (scorecardData) {
          setScorecard(scorecardData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading scorecard:', error);
        setError('Failed to load scorecard');
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [scorecardId]);

  const handleSelect = (questionId, value) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: value
      };
      return newAnswers;
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < scorecard.questions.items.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      try {
        // Clear stored survey data
        localStorage.removeItem(`${scorecardId}_${SURVEY_ANSWERS_KEY}`);
        localStorage.removeItem(`${scorecardId}_${SURVEY_CURRENT_QUESTION_KEY}`);
        
        // Navigate to results screen with the answers
        navigate(`/scorecard/${scorecardId}`, { 
          replace: true,
          state: { 
            answers
          }
        });
      } catch (error) {
        console.error('Error in submission process:', error);
        setError('Failed to complete submission. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!scorecard || !scorecard.questions || !scorecard.questions.items) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Scorecard or questions not found</div>
      </div>
    );
  }

  const questions = scorecard.questions.items;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            {scorecard.scorecardInfo.title}
          </h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
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
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors
              ${answers[currentQuestion.id] !== undefined
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {currentQuestionIndex === questions.length - 1 ? (scorecard.questions.submitButtonText || 'Finalizează') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 