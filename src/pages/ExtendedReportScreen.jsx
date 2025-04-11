import React from 'react';
import ExtendedReport from '../components/ExtendedReport';
import { useParams, Link } from 'react-router-dom';
import useScorecard from '../hooks/useScorecard';

const ExtendedReportScreen = () => {
  const { scorecardId } = useParams();
  const { loading, error, scorecard, results, report } = useScorecard(scorecardId);

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

  // No results available
  if (!results || !report) {
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

  // Show extended report
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ExtendedReport scorecardId={scorecardId} />
        </div>
      </div>
    </div>
  );
};

export default ExtendedReportScreen; 