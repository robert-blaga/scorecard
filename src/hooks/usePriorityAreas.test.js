import { renderHook } from '@testing-library/react';
import { usePriorityAreas } from './usePriorityAreas';

describe('usePriorityAreas', () => {
  const mockScorecard = {
    scoring: {
      report_structure: {
        sections: {
          development_opportunities: {
            categories: [
              {
                id: 'communication',
                title: 'Communication',
                category: 'Communication Skills',
                description: 'Communication effectiveness',
                recommendations: ['Improve active listening', 'Practice clear messaging'],
                currentState: 'Needs improvement',
                idealState: 'Effective communication'
              },
              {
                id: 'leadership',
                title: 'Leadership',
                category: 'Leadership Skills',
                description: 'Leadership capabilities',
                recommendations: ['Develop vision', 'Build team trust'],
                currentState: 'Developing',
                idealState: 'Strong leadership'
              }
            ]
          }
        }
      }
    }
  };

  const mockResults = {
    categoryScores: {
      'communication': {
        matchPercentage: 80
      },
      'leadership': {
        matchPercentage: 65
      }
    }
  };

  it('should handle null/undefined inputs gracefully', () => {
    const { result } = renderHook(() => usePriorityAreas(null, null));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentAreas).toEqual([]);
    expect(result.current.config).toBeDefined();
  });

  it('should handle missing categoryScores gracefully', () => {
    const { result } = renderHook(() => usePriorityAreas(mockScorecard, {}));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentAreas).toEqual([]);
  });

  it('should identify priority focus areas correctly', () => {
    const { result } = renderHook(() => usePriorityAreas(mockScorecard, mockResults));
    
    expect(result.current.priorityFocusAreas).toHaveLength(1);
    expect(result.current.priorityFocusAreas[0]).toMatchObject({
      id: 'communication',
      category: 'Communication Skills',
      description: 'Communication effectiveness',
      matchPercentage: 80,
      priority: 'critical'
    });
  });

  it('should identify development areas correctly', () => {
    const { result } = renderHook(() => usePriorityAreas(mockScorecard, mockResults));
    
    expect(result.current.developmentAreas).toHaveLength(1);
    expect(result.current.developmentAreas[0]).toMatchObject({
      id: 'leadership',
      category: 'Leadership Skills',
      description: 'Leadership capabilities',
      matchPercentage: 65,
      priority: 'development'
    });
  });

  it('should not duplicate areas between priority and development', () => {
    const highScores = {
      categoryScores: {
        'communication': {
          matchPercentage: 85
        },
        'leadership': {
          matchPercentage: 80
        }
      }
    };

    const { result } = renderHook(() => usePriorityAreas(mockScorecard, highScores));
    
    expect(result.current.priorityFocusAreas).toHaveLength(2);
    expect(result.current.developmentAreas).toHaveLength(0);
  });

  it('should sort areas by match percentage', () => {
    const multipleScores = {
      categoryScores: {
        'communication': {
          matchPercentage: 85
        },
        'leadership': {
          matchPercentage: 90
        }
      }
    };

    const { result } = renderHook(() => usePriorityAreas(mockScorecard, multipleScores));
    
    expect(result.current.priorityFocusAreas[0].matchPercentage).toBe(90);
    expect(result.current.priorityFocusAreas[1].matchPercentage).toBe(85);
  });

  it('should use default config when priority_system is not provided', () => {
    const { result } = renderHook(() => usePriorityAreas(mockScorecard, mockResults));
    
    expect(result.current.config.focus_areas.critical).toBeDefined();
    expect(result.current.config.focus_areas.development).toBeDefined();
  });

  it('should handle malformed category data', () => {
    const malformedScorecard = {
      scoring: {
        report_structure: {
          sections: {
            development_opportunities: {
              categories: [
                null,
                { id: null },
                { id: 'valid-id' }
              ]
            }
          }
        }
      }
    };

    const { result } = renderHook(() => usePriorityAreas(malformedScorecard, mockResults));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentAreas).toEqual([]);
  });
}); 