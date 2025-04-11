import React from 'react';
import PropTypes from 'prop-types';
import { CalendarCheck, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * A component to display scorecard assessment results
 */
const ScorecardResults = ({ results, report, scorecardId, scorecard }) => {
  if (!results || !report) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-gray-400 text-center">No results to display</p>
      </div>
    );
  }

  // Get the primary score category based on scorecard type or raw scores
  const getPrimaryScoreCategory = () => {
    // Try to find a category in the interpretation results
    const interpretationKeys = Object.keys(results.interpretation || {});
    if (interpretationKeys.length > 0) {
      return interpretationKeys[0];
    }
    
    // Fallback to raw scores
    const rawScoreKeys = Object.keys(results.rawScores || {});
    return rawScoreKeys.length > 0 ? rawScoreKeys[0] : null;
  };

  const primaryCategory = getPrimaryScoreCategory();
  const primaryScore = primaryCategory ? results.interpretation[primaryCategory] : null;

  // Determine recommendation badge color
  const getRecommendationColor = () => {
    switch (report.overallRecommendation) {
      case 'very-high':
        return 'bg-purple-800 text-purple-100';
      case 'high':
        return 'bg-red-800 text-red-100';
      case 'medium':
        return 'bg-amber-800 text-amber-100';
      case 'low':
        return 'bg-green-800 text-green-100';
      case 'very-low':
        return 'bg-emerald-800 text-emerald-100';
      default:
        return 'bg-gray-800 text-gray-100';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get human-readable recommendation level
  const getRecommendationText = (level) => {
    const reportStructure = scorecard?.scoring?.report_structure;
    if (reportStructure?.thresholds?.recommendationLevel) {
      const levelConfig = reportStructure.thresholds.recommendationLevel.find(
        item => item.label === level
      );
      if (levelConfig?.displayText) {
        return levelConfig.displayText;
      }
    }

    // Fallback to default text if no configuration found (do not change this)
    switch (level) {
      case 'very-high':
        return 'High Priority';
      case 'high':
        return 'Medium Priority';
      case 'medium':
        return 'Moderate Priority';
      case 'low':
        return 'Low Priority';
      case 'very-low':
        return 'Very Low Priority';
      default:
        return 'No Priority Set';
    }
  };

  const getSectionTitle = (section) => {
    const reportStructure = scorecard?.scoring?.report_structure;
    if (reportStructure?.results_sections?.[section]?.title) {
      return reportStructure.results_sections[section].title;
    }

    // Fallback to default titles if no configuration found
    switch (section) {
      case 'specific_recommendations':
      case 'specificRecommendations':
        return 'Style-Specific Recommendations';
      case 'general_recommendations':
      case 'baseRecommendations':
        return 'General Recommendations';
      default:
        return section.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
    }
  };

  const getSectionIcon = (section) => {
    const reportStructure = scorecard?.scoring?.report_structure;
    if (reportStructure?.results_sections?.[section]?.icon) {
      return reportStructure.results_sections[section].icon;
    }

    // Fallback to default icons
    switch (section) {
      case 'specific_recommendations':
      case 'specificRecommendations':
        return 'Lightbulb';
      case 'general_recommendations':
      case 'baseRecommendations':
        return 'CalendarCheck';
      default:
        return 'Info';
    }
  };

  const getSectionStyle = (section) => {
    const reportStructure = scorecard?.scoring?.report_structure;
    if (reportStructure?.results_sections?.[section]?.style) {
      return reportStructure.results_sections[section].style;
    }

    // Fallback to default styles
    switch (section) {
      case 'specific_recommendations':
      case 'specificRecommendations':
        return {
          border: 'border-blue-500',
          hoverBg: 'hover:bg-blue-50',
          iconColor: 'text-blue-600'
        };
      case 'general_recommendations':
      case 'baseRecommendations':
        return {
          border: 'border-gray-200',
          hoverBg: 'hover:bg-gray-100',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          border: 'border-gray-200',
          hoverBg: 'hover:bg-gray-50',
          iconColor: 'text-gray-500'
        };
    }
  };

  // Helper function to render the appropriate icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5" />;
      default:
        return <CalendarCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-purple flex items-center justify-center">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-base text-charcoal font-medium leading-relaxed">Assessment Results</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Completed on {formatDate(report.timestamp)}
            </p>
          </div>
        </div>
      </div>

      {/* Main score section */}
      <div className="p-5">
        {/* Primary score display */}
        {primaryScore && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base text-charcoal font-medium">Overall Assessment</h3>
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getRecommendationColor()}`}>
                {getRecommendationText(report.overallRecommendation)}
              </div>
            </div>
            
            {/* Score visualization */}
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-gray-600">Usefulness: {primaryScore.percentage}%</span>
              </div>
            </div>
            
            {/* Need level to be added later */}
            {primaryScore.needLevel && (
              <div className="mt-4 text-center">
                <span className="text-base text-charcoal font-medium">
                </span>
              </div>
            )}
            
            {/* Summary */}
            {primaryScore.summary && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">{primaryScore.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Recommendations section */}
        <div className="mt-6">
          <h3 className="text-base text-charcoal font-medium mb-3">Recommendations</h3>
          
          {/* Specific Recommendations */}
          {report.specificRecommendations && report.specificRecommendations.length > 0 ? (
            <div className="mt-4"> 
              <h4 className="text-sm text-gray-600 font-medium mb-2">
                {getSectionTitle('specificRecommendations')}
              </h4>
              <div className="space-y-2">
                {report.specificRecommendations.map((recommendation, index) => {
                  const styles = getSectionStyle('specificRecommendations');
                  const iconName = getSectionIcon('specificRecommendations');
                  
                  return (
                    <div 
                      key={`specific-${index}`} 
                      className={`flex items-start p-3 rounded-md border ${styles.border} bg-white ${styles.hoverBg} transition-colors duration-200`}
                    >
                      <div className={`flex-shrink-0 h-5 w-5 ${styles.iconColor}`}>
                        {renderIcon(iconName)}
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">No specific recommendations available.</p>
            </div>
          )}
          
          {/* Base/General Recommendations */}
          {report.baseRecommendations && report.baseRecommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm text-gray-600 font-medium mb-2">
                {getSectionTitle('baseRecommendations')}
              </h4>
              <div className="space-y-2">
                {report.baseRecommendations.map((recommendation, index) => {
                  const styles = getSectionStyle('baseRecommendations');
                  const iconName = getSectionIcon('baseRecommendations');
                  
                  return (
                    <div 
                      key={`base-${index}`} 
                      className={`flex items-start p-3 rounded-md border ${styles.border} bg-white ${styles.hoverBg} transition-colors duration-200`}
                    >
                      <div className={`flex-shrink-0 h-5 w-5 ${styles.iconColor}`}>
                        {renderIcon(iconName)}
                      </div>
                      <p className="ml-3 text-sm text-gray-600">{recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with call to action */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-4">
          Get a comprehensive analysis of your team's needs with our Extended Report feature. Complete a brief identification process to unlock detailed insights and personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link 
            to="/identify"
            state={{ 
              scorecardId,
              answers: results.answers,
              results: {
                scores: results.scores,
                totalScore: results.totalScore,
                interpretation: results.interpretation,
                recommendations: report.specificRecommendations
              }
            }}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-deep-purple hover:bg-opacity-90 transition-colors duration-200"
          >
            Extended Report
          </Link>
          <a 
            href="https://www.brainiup.com/contact" 
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Speak with a Specialist
          </a>
        </div>
      </div>
    </div>
  );
};

ScorecardResults.propTypes = {
  results: PropTypes.shape({
    rawScores: PropTypes.object,
    interpretation: PropTypes.object,
    recommendationLevel: PropTypes.string
  }),
  report: PropTypes.shape({
    scorecardType: PropTypes.string,
    timestamp: PropTypes.string,
    overallRecommendation: PropTypes.string,
    scores: PropTypes.object,
    baseRecommendations: PropTypes.array,
    specificRecommendations: PropTypes.array
  }),
  scorecardId: PropTypes.string.isRequired,
  scorecard: PropTypes.shape({
    scoring: PropTypes.shape({
      report_structure: PropTypes.shape({
        recommendationLevels: PropTypes.object,
        sections: PropTypes.object,
        results_sections: PropTypes.object,
        thresholds: PropTypes.shape({
          recommendationLevel: PropTypes.arrayOf(PropTypes.shape({
            threshold: PropTypes.number,
            label: PropTypes.string,
            displayText: PropTypes.string
          }))
        })
      })
    })
  })
};

export default ScorecardResults; 