import React from 'react';
import PropTypes from 'prop-types';
import { Lightbulb } from 'lucide-react';

/**
 * Component for displaying specific recommendations based on assessment results
 */
const SpecificRecommendations = ({ recommendations, title, styles }) => {
  // Debug logging
  console.log('SpecificRecommendations props:', {
    recommendations,
    title,
    styles
  });

  if (!recommendations) {
    console.log('No recommendations provided');
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">No specific recommendations available.</p>
      </div>
    );
  }

  // Ensure recommendations is an array and handle different input types
  let recommendationsArray = [];
  if (Array.isArray(recommendations)) {
    recommendationsArray = recommendations;
  } else if (typeof recommendations === 'string') {
    recommendationsArray = [recommendations];
  } else if (recommendations) {
    recommendationsArray = [String(recommendations)];
  }
  
  console.log('Processed recommendations array:', recommendationsArray);

  if (recommendationsArray.length === 0) {
    console.log('Empty recommendations array');
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600">No specific recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm text-gray-600 font-medium mb-2">
        {title || 'Specific Recommendations'}
      </h4>
      <div className="space-y-2">
        {recommendationsArray.map((recommendation, index) => (
          <div 
            key={`specific-${index}`} 
            className={`flex items-start p-3 rounded-md border ${styles?.border || 'border-blue-500'} bg-white ${styles?.hoverBg || 'hover:bg-blue-50'} transition-colors duration-200`}
          >
            <div className={`flex-shrink-0 h-5 w-5 ${styles?.iconColor || 'text-blue-600'}`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <p className="ml-3 text-sm text-gray-600">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

SpecificRecommendations.propTypes = {
  recommendations: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.object
  ]),
  title: PropTypes.string,
  styles: PropTypes.shape({
    border: PropTypes.string,
    hoverBg: PropTypes.string,
    iconColor: PropTypes.string
  })
};

export default SpecificRecommendations; 