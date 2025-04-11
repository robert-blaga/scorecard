import React from 'react';
import { CircleArrowRight } from 'lucide-react';

// Helper function to format recommendation text
const formatRecommendationText = (text) => {
  return typeof text === 'string' ? text.replace(/_/g, ' ') : text;
};

const RecommendationsSection = ({ recommendations }) => {
  return (
    <div className="mt-6">
      <h3 className="text-base text-charcoal font-medium mb-3">{recommendations.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{recommendations.description}</p>
      
      <div className="space-y-4">
        {recommendations.sections.map((section, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{section.title}</h4>
            {section.description && (
              <p className="text-sm text-gray-600 mb-3">{section.description}</p>
            )}
            <div className="space-y-2">
              {section.recommendations.map((rec, recIndex) => (
                <div 
                  key={recIndex}
                  className="flex items-start p-3 rounded-md border border-deep-purple border-opacity-20 bg-white"
                >
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-400 transition-all duration-200 hover:scale-110 hover:text-indigo-500">
                    <CircleArrowRight className="w-full h-full" />
                  </div>
                  <p className="ml-3 text-sm text-gray-600">{formatRecommendationText(rec)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection; 