import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import scorecardsData from '../data/index.json';

const ScorecardList = () => {
  // Filter scorecards to only show those with visibility true
  const visibleScorecards = scorecardsData.scorecards.filter(
    scorecard => scorecard.scorecardInfo.visibility
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {visibleScorecards.map((scorecard) => (
        <div
          key={scorecard.id}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 relative"
        >
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {scorecard.scorecardInfo.category}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {scorecard.scorecardInfo.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {scorecard.scorecardInfo.shortDescription}
          </p>
          <Link 
            to={`/instructions/${scorecard.id}`}
            className="absolute bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-colors duration-200 flex items-center justify-center"
            aria-label="Open instructions"
          >
            <Play size={20} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ScorecardList; 