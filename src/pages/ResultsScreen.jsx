import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import useScorecard from '../hooks/useScorecard';
import ScorecardResults from '../components/ScorecardResults';
import { calculateScores, generateReport } from '../utils/scoringService';

/**
 * Page component for displaying scorecard results after survey completion
 */
const ScorecardPage = () => {
  const { scorecardId } = useParams();
  const location = useLocation();
  const surveyAnswers = location.state?.answers;
  const navigate = useNavigate();
  
  const {
    scorecard,
    loading,
    error,
    saveResults
  } = useScorecard(scorecardId);

  // Calculate results if we have survey answers
  const getResults = () => {
    if (!surveyAnswers || !scorecard) return null;
    
    // Convert answers from index-based to score-based using the scorecard configuration
    const scoredAnswers = {};
    Object.entries(surveyAnswers).forEach(([questionId, selectedIndex]) => {
      const question = scorecard.questions.items.find(q => q.id === questionId);
      if (question && question.options[selectedIndex]) {
        // Get the scores object directly from the selected option
        const selectedOption = question.options[selectedIndex];
        // Only include the scores, not the selected index
        scoredAnswers[questionId] = selectedOption.scores || {};
        
        // Debug logging
        console.log('Question:', questionId);
        console.log('Selected Index:', selectedIndex);
        console.log('Selected Option:', selectedOption);
        console.log('Scores:', selectedOption.scores);
      }
    });
    
    // Debug logging
    console.log('Final Scored Answers:', scoredAnswers);
    
    // Calculate scores using the scoring configuration from the scorecard
    const results = calculateScores(scoredAnswers, scorecard);
    if (!results || results.error) {
      console.error('Error calculating results:', results?.error);
      return null;
    }

    // Add the original answers to the results
    results.answers = surveyAnswers;

    // Generate detailed report using the scorecard's recommendations and thresholds
    const report = generateReport(results, scorecard);
    if (!report || report.error) {
      console.error('Error generating report:', report?.error);
      return null;
    }

    // Save the results to localStorage
    const savedResults = {
      scorecardId,
      timestamp: new Date().toISOString(),
      results,
      report
    };
    localStorage.setItem(`scorecard_result_${scorecardId}`, JSON.stringify(savedResults));
    
    return {
      results,
      report
    };
  };

  const calculatedResults = getResults();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Return Home
        </Link>
      </div>
    );
  }

  // No scorecard found
  if (!scorecard) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="text-gray-700 text-xl mb-4">Scorecard not found</div>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Return Home
        </Link>
      </div>
    );
  }

  // No survey answers - redirect to survey
  if (!surveyAnswers) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="text-gray-700 text-xl mb-4">Please complete the survey first</div>
        <Link 
          to={`/survey/${scorecardId}`} 
          className="text-indigo-600 hover:text-indigo-800"
        >
          Go to Survey
        </Link>
      </div>
    );
  }

  // No results calculated
  if (!calculatedResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">Error calculating results</div>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Return Home
        </Link>
      </div>
    );
  }

  const handleExtendedReport = () => {
    const surveyData = {
      scorecardId,
      answers: surveyAnswers,
      results: calculatedResults.results,
      report: calculatedResults.report
    };
    
    navigate('/identify', {
      state: surveyData,
      replace: true
    });
  };

  // Show results
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScorecardResults 
          results={calculatedResults.results} 
          report={calculatedResults.report} 
          scorecardId={scorecardId} 
        />
      </div>
    </div>
  );
};

export default ScorecardPage; 