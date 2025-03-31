import PropTypes from 'prop-types';

const Instructions = ({ metadata, instructions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Title Section */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold text-charcoal">
            {metadata.title}
          </h1>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {metadata.timeToComplete}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {metadata.questionCount} questions
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {metadata.description}
        </p>
        
        {/* Main Instructions */}
        <div>
          <h2 className="text-sm font-sans font-semibold text-charcoal uppercase tracking-wide mb-2">
            Instructions
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {instructions.main}
          </p>
        </div>
      </div>
    </div>
  );
};

Instructions.propTypes = {
  metadata: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    questionCount: PropTypes.number.isRequired,
    timeToComplete: PropTypes.string.isRequired,
  }).isRequired,
  instructions: PropTypes.shape({
    main: PropTypes.string.isRequired,
  }).isRequired,
};

export default Instructions;
