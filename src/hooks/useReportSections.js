import { useMemo } from 'react';

export const useReportSections = (scorecard, results) => {
  const priorityFocusAreas = useMemo(() => {
    if (!scorecard?.basic_scoring?.report_structure?.sections?.critical_focus) {
      return [];
    }

    if (!results?.categoryScores) {
      console.warn('No category scores available in results');
      return [];
    }

    const { threshold } = scorecard.basic_scoring.report_structure.sections.critical_focus;
    const criticalCategories = Object.entries(results.categoryScores || {})
      .filter(([_, score]) => score?.matchPercentage >= threshold)
      .map(([categoryId]) => categoryId);

    const categories = scorecard.basic_scoring.report_structure.sections.development_opportunities?.categories || [];
    
    return criticalCategories
      .map(categoryId => {
        const categoryConfig = categories.find(cat => cat && typeof cat === 'object' && cat.id === categoryId);
        if (!categoryConfig) {
          console.warn(`No category config found for ${categoryId}`);
          return null;
        }
        
        const score = results.categoryScores[categoryId];
        if (!score) {
          console.warn(`No score found for category ${categoryId}`);
          return null;
        }

        return {
          id: categoryConfig.id,
          category: categoryConfig.category,
          description: categoryConfig.description,
          matchPercentage: score.matchPercentage,
          priority: 'critical',
          recommendations: categoryConfig.recommendations || [],
          currentState: categoryConfig.currentState,
          idealState: categoryConfig.idealState
        };
      })
      .filter(Boolean);
  }, [scorecard, results]);

  const developmentOpportunities = useMemo(() => {
    if (!scorecard?.scoring?.report_structure?.sections?.development_opportunities) {
      return [];
    }

    if (!results?.categoryScores) {
      console.warn('No category scores available in results');
      return [];
    }

    const { minThreshold, maxThreshold, categories } = scorecard.basic_scoring.report_structure.sections.development_opportunities;

    if (!categories || !Array.isArray(categories)) {
      console.warn('No categories defined in development opportunities section');
      return [];
    }

    return categories
      .map(category => {
        if (!category || typeof category !== 'object' || !category.id) {
          console.warn('Invalid category configuration');
          return null;
        }

        const score = results.categoryScores[category.id];
        if (!score) {
          console.warn(`No score found for category ${category.id}`);
          return null;
        }

        const matchPercentage = score.matchPercentage;
        
        // Only include scores within the threshold range
        if (matchPercentage < minThreshold || matchPercentage > maxThreshold) {
          return null;
        }

        // Determine priority based on score ranges
        let priority;
        if (matchPercentage < 35) {
          priority = 'critical';
        } else if (matchPercentage < 55) {
          priority = 'development';
        } else {
          priority = 'strength';
        }

        // Filter recommendations based on priority
        const filteredRecommendations = (category.recommendations || []).filter(rec => {
          // For critical priorities, show all recommendations
          if (priority === 'critical') return true;
          // For development, show up to 3 recommendations
          if (priority === 'development') return category.recommendations.indexOf(rec) < 3;
          // For strengths, show only 1 recommendation
          return category.recommendations.indexOf(rec) === 0;
        });

        return {
          id: category.id,
          category: category.category,
          description: category.description,
          matchPercentage,
          priority,
          recommendations: filteredRecommendations,
          currentState: category.currentState,
          idealState: category.idealState
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sort first by priority (critical -> development -> strength)
        const priorityOrder = { critical: 0, development: 1, strength: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        // If same priority, sort by match percentage (lower first)
        if (priorityDiff === 0) {
          return a.matchPercentage - b.matchPercentage;
        }
        
        return priorityDiff;
      });
  }, [scorecard, results]);

  return {
    priorityFocusAreas,
    developmentOpportunities
  };
};

export default useReportSections; 