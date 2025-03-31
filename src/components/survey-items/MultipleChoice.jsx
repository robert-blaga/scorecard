import PropTypes from 'prop-types';

const MultipleChoice = ({ 
  question, 
  selectedValues = [], 
  onSelect,
  showNumber = true 
}) => {
  const handleChange = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelect(newValues);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Question Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {showNumber && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-deep-purple flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {question.number}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base text-charcoal font-medium leading-relaxed pt-0.5">
              {question.text}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Select all that apply
            </p>
          </div>
        </div>
      </div>

      {/* Response Options */}
      <div className="p-3">
        <div className="grid gap-1.5">
          {question.options.map((option, index) => {
            const isSelected = selectedValues.includes(index);
            return (
              <label
                key={index}
                className={`
                  relative flex items-center p-3 rounded-md cursor-pointer
                  transition-colors duration-200 group border
                  ${isSelected 
                    ? 'bg-deep-purple border-deep-purple' 
                    : 'hover:bg-gray-50 border-gray-200'
                  }
                `}
              >
                {/* Custom Checkbox */}
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleChange(index)}
                    className="absolute opacity-0 w-5 h-5 cursor-pointer"
                  />
                  <div className={`
                    w-5 h-5 rounded flex items-center justify-center
                    ${isSelected 
                      ? 'bg-white' 
                      : 'border-2 border-deep-purple group-hover:border-charcoal'
                    }
                    transition-colors duration-200
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-deep-purple" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Option Content */}
                <div className="ml-3 flex-1">
                  <span className={`
                    text-sm
                    ${isSelected 
                      ? 'text-white font-medium' 
                      : 'text-gray-600 group-hover:text-charcoal'
                    }
                    transition-colors duration-200
                  `}>
                    {option.text}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

MultipleChoice.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['multiple']).isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        scores: PropTypes.shape({
          strategic_intensity: PropTypes.number.isRequired,
          depth_of_change: PropTypes.number.isRequired
        }).isRequired
      })
    ).isRequired
  }).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.number),
  onSelect: PropTypes.func.isRequired,
  showNumber: PropTypes.bool
};

export default MultipleChoice;
