export const getContextualRecommendations = (scorecard, results, report) => {
  if (!scorecard || !results || !report) return null;

  const categoryInsights = Object.entries(results.rawScores)
    .filter(([category]) => category !== 'selectedIndex')
    .map(([category, score]) => {
      const maxScore = scorecard.scoring.maxScorePerQuestion * scorecard.questions.items.length;
      const percentage = (score / maxScore) * 100;
      return {
        category,
        score,
        percentage,
        needsImprovement: percentage < 70
      };
    });

  // Get report structure from scorecard configuration
  const reportStructure = scorecard.scoring?.report_structure;
  if (!reportStructure) {
    // Fallback to default structure if not configured
    return {
      title: "Recommendations",
      description: "Based on your assessment results, we recommend:",
      sections: [
        {
          title: "Priority Areas",
          recommendations: report.specificRecommendations
        }
      ]
    };
  }

  // Process sections based on their type
  const processedSections = Object.entries(reportStructure.sections).map(([key, section]) => {
    let recommendations = [];

    switch (section.type) {
      case 'category_recommendations':
        // Filter insights based on thresholds
        const filteredInsights = categoryInsights.filter(insight => {
          if (section.threshold) {
            return insight.percentage >= section.threshold;
          }
          if (section.minThreshold && section.maxThreshold) {
            return insight.percentage >= section.minThreshold && insight.percentage < section.maxThreshold;
          }
          return true;
        });

        // Map insights to recommendations
        recommendations = filteredInsights.map(insight => {
          const rec = scorecard.scoring?.questionRecommendations?.[insight.category]?.[section.recommendationLevel];
          if (rec) return rec;
          
          // Fallback recommendation if none found
          // Replace underscores with spaces in category name
          const formattedCategory = insight.category.toLowerCase().replace(/_/g, ' ');
          return `${section.recommendationLevel === 'high' ? 'Prioritize' : 'Enhance'} ${formattedCategory} through targeted interventions.`;
        });
        break;

      case 'static_recommendations':
        recommendations = section.recommendations;
        break;

      default:
        recommendations = [];
    }

    return {
      title: section.title,
      description: section.description,
      recommendations
    };
  });

  return {
    title: reportStructure.title,
    description: reportStructure.description,
    sections: processedSections
  };
}; 