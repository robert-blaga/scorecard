import PropTypes from "prop-types";

const ExtendedOverallAssessment = ({
  score,
  displayText,
  priorityLevel,
  recommendationSummary,
}) => {
  // Calculate the score circle circumference
  const circumference = 2 * Math.PI * 120; // radius 120
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column with score visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <svg className="transform -rotate-90 w-64 h-64">
              {/* Background circle */}
              <circle
                className="text-gray-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
              {/* Score circle */}
              <circle
                className="text-deep-purple transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                }}
              />
            </svg>
            {/* Center score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-900">{score}%</span>
              <div className="text-sm text-gray-600 mt-2 text-center">
                <div>Alignment</div>
                <div>with best practices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column with assessment details */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Assessment text */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Assessment
            </h3>
            <p className="text-gray-900 text-lg leading-relaxed">
              {displayText}
            </p>
          </div>

          {/* Priority indicator */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Priority Level
            </h3>
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  priorityLevel === "Urgent" || priorityLevel === "High"
                    ? "bg-red-500"
                    : priorityLevel === "Moderate"
                    ? "bg-yellow-500"
                    : priorityLevel === "Low" || priorityLevel === "Not needed"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="text-gray-900">{priorityLevel}</span>
            </div>
          </div>

          {/* Recommendation summary */}
          {recommendationSummary && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Summary
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {recommendationSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ExtendedOverallAssessment.propTypes = {
  score: PropTypes.number.isRequired,
  displayText: PropTypes.string.isRequired,
  priorityLevel: PropTypes.string.isRequired,
  recommendationSummary: PropTypes.string,
};

export default ExtendedOverallAssessment;
