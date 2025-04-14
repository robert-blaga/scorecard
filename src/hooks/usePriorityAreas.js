import { useMemo } from 'react';

const DEFAULT_CONFIG = {
  focus_areas: {
    critical: {
      id: 'priority_focus',
      label: 'Priority Focus Areas',
      description: 'Areas requiring immediate attention and development',
      threshold: 75,
      style: {
        border: 'border-blue-500',
        background: 'bg-blue-50',
        iconColor: 'text-blue-900'
      }
    },
    development: {
      id: 'development_opportunities',
      label: 'Development Opportunities',
      description: 'Key areas identified for professional growth',
      threshold: 60,
      style: {
        border: 'border-blue-300',
        background: 'bg-blue-50',
        iconColor: 'text-blue-700'
      }
    }
  }
};

export const usePriorityAreas = (scorecard, results) => {
  return useMemo(() => {
    if (!scorecard || !results?.categoryScores) {
      return {
        priorityFocusAreas: [],
        developmentAreas: [],
        config: DEFAULT_CONFIG
      };
    }

    const config = scorecard?.priority_system || DEFAULT_CONFIG;
    
    const processAreas = (categoryScores, threshold, priorityType) => {
      return Object.entries(categoryScores)
        .filter(([_, score]) => score?.matchPercentage >= threshold)
        .map(([categoryId, score]) => {
          const categoryConfig = scorecard.basic_scoring?.report_structure?.sections?.development_opportunities?.categories
            ?.find(cat => cat?.id === categoryId);

          if (!categoryConfig) return null;

          return {
            id: categoryId,
            category: categoryConfig.category || categoryConfig.title,
            description: categoryConfig.description,
            matchPercentage: score.matchPercentage,
            priority: priorityType,
            recommendations: categoryConfig.recommendations || [],
            currentState: categoryConfig.currentState,
            idealState: categoryConfig.idealState
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);
    };

    const priorityFocusAreas = processAreas(
      results.categoryScores,
      config.focus_areas.critical.threshold,
      'critical'
    );

    const developmentAreas = processAreas(
      results.categoryScores,
      config.focus_areas.development.threshold,
      'development'
    ).filter(area => !priorityFocusAreas.some(priority => priority.id === area.id));

    return {
      priorityFocusAreas,
      developmentAreas,
      config
    };
  }, [scorecard, results]);
};

export default usePriorityAreas; 