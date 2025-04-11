/**
 * Scoring Service
 * 
 * A generic scoring calculation service that works with any scorecard type.
 * This service handles calculating final scores based on user responses and
 * providing interpretation of those scores.
 */

/**
 * Calculate scores from user responses for any scorecard
 * 
 * @param {Object} responses - User responses with scores in format { questionId: { category: score } }
 * @param {Object} scorecard - The scorecard data containing questions and scoring rules
 * @returns {Object} - Object containing calculated scores and interpretation
 */
export function calculateScores(responses, scorecard) {
  if (!responses || !scorecard || !scorecard.questions || !scorecard.questions.items) {
    return { error: 'Invalid responses or scorecard data' };
  }

  // Debug logging
  console.log('Calculating scores with responses:', responses);
  console.log('Scorecard config:', scorecard.scoring);

  // Initialize scores object to track all score categories
  const scores = {};
  const answers = {};
  
  // Process each question response
  Object.entries(responses).forEach(([questionId, scoreData]) => {
    // Debug logging
    console.log('Processing question:', questionId, 'with scores:', scoreData);
    
    // Store the original answer
    answers[questionId] = scoreData;
    
    // Add the scores from this response to the accumulated scores
    Object.entries(scoreData).forEach(([category, value]) => {
      if (scores[category] === undefined) {
        scores[category] = 0;
      }
      scores[category] += Number(value);
      
      // Debug logging
      console.log('Added score for category:', category, 'value:', value, 'total:', scores[category]);
    });
  });

  // Debug logging
  console.log('Final accumulated scores:', scores);

  // Get primary category from scoring config
  const primaryCategory = scorecard.scoring?.primaryCategory;
  console.log('Primary category:', primaryCategory);
  
  if (!primaryCategory) {
    return { error: 'No primary scoring category defined in scorecard' };
  }
  
  if (!scores[primaryCategory]) {
    return { error: `Primary scoring category "${primaryCategory}" not found in calculated scores` };
  }

  // Calculate percentage score
  const maxPossible = calculateMaxPossibleScore(scorecard, primaryCategory);
  const percentage = (scores[primaryCategory] / maxPossible) * 100;

  console.log('Max possible score:', maxPossible);
  console.log('Calculated percentage:', percentage);

  // Get need level based on thresholds
  const needLevel = getNeedLevel(percentage, scorecard.scoring.thresholds.needLevel);
  
  // Get recommendation level
  const recommendationLevel = getRecommendationLevel(percentage, scorecard);

  // Get summary text
  const summary = getSummary(percentage, scorecard.scoring.summaries);

  const result = {
    rawScores: scores,
    answers, // Include the original answers
    interpretation: {
      [primaryCategory]: {
        score: scores[primaryCategory],
        percentage: percentage.toFixed(1),
        needLevel,
        summary
      }
    },
    recommendationLevel
  };

  // Debug logging
  console.log('Final result:', result);

  return result;
}

/**
 * Interpret the meaning of scores based on scorecard type
 * 
 * @param {Object} scores - The calculated scores by category
 * @param {Object} scorecard - The scorecard data
 * @returns {Object} - Interpretations for each score category
 */
function interpretScores(scores, scorecard) {
  const interpretation = {};
  
  // Check if scorecard has scoring configuration
  if (!scorecard.scoring) {
    // Generate generic interpretation if no scoring configuration exists
    return generateGenericInterpretation(scores, scorecard);
  }
  
  // Get primary category from scoring config or use first score category as fallback
  const primaryCategory = scorecard.scoring.primaryCategory || Object.keys(scores)[0];
  
  // If the primary category exists in scores
  if (scores[primaryCategory]) {
    const score = scores[primaryCategory];
    const maxPossible = calculateMaxPossibleScore(scorecard, primaryCategory);
    const percentage = (score / maxPossible) * 100;
    
    // Create base interpretation object
    interpretation[primaryCategory] = {
      score: score,
      percentage: percentage.toFixed(1),
    };
    
    // Add need level if thresholds are defined
    if (scorecard.scoring.thresholds && scorecard.scoring.thresholds.needLevel) {
      interpretation[primaryCategory].needLevel = getNeedLevel(percentage, scorecard.scoring.thresholds.needLevel);
    }
    
    // Add summary if summaries are defined
    if (scorecard.scoring.summaries) {
      interpretation[primaryCategory].summary = getSummary(percentage, scorecard.scoring.summaries);
    }
  }
  
  return interpretation;
}

/**
 * Generate a generic interpretation when no scoring configuration exists
 * 
 * @param {Object} scores - The calculated scores
 * @param {Object} scorecard - The scorecard data
 * @returns {Object} - Generic interpretation object
 */
function generateGenericInterpretation(scores, scorecard) {
  const interpretation = {};
  const maxScorePerQuestion = 5; // Default assumption
  const totalQuestions = scorecard.questions.items.length;
  
  Object.entries(scores).forEach(([category, value]) => {
    interpretation[category] = {
      score: value,
      percentage: ((value / (totalQuestions * maxScorePerQuestion)) * 100).toFixed(1)
    };
  });
  
  return interpretation;
}

/**
 * Calculate the maximum possible score for a category
 * 
 * @param {Object} scorecard - The scorecard data
 * @param {string} category - The score category
 * @returns {number} - The maximum possible score
 */
function calculateMaxPossibleScore(scorecard, category) {
  // Use the configured max score if available
  if (scorecard.scoring && scorecard.scoring.maxScorePerQuestion) {
    return scorecard.questions.items.length * scorecard.scoring.maxScorePerQuestion;
  }
  
  // Otherwise calculate it by finding the max value for each question
  let maxScore = 0;
  scorecard.questions.items.forEach(question => {
    let questionMax = 0;
    question.options.forEach(option => {
      if (option.scores && option.scores[category] !== undefined) {
        questionMax = Math.max(questionMax, option.scores[category]);
      }
    });
    maxScore += questionMax;
  });
  
  return maxScore > 0 ? maxScore : scorecard.questions.items.length * 5; // Fallback to 5 points per question
}

/**
 * Get the recommendation level based on percentage score
 * 
 * @param {number} percentage - The percentage score
 * @param {Object} scorecard - The scorecard data
 * @returns {string} - Recommendation level (high, medium, low)
 */
function getRecommendationLevel(percentage, scorecard) {
  // Check if scorecard has recommendation thresholds
  if (scorecard.scoring?.thresholds?.recommendationLevel) {
    for (const threshold of scorecard.scoring.thresholds.recommendationLevel) {
      if (percentage >= threshold.threshold) {
        return threshold.label;
      }
    }
  }
  
  // Fallback to default thresholds if no configuration exists
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

/**
 * Get need level description based on percentage score and thresholds from configuration
 * 
 * @param {number} percentage - The percentage score
 * @param {Array} needLevelThresholds - Array of threshold objects with threshold and label
 * @returns {string} - Description of need level
 */
function getNeedLevel(percentage, needLevelThresholds) {
  // Find the appropriate threshold for the percentage
  for (const threshold of needLevelThresholds) {
    if (percentage >= threshold.threshold) {
      return threshold.label;
    }
  }
  
  // Fallback to default thresholds if configuration is invalid
  if (percentage >= 75) return 'Very High Need';
  if (percentage >= 60) return 'High Need';
  if (percentage >= 40) return 'Moderate Need';
  if (percentage >= 25) return 'Low Need';
  return 'Very Low Need';
}

/**
 * Get summary text based on percentage score and thresholds from configuration
 * 
 * @param {number} percentage - The percentage score
 * @param {Array} summaries - Array of summary objects with threshold and text
 * @returns {string} - Summary text
 */
function getSummary(percentage, summaries) {
  // Find the appropriate summary for the percentage
  for (const summary of summaries) {
    if (percentage >= summary.threshold) {
      return summary.text;
    }
  }
  
  // Return empty string if no matching summary
  return '';
}

/**
 * Generate a detailed report with recommendations based on assessment results
 * 
 * @param {Object} assessmentResults - The results from calculateScores
 * @param {Object} scorecard - The original scorecard data
 * @returns {Object} - Detailed report with recommendations
 */
export function generateReport(assessmentResults, scorecard) {
  if (!assessmentResults || !scorecard) {
    return { error: 'Invalid assessment results or scorecard' };
  }
  
  const { rawScores, interpretation, recommendationLevel } = assessmentResults;
  
  // Base report structure
  const report = {
    scorecardType: scorecard.id,
    timestamp: new Date().toISOString(),
    overallRecommendation: recommendationLevel,
    scores: interpretation,
    baseRecommendations: [],
    specificRecommendations: []
  };
  
  // Get primary category from scoring config or use first score category as fallback
  const primaryCategory = scorecard.scoring?.primaryCategory || Object.keys(rawScores)[0];
  
  // Get recommendations based on scoring configuration if available
  if (scorecard.scoring && scorecard.scoring.recommendations) {
    const needLevel = interpretation[primaryCategory]?.needLevel;
    
    if (needLevel && scorecard.scoring.recommendations[needLevel]) {
      // Set base recommendations
      report.baseRecommendations = scorecard.scoring.recommendations.base || [];
      // Set need-level specific recommendations
      report.specificRecommendations = scorecard.scoring.recommendations[needLevel];
    } else {
      // Fallback to generic recommendations as base recommendations
      report.baseRecommendations = getGenericRecommendations(scorecard);
    }
  } else {
    // Use generic recommendations as base recommendations if no configuration exists
    report.baseRecommendations = getGenericRecommendations(scorecard);
  }
  
  return report;
}

/**
 * Get generic recommendations when no specific recommendations exist
 * 
 * @param {Object} scorecard - The scorecard data
 * @returns {Array} - Array of recommendation strings
 */
function getGenericRecommendations(scorecard) {
  // Check if scorecard has base recommendations
  if (scorecard.scoring?.recommendations?.base) {
    return scorecard.scoring.recommendations.base;
  }

  // Fallback to default recommendations if no configuration exists
  return [
    'Consider reviewing the assessment results with your team',
    'Identify specific areas that scored highest for targeted improvement',
    'Consult with our training specialists for customized recommendations'
  ];
} 