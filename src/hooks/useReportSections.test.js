import { renderHook } from '@testing-library/react';
import { useReportSections } from './useReportSections';

describe('useReportSections', () => {
  const mockScorecard = {
    scoring: {
      report_structure: {
        sections: {
          critical_focus: {
            threshold: 70,
            recommendationLevel: 'high'
          },
          development_opportunities: {
            minThreshold: 30,
            maxThreshold: 69,
            categories: [
              {
                id: 'communication-style',
                title: 'Communication Style',
                description: 'Test description'
              },
              {
                id: 'leadership',
                title: 'Leadership',
                description: 'Test description'
              }
            ]
          }
        }
      }
    }
  };

  const mockResults = {
    categoryScores: {
      'communication-style': {
        matchPercentage: 75
      },
      'leadership': {
        matchPercentage: 45
      }
    }
  };

  it('should handle null/undefined inputs gracefully', () => {
    const { result } = renderHook(() => useReportSections(null, null));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentOpportunities).toEqual([]);
  });

  it('should handle missing categoryScores gracefully', () => {
    const { result } = renderHook(() => useReportSections(mockScorecard, {}));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentOpportunities).toEqual([]);
  });

  it('should identify priority focus areas correctly', () => {
    const { result } = renderHook(() => useReportSections(mockScorecard, mockResults));
    
    expect(result.current.priorityFocusAreas).toHaveLength(1);
    expect(result.current.priorityFocusAreas[0]).toEqual({
      id: 'communication-style',
      title: 'Communication Style',
      description: 'Test description',
      matchPercentage: 75,
      priority: 'high'
    });
  });

  it('should identify development opportunities correctly', () => {
    const { result } = renderHook(() => useReportSections(mockScorecard, mockResults));
    
    expect(result.current.developmentOpportunities).toHaveLength(1);
    expect(result.current.developmentOpportunities[0]).toEqual({
      id: 'leadership',
      title: 'Leadership',
      description: 'Test description',
      matchPercentage: 45,
      priority: 'medium'
    });
  });

  it('should handle malformed category data', () => {
    const malformedScorecard = {
      scoring: {
        report_structure: {
          sections: {
            critical_focus: {
              threshold: 70,
              recommendationLevel: 'high'
            },
            development_opportunities: {
              minThreshold: 30,
              maxThreshold: 69,
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

    const { result } = renderHook(() => useReportSections(malformedScorecard, mockResults));
    expect(result.current.developmentOpportunities).toEqual([]);
  });

  it('should handle missing sections gracefully', () => {
    const incompleteScorecard = {
      scoring: {
        report_structure: {
          sections: {}
        }
      }
    };

    const { result } = renderHook(() => useReportSections(incompleteScorecard, mockResults));
    expect(result.current.priorityFocusAreas).toEqual([]);
    expect(result.current.developmentOpportunities).toEqual([]);
  });
}); 