import React from 'react';
import { SignalHigh, Check, TriangleAlert} from 'lucide-react';

const PerformanceOverview = ({ scorecard, responses }) => {
  if (!scorecard || !responses) return null;

  // Get all categories and their scores
  const categoryScores = scorecard.questions.items.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = {
        totalScore: 0,
        maxScore: 0,
        idealScore: 0,
        questionCount: 0
      };
    }
    
    // Check if this response is in the expected format
    const answer = responses[question.id];
    
    if (answer !== undefined) {
      let score = 0;
      
      // Check if answer is directly the selected option index
      if (typeof answer === 'number' || !isNaN(parseInt(answer))) {
        const selectedOptionIndex = parseInt(answer);
        const selectedOption = question.options[selectedOptionIndex];
        score = selectedOption?.scores?.[scorecard.scoring.primaryCategory] || 0;
      } 
      // Check if answer has scores data structure
      else if (answer[scorecard.scoring.primaryCategory] !== undefined) {
        score = Number(answer[scorecard.scoring.primaryCategory]);
      }
      
      // Find the ideal (minimum) score for this question (inverted scale where 1 is best)
      const idealScore = question.options.reduce((min, option) => {
        const optionScore = option.scores?.[scorecard.scoring.primaryCategory] || scorecard.scoring.maxScorePerQuestion;
        return optionScore < min ? optionScore : min;
      }, scorecard.scoring.maxScorePerQuestion);
      
      acc[question.category].totalScore += score;
      acc[question.category].idealScore += idealScore;
      acc[question.category].maxScore += scorecard.scoring.maxScorePerQuestion;
      acc[question.category].questionCount++;
    }
    
    return acc;
  }, {});

  // Calculate match percentages and gap percentages for inverted scale (lower is better)
  const categorizedAreas = Object.entries(categoryScores).map(([category, scores]) => {
    // For an inverted scale (where lower is better):
    // 1. Calculate total possible improvement range
    const totalPossibleImprovement = scores.maxScore - scores.idealScore;
    
    // 2. Calculate how much improvement was achieved
    const achievedImprovement = scores.maxScore - scores.totalScore;
    
    // 3. Calculate match percentage (how close to ideal)
    const matchPercentage = totalPossibleImprovement > 0 
      ? (achievedImprovement / totalPossibleImprovement) * 100 
      : 100; // If no improvement possible, score is 100%
    
    // 4. Calculate gap percentage (how far from ideal)
    const gapPercentage = 100 - matchPercentage;
    
    return {
      category,
      matchPercentage,
      gapPercentage,
      level: gapPercentage < 30 ? 'strong' : 
             gapPercentage < 60 ? 'moderate' : 
             'needs-attention'
    };
  });

  // Sort areas by match percentage for distribution (highest first)
  const sortedAreas = [...categorizedAreas].sort((a, b) => b.matchPercentage - a.matchPercentage);
  const strongAreas = sortedAreas.filter(area => area.level === 'strong').slice(0, 3);
  const needsAttentionAreas = sortedAreas.filter(area => area.level === 'needs-attention').slice(0, 3);
  const moderateAreas = sortedAreas.filter(area => area.level === 'moderate').slice(0, 2);

  // Calculate distribution
  const distribution = {
    strong: categorizedAreas.filter(area => area.level === 'strong').length,
    moderate: categorizedAreas.filter(area => area.level === 'moderate').length,
    needsAttention: categorizedAreas.filter(area => area.level === 'needs-attention').length
  };

  // Calculate overall trend
  const overallMatchPercentage = sortedAreas.length > 0
    ? sortedAreas.reduce((sum, area) => sum + area.matchPercentage, 0) / sortedAreas.length
    : 0;
  const overallGapPercentage = 100 - overallMatchPercentage;

  // Get overall status label
  const getStatusLabel = (percentage) => {
    if (percentage >= 70) return 'Excellent';
    if (percentage >= 40) return 'Good';
    if (percentage >= 30) return 'Fair';
    return 'Needs Improvement';
  };

  // Color utilities
  const getMatchColor = (percentage) => {
    if (percentage >= 70) return 'text-emerald-600';
    if (percentage >= 40) return 'text-blue-600';
    if (percentage >= 30) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = (percentage) => {
    if (percentage >= 70) return 'bg-emerald-50 border-emerald-100';
    if (percentage >= 40) return 'bg-blue-50 border-blue-100';
    if (percentage >= 30) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  const getGradientClass = (percentage) => {
    if (percentage >= 70) return 'from-emerald-500 to-emerald-600';
    if (percentage >= 40) return 'from-blue-500 to-blue-600';
    if (percentage >= 30) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Explanatory Introduction */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <SignalHigh className="w-5 h-5 mr-2 text-blue-600" />
            Assessment Results Overview
          </h3>
          <p className="text-sm text-gray-600 mb-5 ml-11">
            This analysis compares your responses to best practice benchmarks, showing how aligned your current approaches are with recommended practices.
          </p>
        </div>
        
        {/* Overall score card */}
        <div className="relative mt-3 p-6 pt-0">
          <div className="absolute inset-0 h-40 bg-gradient-to-b from-gray-50 to-white"></div>
          <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="relative h-40 w-40">
                  {/* Background circle */}
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="stroke-gray-200"
                      fill="none"
                      strokeWidth="3.8"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      fill="none"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      strokeDasharray={`${overallMatchPercentage}, 100`}
                      className={getMatchColor(overallMatchPercentage)}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-3xl font-bold text-gray-800">{Math.round(overallMatchPercentage)}%</div>
                    <div className="text-sm font-medium text-gray-500">alignment</div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {getStatusLabel(overallMatchPercentage)} 
                  <span className="text-sm font-normal text-gray-500 ml-2">Overall Alignment</span>
                </h4>
                
                <div className="text-sm text-gray-600 mb-4">
                  Your responses show <span className={getMatchColor(overallMatchPercentage) + " font-medium"}>{Math.round(overallMatchPercentage)}%</span> alignment with best practices across all categories. 
                  {overallGapPercentage > 30 ? (
                    <span> There are opportunities to improve in several key areas.</span>
                  ) : (
                    <span> You're demonstrating strong alignment with recommended approaches.</span>
                  )}
                </div>
                
                {/* Score distribution */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 border border-green-100">
                    <span className="text-xs text-green-700 mb-1">Strong</span>
                    <span className="text-lg font-semibold text-green-600">{distribution.strong}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <span className="text-xs text-amber-700 mb-1">Moderate</span>
                    <span className="text-lg font-semibold text-amber-600">{distribution.moderate}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 border border-red-100">
                    <span className="text-xs text-red-700 mb-1">Needs Work</span>
                    <span className="text-lg font-semibold text-red-600">{distribution.needsAttention}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}


      {/* Key Areas Highlights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Areas of Strength */}
        <div className="bg-green-50 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-green-300">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Areas of Strength</h3>
            </div>
          </div>
          <div className="p-5">
            {strongAreas.length > 0 ? (
              <div className="space-y-3">
                {strongAreas.map(area => (
                  <div key={area.category} className="p-3 bg-green-200 rounded-lg border border-emerald-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{area.category}</div>
                        <p className="text-xs text-emerald-700 mt-1">Strong alignment with best practices</p>
                      </div>
                      <div className="px-2 py-1 bg-green-100 rounded-md border border-green-200 text-green-600 font-medium text-sm">
                        {Math.round(area.matchPercentage)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No areas showing strong performance yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Areas Needing Attention */}
        <div className="bg-red-50 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-red-200">
            <div className="flex items-center">
              <TriangleAlert className="w-5 h-5 mr-2 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Areas Needing Attention</h3>
            </div>
          </div>
          <div className="p-5">
            {needsAttentionAreas.length > 0 ? (
              <div className="space-y-3">
                {needsAttentionAreas.map(area => (
                  <div key={area.category} className="p-3 bg-red-200 rounded-lg border border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{area.category}</div>
                        <p className="text-xs text-red-700 mt-1">Significant room for improvement</p>
                      </div>
                      <div className="px-2 py-1 bg-red-100 rounded-md border border-red-200 text-red-600 font-medium text-sm">
                        {Math.round(area.matchPercentage)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No areas needing immediate attention</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend and explanation */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
          <svg className="w-4 h-4 text-deep-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Interpret Your Results
        </h4>
        <div className="grid md:grid-cols-2 gap-5 text-xs text-gray-600">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Match Score</h5>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                <span><span className="font-medium">70-100%:</span> Excellent alignment with best practices</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span><span className="font-medium">40-69%:</span> Good alignment with some opportunities</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                <span><span className="font-medium">30-39%:</span> Fair alignment with clear gaps</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span><span className="font-medium">0-29%:</span> Needs significant improvement</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Next Steps</h5>
            <ul className="space-y-1.5">
              <li className="flex items-start">
                <span className="text-deep-purple mr-2">•</span>
                <span>Review your areas needing attention first</span>
              </li>
              <li className="flex items-start">
                <span className="text-deep-purple mr-2">•</span>
                <span>Consider the specific recommendations for each category</span>
              </li>
              <li className="flex items-start">
                <span className="text-deep-purple mr-2">•</span>
                <span>Develop an action plan focusing on highest-impact improvements</span>
              </li>
              <li className="flex items-start">
                <span className="text-deep-purple mr-2">•</span>
                <span>Reassess periodically to track progress</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview; 