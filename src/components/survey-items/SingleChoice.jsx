import PropTypes from 'prop-types';

const SingleChoice = ({ 
  question, 
  selectedValue, 
  onSelect,
  showNumber = true 
}) => {
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
          <h3 className="text-base text-charcoal font-medium leading-relaxed flex-1 pt-0.5">
            {question.text}
          </h3>
        </div>
      </div>

      {/* Response Options */}
      <div className="p-3">
        <div className="grid gap-1.5">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`
                relative flex items-center p-3 rounded-md cursor-pointer
                transition-all duration-200 group
                ${selectedValue === index 
                  ? 'bg-deep-purple ring-1 ring-deep-purple' 
                  : 'hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {/* Custom Radio Button */}
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={selectedValue === index}
                  onChange={() => onSelect(index)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedValue === index 
                    ? 'border-white' 
                    : 'border-deep-purple group-hover:border-charcoal'
                  }
                  transition-colors duration-200
                `}>
                  <div className={`
                    w-2.5 h-2.5 rounded-full
                    ${selectedValue === index 
                      ? 'bg-white' 
                      : 'bg-deep-purple group-hover:bg-charcoal'
                    }
                    transition-colors duration-200
                  `}/>
                </div>
              </div>

              {/* Option Content */}
              <div className="ml-3 flex-1">
                <span className={`
                  text-sm
                  ${selectedValue === index 
                    ? 'text-white font-medium' 
                    : 'text-gray-600 group-hover:text-charcoal'
                  }
                  transition-colors duration-200
                `}>
                  {option.text}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

SingleChoice.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['single_choice']).isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        scores: PropTypes.object.isRequired
      })
    ).isRequired
  }).isRequired,
  selectedValue: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  showNumber: PropTypes.bool
};

export default SingleChoice;
