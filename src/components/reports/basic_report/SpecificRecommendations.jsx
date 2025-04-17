import PropTypes from "prop-types";

/**
 * Component for displaying specific recommendations based on assessment results
 */
const SpecificRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No recommendations available</p>
      </div>
    );
  }

  // Ensure recommendations is an array
  const recommendationsArray = Array.isArray(recommendations)
    ? recommendations
    : [recommendations];

  return (
    <div className="flex flex-col h-full">
      {/* Minimal header with accent line */}
      <div className="relative pb-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900">Strategic Actions</h3>
        <p className="text-sm text-gray-500 mt-1">Implementation roadmap</p>
        <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-600" />
      </div>

      {/* Recommendations with elegant numbering */}
      <div className="flex-1 space-y-6">
        {recommendationsArray.map((recommendation, index) => (
          <div key={`specific-${index}`} className="flex items-start space-x-6">
            {/* Elegant number indicator */}
            <div className="flex-shrink-0 w-8">
              <span className="text-2xl font-light text-indigo-600">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Recommendation content */}
            <div className="flex-1 min-w-0">
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {recommendation}
                </p>
              </div>
            </div>
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
  ]),
};

export default SpecificRecommendations;
