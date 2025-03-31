/**
 * Survey Results Structure Documentation
 * This file documents the expected data structure for survey results
 */

/** Response option for survey questions */
interface ResponseOption {
  value: number;
  label: string;
}

/** Survey instructions shown on the intro page */
interface SurveyInstructions {
  main: string;
  scale: string;
  scoring: string;
}

/** Question Types */
type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'rating';

/** Survey Question */
interface SurveyQuestion {
  /** Unique identifier for the question */
  id: string;
  /** The question text shown to the user */
  text: string;
  /** The stage/category this question belongs to */
  stage: string;
  /** The order number of this question in the survey */
  number: number;
  /** The type of question - determines how it's rendered and scored */
  type: QuestionType;
}

interface SurveyResultsStructure {
  /** Key metrics display at the top of the results page */
  metrics_summary?: {
    title: string;
    metrics: Array<{
      key: string;
      label: string;
      calculation: 'average_of_all_scores' | 'highest_scoring_stage' | 'percentage_completed';
    }>;
  };

  /** Progress bars visualization */
  progress_bars?: {
    title: string;
    description: string;
    scale_description: string;
    max_score: number;
  };

  /** Optional quadrant matrix visualization */
  quadrant_matrix?: {
    title: string;
    position: {
      x: number;
      y: number;
    };
    xAxisLabel: string;
    yAxisLabel: string;
    quadrants: Array<{
      title: string;
      description: string;
    }>;
    description: string;
  };

  /** Score grid display */
  score_grid?: {
    title: string;
    max_score: number;
    columns: number;
  };

  /** Call to action card */
  call_to_action?: {
    title: string;
    description: string;
    button_text: string;
    button_url: string;
    show_arrow?: boolean;
  };

  /** Item breakdown for details tab */
  item_breakdown?: {
    title: string;
    group_by: string;
    show_scores: boolean;
    max_score: number;
  };

  /** Recommendations for recommendations tab */
  recommendations?: {
    title: string;
    rules: Array<{
      condition: string;
      stage: string;
      text: string;
      tips: string[];
    }>;
  };
}

/**
 * Example Usage:
 * 
 * In your tuckman.json:
 * {
 *   "scoring": {
 *     "results_structure": {
 *       "metrics_summary": {
 *         "title": "Key Metrics",
 *         "metrics": [...]
 *       },
 *       "progress_bars": {
 *         "title": "Stage Characteristics",
 *         "description": "...",
 *         "scale_description": "Scale: 1 (Low) to 5 (High)",
 *         "max_score": 5
 *       }
 *       // ... add other components as needed
 *     }
 *   }
 * }
 */

export interface SurveyData {
  metadata: {
    id: string;
    title: string;
    description: string;
    timeToComplete: string;
    questionCount: number;
  };
  instructions: SurveyInstructions;
  responseOptions: ResponseOption[];
  questions: SurveyQuestion[];
  scoring: {
    stages: Array<{
      name: string;
      title: string;
      description: string;
    }>;
    calculation: {
      method: string;
      maxScorePerQuestion: number;
      questionsPerStage: number;
    };
    results_structure: SurveyResultsStructure;
  };
} 