import { useState, useEffect } from 'react';
import { getScorecard } from '../utils/scorecardUtils';
import { calculateScores, generateReport } from '../utils/scoringService';

/**
 * A React hook for loading scorecards and calculating scores
 * 
 * @param {string} scorecardId - The ID of the scorecard to load
 * @returns {Object} - An object with scorecard data, loading state, and scoring functions
 */
export default function useScorecard(scorecardId) {
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [report, setReport] = useState(null);

  // Load the scorecard data and saved results
  useEffect(() => {
    async function loadScorecard() {
      if (!scorecardId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Load scorecard data
        const data = await getScorecard(scorecardId);
        if (!data) {
          throw new Error(`Scorecard with ID "${scorecardId}" not found`);
        }
        setScorecard(data);
        
        // Load saved results if they exist
        try {
          const savedData = localStorage.getItem(`scorecard_result_${scorecardId}`);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.results && parsedData.report) {
              setResults(parsedData.results);
              setReport(parsedData.report);
            }
          }
        } catch (err) {
          console.error('Error loading saved results:', err);
          // Don't set error state for saved results loading failure
          // Just continue without the saved results
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading scorecard');
        setLoading(false);
      }
    }
    
    loadScorecard();
  }, [scorecardId]);

  /**
   * Calculate scores based on user responses
   * 
   * @param {Object} responses - The user's responses { questionId: selectedOptionIndex }
   * @returns {Object} - The calculated scores and interpretation
   */
  const calculateResults = (responses) => {
    if (!scorecard) {
      setError('Cannot calculate results: Scorecard not loaded');
      return null;
    }
    
    try {
      // Calculate scores using the scoring service
      const calculatedResults = calculateScores(responses, scorecard);
      if (!calculatedResults) {
        throw new Error('Failed to calculate results');
      }
      setResults(calculatedResults);
      
      // Generate a detailed report
      const detailedReport = generateReport(calculatedResults, scorecard);
      if (!detailedReport) {
        throw new Error('Failed to generate report');
      }
      setReport(detailedReport);
      
      // Save results immediately
      const savedResults = {
        scorecardId,
        timestamp: new Date().toISOString(),
        results: calculatedResults,
        report: detailedReport
      };
      localStorage.setItem(`scorecard_result_${scorecardId}`, JSON.stringify(savedResults));
      
      return calculatedResults;
    } catch (err) {
      setError(err.message || 'Error calculating scores');
      return null;
    }
  };

  return {
    scorecard,
    loading,
    error,
    results,
    report,
    calculateResults,
    saveResults: () => {
      if (!results || !report) return false;
      try {
        localStorage.setItem(`scorecard_result_${scorecardId}`, JSON.stringify({
          scorecardId,
          timestamp: new Date().toISOString(),
          results,
          report
        }));
        return true;
      } catch (err) {
        console.error('Error saving results:', err);
        return false;
      }
    },
    loadSavedResults: () => {
      try {
        const savedData = localStorage.getItem(`scorecard_result_${scorecardId}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setResults(parsedData.results);
          setReport(parsedData.report);
          return parsedData;
        }
        return null;
      } catch (err) {
        console.error('Error loading saved results:', err);
        return null;
      }
    },
    clearSavedResults: () => {
      try {
        localStorage.removeItem(`scorecard_result_${scorecardId}`);
        setResults(null);
        setReport(null);
        return true;
      } catch (err) {
        console.error('Error clearing saved results:', err);
        return false;
      }
    }
  };
} 