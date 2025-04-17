import PropTypes from "prop-types";

export default function QuestionAnalysis({
  questions,
  userAnswers,
  maxScorePerQuestion,
  primaryCategory = "maturity", // Add default value for backward compatibility
}) {
  return (
    <div className="space-y-8 sm:space-y-12">
      {questions.map((question) => {
        const userAnswerIndex = userAnswers[question.id];
        const userAnswer = question.options[userAnswerIndex];

        // Get all scores for this question
        const allScores = question.options.map(
          (opt) => opt.scores[primaryCategory]
        );

        // Calculate the score percentage for positioning the dot
        const userScore = userAnswer?.scores[primaryCategory];
        const position = (userScore / maxScorePerQuestion) * 100;

        return (
          <div
            key={question.id}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100"
          >
            {/* Question Header with Divider */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Question {question.id}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed">
                {question.text}
              </h3>
            </div>

            {/* Answer Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* User's Selected Option */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  Your Answer
                </h4>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed mb-4">
                  {userAnswer?.text || "No answer provided"}
                </p>
                <div className="inline-flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-xs sm:text-sm text-indigo-600">
                    Score: {userScore}
                  </span>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-indigo-600">
                <div className="w-full space-y-4 sm:space-y-6">
                  <h4 className="text-xs sm:text-sm font-medium text-indigo-500 uppercase tracking-wider text-center">
                    Gap Analysis
                  </h4>
                  <div className="relative pb-8">
                    {/* Track */}
                    <div className="relative w-full">
                      <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                        {/* Progress */}
                        <div
                          className="h-full bg-indigo-200 transition-all duration-500"
                          style={{ width: `${position}%` }}
                        />
                      </div>

                      {/* All score positions */}
                      <div className="relative h-6 mt-2">
                        {allScores.map((score) => {
                          const scorePosition =
                            (score / maxScorePerQuestion) * 100;
                          return (
                            <div
                              key={score}
                              className="absolute top-0 transform -translate-x-1/2"
                              style={{ left: `${scorePosition}%` }}
                            >
                              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                                {score}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* User Score - Triangle */}
                      <div
                        className="absolute top-0 -translate-y-3 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-0 h-0 border-l-[8px] sm:border-l-[12px] border-r-[8px] sm:border-r-[12px] border-b-[16px] sm:border-b-[20px] border-transparent border-b-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Practice Option */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:col-span-2 lg:col-span-1">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  Best Practice
                </h4>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed mb-4">
                  {question.options.find(
                    (opt) =>
                      opt.scores[primaryCategory] === Math.max(...allScores)
                  )?.text || "No best practice available"}
                </p>
                <div className="inline-flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm text-green-600">
                    Score: {Math.max(...allScores)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

QuestionAnalysis.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          scores: PropTypes.object.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  userAnswers: PropTypes.object.isRequired,
  maxScorePerQuestion: PropTypes.number.isRequired,
  primaryCategory: PropTypes.string,
};
