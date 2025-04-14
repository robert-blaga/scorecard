export const getContextualRecommendations = (scorecard, results, report) => {
  // Basic validation
  if (!scorecard || !results || !report) {
    console.error('Missing required data for recommendations:', { scorecard, results, report });
    return null;
  }

  // Calculate category insights with basic validation
  const categoryInsights = Object.entries(results.rawScores)
    .filter(([category]) => category !== 'selectedIndex')
    .map(([category, score]) => {
      try {
        // Basic validation for score calculation
        const maxScore = Number(scorecard.basic_scoring?.maxScorePerQuestion || 5) * 
                        (scorecard.questions?.items?.length || 0);
        const percentage = maxScore > 0 ? (Number(score) / maxScore) * 100 : 0;
        
        return {
          category,
          score: Number(score),
          percentage,
          needsImprovement: percentage < 70
        };
      } catch (error) {
        console.error('Error calculating score for category:', category, error);
        return null;
      }
    })
    .filter(Boolean);

  // Get report structure with fallback
  const reportStructure = scorecard.basic_scoring?.report_structure;
  if (!reportStructure) {
    console.warn('No report structure found, using default recommendations');
    return {
      title: "Recommendations",
      description: "Based on your assessment results, we recommend:",
      sections: [
        {
          title: "Priority Areas",
          recommendations: report.specificRecommendations || []
        }
      ]
    };
  }

  // Process sections with basic error handling
  const processedSections = Object.entries(reportStructure.sections).map(([key, section]) => {
    try {
      let recommendations = [];

      // Default to category_recommendations if type is missing
      const sectionType = section.type || 'category_recommendations';

      switch (sectionType) {
        case 'category_recommendations':
          // Simple threshold validation
          const minThreshold = Number(section.minThreshold);
          const maxThreshold = Number(section.maxThreshold);
          
          // Filter insights based on validated thresholds
          const filteredInsights = categoryInsights.filter(insight => {
            if (section.threshold) {
              return insight.percentage >= Number(section.threshold);
            }
            if (!isNaN(minThreshold) && !isNaN(maxThreshold)) {
              return insight.percentage >= minThreshold && insight.percentage <= maxThreshold;
            }
            return true;
          });

          // Get recommendations with proper fallback chain
          recommendations = filteredInsights.map(insight => {
            // 1. Try category-specific recommendations from questionRecommendations
            const categoryRec = scorecard.basic_scoring?.questionRecommendations?.[insight.category]?.[section.recommendationLevel];
            if (categoryRec) {
              return Array.isArray(categoryRec) ? categoryRec[0] : categoryRec;
            }

            // 2. Try need-level recommendations from scoring.recommendations
            const needLevel = getNeedLevel(insight.percentage);
            const needLevelRecs = scorecard.basic_scoring?.recommendations?.[needLevel];
            if (needLevelRecs && Array.isArray(needLevelRecs) && needLevelRecs.length > 0) {
              return needLevelRecs[0];
            }

            // 3. Try base recommendations
            const baseRecs = scorecard.basic_scoring?.recommendations?.base;
            if (baseRecs && Array.isArray(baseRecs) && baseRecs.length > 0) {
              return baseRecs[0];
            }
            
            // 4. Last resort fallback
            const formattedCategory = insight.category.toLowerCase().replace(/_/g, ' ');
            return `${section.recommendationLevel === 'high' ? 'Prioritize' : 'Enhance'} ${formattedCategory} through targeted interventions.`;
          });
          break;

        case 'static_recommendations':
          recommendations = Array.isArray(section.recommendations) ? section.recommendations : [];
          break;

        default:
          console.warn('Unknown section type:', sectionType);
          recommendations = [];
      }

      return {
        title: section.title || 'Untitled Section',
        description: section.description || '',
        recommendations
      };
    } catch (error) {
      console.error('Error processing section:', key, error);
      return {
        title: key,
        description: '',
        recommendations: []
      };
    }
  });

  return {
    title: reportStructure.title || 'Assessment Recommendations',
    description: reportStructure.description || 'Based on your assessment results:',
    sections: processedSections.filter(section => section.recommendations.length > 0)
  };
};

// Helper function to determine need level based on percentage
function getNeedLevel(percentage) {
  if (percentage >= 75) return 'very-high';
  if (percentage >= 60) return 'high';
  if (percentage >= 40) return 'medium';
  if (percentage >= 25) return 'low';
  return 'very-low';
} 