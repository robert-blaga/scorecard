/**
 * Scoring Service
 * Calculates scores from user responses for any scorecard
 */

/**
 * Calculate scores from user responses
 * @param {Object} responses - User responses with scores in format { questionId: selectedOptionIndex }
 * @param {Object} scorecard - The scorecard data containing questions and scoring rules
 * @returns {Object} - Object containing calculated scores and interpretation
 */
export function calculateScores(responses, scorecard) {
  if (
    !responses ||
    !scorecard?.questions?.items ||
    !scorecard?.basic_scoring?.primaryCategory
  ) {
    console.error("Invalid responses or scorecard data", {
      hasResponses: !!responses,
      hasQuestions: !!scorecard?.questions?.items,
      hasBasicScoring: !!scorecard?.basic_scoring,
      hasPrimaryCategory: !!scorecard?.basic_scoring?.primaryCategory,
    });
    throw new Error("Invalid responses or scorecard data");
  }

  const primaryCategory = scorecard.basic_scoring.primaryCategory;

  // Initialize total score
  let totalScore = 0;
  const totalQuestions = scorecard.questions.items.length;

  // Process each question response
  Object.entries(responses).forEach(([questionId, selectedOptionIndex]) => {
    const question = scorecard.questions.items.find((q) => q.id === questionId);
    if (question && question.options[selectedOptionIndex]) {
      const option = question.options[selectedOptionIndex];
      // Add the score from the selected option using the primary category
      totalScore += option.scores[primaryCategory] || 0;
    }
  });

  // Calculate percentage score
  const maxScorePerQuestion = scorecard.basic_scoring.maxScorePerQuestion || 4;
  const maxPossibleScore = totalQuestions * maxScorePerQuestion;
  const percentage = (totalScore / maxPossibleScore) * 100;

  // Get interpretation based on percentage
  const interpretation = getScoreInterpretation(
    percentage,
    scorecard.basic_scoring.overview_thresholds.needPercentage
  );

  // Create a dynamic result object using the primary category
  const rawScores = { [primaryCategory]: totalScore };
  const interpretationResult = {
    [primaryCategory]: {
      score: totalScore,
      percentage: Math.round(percentage),
      needLevel: interpretation.label,
      summary: interpretation.displayText,
    },
  };

  return {
    rawScores,
    interpretation: interpretationResult,
    recommendationLevel: interpretation.label,
  };
}

/**
 * Get interpretation level based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @param {Object[]} thresholds - Array of threshold objects with threshold and label
 * @returns {Object} Matching threshold object
 */
function getScoreInterpretation(percentage, thresholds) {
  if (!thresholds || !Array.isArray(thresholds)) {
    return {
      threshold: 0,
      label: "unknown",
      displayText: "Could not determine score interpretation",
    };
  }

  // Sort thresholds from highest to lowest
  const sortedThresholds = [...thresholds].sort(
    (a, b) => b.threshold - a.threshold
  );

  // Find first threshold that percentage is less than or equal to
  return (
    sortedThresholds.find((t) => percentage <= t.threshold) ||
    sortedThresholds[sortedThresholds.length - 1]
  );
}

/**
 * Generate a detailed report with recommendations based on assessment results
 * @param {Object} assessmentResults - The results from calculateScores
 * @param {Object} scorecard - The original scorecard data
 * @returns {Object} - Detailed report with recommendations
 */
export function generateReport(assessmentResults, scorecard) {
  if (!assessmentResults || !scorecard) {
    console.error("Invalid assessment results or scorecard");
    return { error: "Invalid assessment results or scorecard" };
  }

  const { interpretation, recommendationLevel } = assessmentResults;

  // Base report structure
  const report = {
    scorecardType: scorecard.id,
    timestamp: new Date().toISOString(),
    overallRecommendation: recommendationLevel,
    scores: interpretation,
    specificRecommendations: [],
  };

  // Get recommendations based on the need level
  if (scorecard.basic_scoring?.recommendations_summaries?.recommendations) {
    const recommendations =
      scorecard.basic_scoring.recommendations_summaries.recommendations[0];
    if (recommendations[recommendationLevel]) {
      report.specificRecommendations = recommendations[recommendationLevel].map(
        (text) => ({
          title: "Recommendation",
          description: text,
        })
      );
    }
  }

  return report;
}
