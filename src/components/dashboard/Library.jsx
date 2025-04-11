import React, { useMemo } from 'react';
import { Play, BarChart2, Users, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import scorecardsData from '../../data/index.json';

export default function Library() {
  // Group scorecards by category
  const categorizedScorecards = useMemo(() => {
    const visibleScorecards = scorecardsData.scorecards.filter(
      scorecard => scorecard.scorecardInfo.visibility
    );

    return visibleScorecards.reduce((acc, scorecard) => {
      const category = scorecard.scorecardInfo.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(scorecard);
      return acc;
    }, {});
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalScorecards = Object.values(categorizedScorecards).flat().length;
    const totalCategories = Object.keys(categorizedScorecards).length;
    const avgTimeToComplete = "15-20"; // This could be dynamic based on scorecard data

    return {
      total: totalScorecards,
      categories: totalCategories,
      timeToComplete: avgTimeToComplete
    };
  }, [categorizedScorecards]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Assessment Library</h1>
          <p className="mt-2 text-sm text-gray-600">
            Explore our comprehensive collection of assessment tools designed to evaluate and enhance various aspects of your organization
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Assessments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Time to Complete</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.timeToComplete} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecards by Category */}
      <div className="p-8 space-y-8">
        {Object.entries(categorizedScorecards).map(([category, scorecards]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              <span className="text-sm text-gray-500">{scorecards.length} assessments</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scorecards.map((scorecard) => (
                <div
                  key={scorecard.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {scorecard.scorecardInfo.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {scorecard.scorecardInfo.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Link
                      to={`/instructions/${scorecard.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Assessment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 