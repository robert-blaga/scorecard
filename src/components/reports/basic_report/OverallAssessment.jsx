import PropTypes from "prop-types";

const OverallAssessment = ({
  score,
  displayText,
  priorityLevel,
  recommendationSummary,
}) => {
  // Calculate the score circle circumference
  const circumference = 2 * Math.PI * 120; // radius 120
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col space-y-8">
      {/* Circular score visualization */}
      <div className="relative flex justify-center">
        <svg className="transform -rotate-90 w-64 h-64">
          {/* Background circle */}
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="120"
            cx="128"
            cy="128"
          />
          {/* Score circle */}
          <circle
            className="text-indigo-500 transition-all duration-1000 ease-out"
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
          <span className="text-5xl font-light text-white">{score}%</span>
          <div className="text-sm text-gray-400 mt-2 text-center">
            <div>Alignment</div>
            <div>with best practices</div>
          </div>
        </div>
      </div>

      {/* Assessment details */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Assessment
          </span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <p className="text-gray-300 text-lg font-light leading-relaxed">
          {displayText}
        </p>

        {/* Priority indicator */}
        <div className="inline-flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full">
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
          <span className="text-sm text-gray-300">
            <span className="text-gray-400">Priority level: </span>
            {priorityLevel}
          </span>
        </div>

        {/* Summary */}
        {recommendationSummary && (
          <div className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <p className="text-gray-400 text-sm leading-relaxed">
              {recommendationSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

OverallAssessment.propTypes = {
  score: PropTypes.number.isRequired,
  displayText: PropTypes.string.isRequired,
  priorityLevel: PropTypes.string.isRequired,
  recommendationSummary: PropTypes.string,
};

export default OverallAssessment;
