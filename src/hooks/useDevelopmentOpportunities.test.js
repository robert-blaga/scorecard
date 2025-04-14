import { renderHook } from '@testing-library/react';
import { useDevelopmentOpportunities } from './useDevelopmentOpportunities';

describe('useDevelopmentOpportunities', () => {
  const mockAssessmentData = {
    'Communication': {
      score: 35,
      description: 'Communication skills assessment',
      recommendations: ['Practice active listening', 'Improve presentation skills'],
      idealState: 'Effective communicator with strong presentation skills',
      currentState: 'Basic communication skills with room for improvement'
    },
    'Leadership': {
      score: 65,
      description: 'Leadership capabilities assessment',
      recommendations: ['Develop strategic thinking', 'Enhance team management'],
      idealState: 'Strategic leader with strong team management',
      currentState: 'Developing leadership skills with some experience'
    },
    'Technical Skills': {
      score: 85,
      description: 'Technical proficiency assessment',
      recommendations: ['Stay updated with latest technologies'],
      idealState: 'Expert in technical domain',
      currentState: 'Strong technical foundation'
    }
  };

  it('should handle null/undefined input gracefully', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(null));
    expect(result.current.opportunities).toEqual([]);
    expect(result.current.stats).toEqual({
      criticalAreas: 0,
      developmentAreas: 0,
      strengthAreas: 0,
      matchPercentage: 0
    });
  });

  it('should correctly categorize opportunities by priority', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    expect(result.current.opportunities).toHaveLength(3);
    
    // Check priorities
    expect(result.current.opportunities[0].priority).toBe('critical');
    expect(result.current.opportunities[1].priority).toBe('development');
    expect(result.current.opportunities[2].priority).toBe('strength');
  });

  it('should calculate correct statistics', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    expect(result.current.stats).toEqual({
      criticalAreas: 1,
      developmentAreas: 1,
      strengthAreas: 1,
      matchPercentage: 61.67 // (35 + 65 + 85) / 3
    });
  });

  it('should sort opportunities by priority and match percentage', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    const opportunities = result.current.opportunities;
    
    // Check order: critical (35%) -> development (65%) -> strength (85%)
    expect(opportunities[0].matchPercentage).toBe(35);
    expect(opportunities[1].matchPercentage).toBe(65);
    expect(opportunities[2].matchPercentage).toBe(85);
  });

  it('should correctly get recommendations for a category', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    const communicationRecs = result.current.getRecommendationsForCategory('communication');
    expect(communicationRecs).toEqual(['Practice active listening', 'Improve presentation skills']);
    
    const invalidRecs = result.current.getRecommendationsForCategory('invalid');
    expect(invalidRecs).toEqual([]);
  });

  it('should correctly determine priority level', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    expect(result.current.getPriorityLevel(30)).toBe('critical');
    expect(result.current.getPriorityLevel(50)).toBe('development');
    expect(result.current.getPriorityLevel(80)).toBe('strength');
  });

  it('should expose priority thresholds', () => {
    const { result } = renderHook(() => useDevelopmentOpportunities(mockAssessmentData));
    
    expect(result.current.PRIORITY_THRESHOLDS).toEqual({
      critical: 40,
      development: 70
    });
  });
}); 