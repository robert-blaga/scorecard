export const generateReport = (assessmentResults, scorecard) => {
  console.log('Generating report with:', {
    assessmentResults,
    scorecard: {
      ...scorecard,
      basic_scoring: {
        ...scorecard.basic_scoring,
        recommendations: scorecard.basic_scoring.recommendations
      }
    }
  });

  const report = {
    scores: {},
    interpretation: {},
    specificRecommendations: [],
    generalRecommendations: []
  };

  // Calculate scores and interpretation
  Object.entries(scorecard.basic_scoring.categories).forEach(([category, config]) => {
    const score = calculateScore(assessmentResults, config);
    const interpretation = interpretScore(score, config);
    
    report.scores[category] = score;
    report.interpretation[category] = interpretation;
  });

  // Determine primary category
  const primaryCategory = Object.keys(report.interpretation).reduce((a, b) => 
    report.interpretation[a].score > report.interpretation[b].score ? a : b
  );

  // Get recommendations based on primary category's need level
  const needLevel = report.interpretation[primaryCategory]?.needLevel;
  console.log('Primary category:', primaryCategory, 'Need level:', needLevel);

  if (needLevel && scorecard.basic_scoring.recommendations) {
    // First try exact match
    let matchingLevel = Object.keys(scorecard.basic_scoring.recommendations).find(
      key => key.toLowerCase() === needLevel.toLowerCase()
    );

    // If no exact match, try normalized match (without hyphens)
    if (!matchingLevel) {
      matchingLevel = Object.keys(scorecard.basic_scoring.recommendations).find(
        key => {
          const normalizedKey = key.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
          const normalizedNeedLevel = needLevel.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
          return normalizedKey === normalizedNeedLevel;
        }
      );
    }

    // If still no match, try matching with "Need" suffix
    if (!matchingLevel) {
      matchingLevel = Object.keys(scorecard.basic_scoring.recommendations).find(
        key => {
          const normalizedKey = key.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
          const normalizedNeedLevel = (needLevel.toLowerCase() + 'need').replace(/-/g, '').replace(/\s+/g, '');
          return normalizedKey === normalizedNeedLevel;
        }
      );
    }

    console.log('Matching recommendation level:', matchingLevel, 'for need level:', needLevel);

    if (matchingLevel) {
      const recommendations = scorecard.basic_scoring.recommendations[matchingLevel];
      console.log('Found recommendations:', recommendations);

      // Handle both string and array types
      if (typeof recommendations === 'string') {
        report.specificRecommendations = [recommendations];
      } else if (Array.isArray(recommendations)) {
        report.specificRecommendations = recommendations;
      } else if (recommendations) {
        // Handle case where recommendations is an object or other type
        report.specificRecommendations = [String(recommendations)];
      }
    } else {
      console.log('No matching recommendation level found for:', needLevel);
      console.log('Available recommendation levels:', Object.keys(scorecard.basic_scoring.recommendations));
    }
  } else {
    console.log('Missing need level or recommendations:', {
      needLevel,
      hasRecommendations: !!scorecard.basic_scoring.recommendations
    });
  }

  // Add general recommendations if available
  if (scorecard.basic_scoring.generalRecommendations) {
    report.generalRecommendations = Array.isArray(scorecard.basic_scoring.generalRecommendations)
      ? scorecard.basic_scoring.generalRecommendations
      : [scorecard.basic_scoring.generalRecommendations];
  }

  console.log('Generated report:', report);
  return report;
}; 