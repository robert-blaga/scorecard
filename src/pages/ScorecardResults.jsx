import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getScorecard } from '../utils/scorecardUtils';

export default function ScorecardResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: scorecardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [sessionId] = useState(() => {
    return location.state?.sessionId || localStorage.getItem(`${scorecardId}_survey_session_id`);
  });

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);

        // Load scorecard data
        const scorecardData = await getScorecard(scorecardId);
        if (!scorecardData) {
          setError('Scorecard not found');
          return;
        }
        setScorecard(scorecardData);

        // If we have answers in location state, use those
        if (location.state?.answers) {
          setAnswers(location.state.answers);
          return;
        }

        // Otherwise, fetch answers from Supabase using session ID
        if (!sessionId) {
          setError('Survey session not found');
          return;
        }

        const { data: surveyAnswers, error: answersError } = await supabase
          .from('survey_answers')
          .select('*')
          .eq('session_id', sessionId)
          .eq('scorecard_id', scorecardId);

        if (answersError) {
          console.error('Error fetching answers:', answersError);
          setError('Failed to load survey results');
          return;
        }

        // Transform answers array to object format
        const answersObject = surveyAnswers.reduce((acc, curr) => {
          acc[curr.question_id] = curr.answer_value;
          return acc;
        }, {});

        setAnswers(answersObject);
      } catch (error) {
        console.error('Error loading results:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [scorecardId, sessionId, location.state]);

  const handleRegister = () => {
    // Navigate to registration with session ID
    navigate('/register', { 
      state: { 
        returnPath: `/scorecard/${scorecardId}`,
        sessionId,
        scorecardId
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!scorecard || !answers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No results found</div>
      </div>
    );
  }

  // Calculate basic results (this is a placeholder - implement your scoring logic)
  const calculateResults = () => {
    // Your scoring logic here
    return {
      score: 75,
      maxScore: 100,
      summary: 'Basic results summary'
    };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-4">
            Your Results
          </h1>
          
          <div className="mb-8">
            <div className="text-5xl font-bold text-deep-purple mb-2">
              {results.score}/{results.maxScore}
            </div>
            <p className="text-gray-600">{results.summary}</p>
          </div>

          {/* Basic results visualization */}
          <div className="space-y-4 mb-8">
            {/* Add your results visualization components here */}
          </div>

          {/* Call-to-action for extended results */}
          <div className="bg-deep-purple/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-deep-purple mb-2">
              Get Your Extended Report
            </h2>
            <p className="text-gray-600 mb-4">
              Register to receive a detailed analysis of your results, personalized recommendations, 
              and access to additional resources.
            </p>
            <button
              onClick={handleRegister}
              className="bg-deep-purple text-white px-6 py-2.5 rounded-lg font-medium hover:bg-deep-purple-600 transition-colors"
            >
              Register Now
            </button>
          </div>

          {/* Answer summary */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Answers
            </h2>
            <div className="space-y-4">
              {scorecard.questions.items.map((question, index) => (
                <div key={question.id} className="flex gap-4">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-deep-purple/10 flex items-center justify-center">
                    <span className="text-deep-purple font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">{question.text}</p>
                    <p className="text-gray-600">Your answer: {answers[question.id]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 