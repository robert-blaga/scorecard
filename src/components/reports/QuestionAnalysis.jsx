import React from 'react';
import { getQuestionAnalysis } from '../../utils/reportAnalysis';
import ProgressCircle from '../shared/ProgressCircle';

const QuestionAnalysis = ({ questions, answers, scorecard, maxScorePerQuestion }) => {
  // Helper function to process the answer data for a question
  const processAnswer = (questionId) => {
    const answer = answers?.[questionId];
    
    // If answer is undefined or null, return undefined
    if (answer === undefined || answer === null) {
      return undefined;
    }
    
    // Check if it's a direct index (number or string number)
    if (typeof answer === 'number' || (!isNaN(parseInt(answer)) && typeof answer === 'string')) {
      return parseInt(answer);
    }
    
    // If it's an object with category scores, return it as is
    if (typeof answer === 'object') {
      return answer;
    }
    
    // Default case, return as is
    return answer;
  };

  return (
    <div className="mt-6">
      <h3 className="text-base text-charcoal font-medium mb-3">Detailed Question Analysis</h3>
      <div className="space-y-4">
        {questions.map((question) => {
          const processedAnswer = processAnswer(question.id);
          const analysis = getQuestionAnalysis(
            question,
            processedAnswer,
            scorecard,
            maxScorePerQuestion
          );

          return (
            <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Question {question.number}: {question.text}
                </h4>
                <span className="px-2 py-1 text-xs font-medium text-white bg-dark-purple bg-opacity-10 rounded-lg">
                  {question.category}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Current Response */}
                <div className="p-3 bg-white rounded-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-deep-purple mr-2"></div>
                    <span className="text-xs font-medium text-gray-600">Your Response</span>
                  </div>
                  <p className="text-sm text-gray-700">{analysis.currentState}</p>
                </div>

                {/* Gap Analysis */}
                <div className="p-3 bg-white rounded-md border border-gray-200 flex flex-col justify-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* Display match percentage (how close to ideal) */}
                    <ProgressCircle percentage={parseFloat(analysis.matchPercentage)} />
                    <div className="mt-3 text-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        analysis.gap.severity === 'high' ? 'bg-red-50 text-red-600' :
                        analysis.gap.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {analysis.gap.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ideal State */}
                <div className="p-3 bg-white rounded-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-xs font-medium text-gray-600">Ideal State</span>
                  </div>
                  <p className="text-sm text-gray-700">{analysis.idealState}</p>
                </div>
              </div>

              {/* Recommended Improvement */}
              <div className="p-3 bg-white rounded-md border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-deep-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs font-medium text-gray-600">Recommended Improvement</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{analysis.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionAnalysis; 