import { useMemo } from 'react';

export const PRIORITY_THRESHOLDS = {
  critical: 40,
  development: 70
};

export const useDevelopmentOpportunities = (assessmentData) => {
  const opportunities = useMemo(() => {
    if (!assessmentData) return [];

    return Object.entries(assessmentData)
      .map(([category, data]) => {
        const matchPercentage = data.score || 0;
        let priority;

        if (matchPercentage < PRIORITY_THRESHOLDS.critical) {
          priority = 'critical';
        } else if (matchPercentage < PRIORITY_THRESHOLDS.development) {
          priority = 'development';
        } else {
          priority = 'strength';
        }

        return {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          category,
          description: data.description || `Improve your ${category.toLowerCase()} skills and capabilities`,
          matchPercentage,
          priority,
          recommendations: data.recommendations || [],
          idealState: data.idealState,
          currentState: data.currentState
        };
      })
      .sort((a, b) => {
        // Sort by priority (critical -> development -> strength) and then by match percentage (lowest first)
        const priorityOrder = { critical: 0, development: 1, strength: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return priorityDiff === 0 ? a.matchPercentage - b.matchPercentage : priorityDiff;
      });
  }, [assessmentData]);

  const stats = useMemo(() => {
    if (!opportunities.length) {
      return {
        criticalAreas: 0,
        developmentAreas: 0,
        strengthAreas: 0,
        matchPercentage: 0
      };
    }

    // Count areas by priority
    const counts = opportunities.reduce((acc, opp) => {
      switch (opp.priority) {
        case 'critical':
          acc.criticalAreas++;
          break;
        case 'development':
          acc.developmentAreas++;
          break;
        case 'strength':
          acc.strengthAreas++;
          break;
      }
      return acc;
    }, {
      criticalAreas: 0,
      developmentAreas: 0,
      strengthAreas: 0
    });

    // Calculate average match percentage
    const matchPercentage = opportunities.reduce((sum, opp) => sum + opp.matchPercentage, 0) / opportunities.length;

    return {
      ...counts,
      matchPercentage: Number(matchPercentage.toFixed(2))
    };
  }, [opportunities]);

  const getRecommendationsForCategory = (categoryId) => {
    const opportunity = opportunities.find(opp => opp.id === categoryId);
    return opportunity?.recommendations || [];
  };

  const getPriorityLevel = (matchPercentage) => {
    if (matchPercentage < PRIORITY_THRESHOLDS.critical) return 'critical';
    if (matchPercentage < PRIORITY_THRESHOLDS.development) return 'development';
    return 'strength';
  };

  return {
    opportunities,
    stats,
    getRecommendationsForCategory,
    getPriorityLevel,
    PRIORITY_THRESHOLDS
  };
};

export default useDevelopmentOpportunities; 