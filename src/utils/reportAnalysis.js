/**
 * Generate improvement recommendations based on the scorecard configuration
 */
export const getQuestionAnalysis = (question, userAnswer, scorecard, maxScore) => {
  let selectedOption = null;
  
  // Handle different types of userAnswer data
  if (userAnswer !== undefined) {
    // If userAnswer is a direct index (number)
    if (typeof userAnswer === 'number' && question.options[userAnswer]) {
      selectedOption = question.options[userAnswer];
    } 
    // If userAnswer is an object with category scores
    else if (typeof userAnswer === 'object' && userAnswer !== null) {
      // Try to find the option with the matching score
      const score = userAnswer[scorecard.scoring.primaryCategory];
      if (score !== undefined) {
        selectedOption = question.options.find(option => 
          option.scores?.[scorecard.scoring.primaryCategory] === score
        );
        
        // If no matching option found, use the first option with this score as fallback
        if (!selectedOption && question.options.length > 0) {
          selectedOption = question.options[0];
        }
      }
    }
  }

  // Find the ideal option (lowest score for inverted scale where 1 is best, 5 is worst)
  const idealOption = question.options.reduce((best, current) => {
    const currentScore = current.scores?.[scorecard.scoring.primaryCategory] || 0;
    const bestScore = best.scores?.[scorecard.scoring.primaryCategory] || 0;
    return currentScore < bestScore ? current : best;
  }, question.options[0]);

  // Get current score
  let currentScore;
  if (selectedOption?.scores?.[scorecard.scoring.primaryCategory] !== undefined) {
    currentScore = selectedOption.scores[scorecard.scoring.primaryCategory];
  } else if (typeof userAnswer === 'object' && userAnswer?.[scorecard.scoring.primaryCategory] !== undefined) {
    currentScore = Number(userAnswer[scorecard.scoring.primaryCategory]);
  } else {
    currentScore = maxScore; // Default to max (worst) if no valid score is found
  }

  // Get ideal score
  const idealScore = idealOption.scores?.[scorecard.scoring.primaryCategory] || 1; // Ideal is minimum (best)

  // For an inverted scale (where lower is better):
  // 1. Calculate total possible improvement range (maxScore - idealScore)
  const totalPossibleImprovement = maxScore - idealScore;
  
  // 2. Calculate how much improvement the user achieved (maxScore - currentScore)
  const userAchievedImprovement = maxScore - currentScore;
  
  // 3. Calculate match percentage (how close to ideal as a percentage)
  const matchPercentage = totalPossibleImprovement > 0 
    ? (userAchievedImprovement / totalPossibleImprovement) * 100 
    : 100; // If no improvement possible, score is 100%
  
  // 4. Calculate gap percentage (how far from ideal)
  const gapPercentage = 100 - matchPercentage;
  
  // 5. Calculate point difference (higher means larger gap)
  const gapPoints = currentScore - idealScore;

  // Get recommendations based on gap severity
  const getRecommendations = () => {
    if (!scorecard.scoring?.questionRecommendations?.[question.category]) {
      return 'No specific recommendations available for this category';
    }

    const recommendations = scorecard.scoring.questionRecommendations[question.category];
    let recs;
    
    // Higher gap percentage = more improvement needed
    if (gapPercentage >= 60) {
      recs = recommendations.high;
    } else if (gapPercentage >= 30) {
      recs = recommendations.medium;
    } else {
      recs = recommendations.low;
    }

    // Ensure we return a string
    if (!recs) {
      return 'No specific recommendations available for this gap level';
    }
    
    // Format recommendations to replace underscores with spaces
    if (Array.isArray(recs)) {
      return recs.map(rec => typeof rec === 'string' ? rec.replace(/_/g, ' ') : rec).join(', ');
    }
    
    return typeof recs === 'string' ? recs.replace(/_/g, ' ') : recs;
  };

  // Define gap severity labels that will be more understandable to users
  let gapSeverityLabel;
  if (gapPercentage < 10) {
    gapSeverityLabel = 'Perfect Match';
  } else if (gapPercentage < 30) {
    gapSeverityLabel = 'Very Close';
  } else if (gapPercentage < 60) {
    gapSeverityLabel = 'Room for Improvement';
  } else {
    gapSeverityLabel = 'Significant Gap';
  }

  return {
    currentState: selectedOption ? selectedOption.text : "No response provided",
    idealState: idealOption.text,
    gap: {
      points: gapPoints,
      percentage: gapPercentage,
      severity: gapPercentage >= 60 ? 'high' : gapPercentage >= 30 ? 'medium' : 'low',
      label: gapSeverityLabel
    },
    matchPercentage: matchPercentage.toFixed(1),
    currentScore,
    idealScore,
    maxScore,
    recommendation: getRecommendations()
  };
}; 