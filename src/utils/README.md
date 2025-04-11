# Scorecard Scoring Service

This service provides a flexible, scorecard-agnostic scoring system for assessments in the BrainiUp Pulse application. All configuration happens in the scorecard JSON files, making the service completely flexible without requiring code changes.

## Overview

The scoring service is designed to work with any type of scorecard format, calculating scores based on user responses and providing meaningful interpretations and recommendations based on those scores. Instead of hard-coding scoring logic, the service dynamically uses configuration from the scorecard JSON.

## Key Components

### 1. Scoring Service (`scoringService.js`)

The core service that calculates scores from user responses:

- `calculateScores(responses, scorecard)`: Calculates raw scores, interpretations, and recommendation levels
- `generateReport(assessmentResults, scorecard)`: Produces a detailed report with recommendations

### 2. Scorecard Hook (`useScorecard.js`)

A React hook that provides an easy way to use the scoring service in components:

- Loads scorecard data
- Manages scoring calculations
- Handles saving/loading results
- Provides error handling and loading states

### 3. Results Component (`ScorecardResults.jsx`)

A reusable component for displaying scorecard results:

- Shows overall scores and interpretations
- Displays detailed recommendations
- Provides action buttons for users

## Scorecard JSON Configuration

All scoring logic is now defined in the scorecard JSON file, making it easy to create new assessments without changing code. Here's how to structure the scoring configuration:

```json
{
  "id": "your-scorecard-id",
  "questions": {
    "items": [
      // Questions with options and scores...
    ]
  },
  "scoring": {
    "primaryCategory": "main_score_category",
    "maxScorePerQuestion": 5,
    "thresholds": {
      "needLevel": [
        { "threshold": 75, "label": "Very High Need" },
        { "threshold": 60, "label": "High Need" },
        { "threshold": 40, "label": "Moderate Need" },
        { "threshold": 25, "label": "Low Need" },
        { "threshold": 0, "label": "Very Low Need" }
      ],
      "recommendationLevel": [
        { "threshold": 70, "label": "high" },
        { "threshold": 40, "label": "medium" },
        { "threshold": 0, "label": "low" }
      ]
    },
    "summaries": [
      {
        "threshold": 75,
        "text": "Your score indicates a very high need for this training..."
      },
      // More summary thresholds...
    ],
    "recommendations": {
      "base": [
        "General recommendation that applies to all levels",
        "Another base recommendation"
      ],
      "Very High Need": [
        "Specific recommendation for very high need",
        "Another recommendation for very high need"
      ],
      // Recommendations for other need levels...
    }
  }
}
```

### Configuration Elements

1. `primaryCategory`: The main score category to use for interpretation
2. `maxScorePerQuestion`: The maximum possible score per question
3. `thresholds.needLevel`: Defines labels for different score thresholds
4. `thresholds.recommendationLevel`: Defines recommendation priority levels
5. `summaries`: Text explanations for different score levels
6. `recommendations`: Need-level specific recommendations

## Adding a New Scorecard

To create a new assessment type:

1. Create a new JSON file in the `src/data` directory with your scorecard content
2. Add the scoring configuration section
3. Define your questions with scores

That's it! No changes to the scoring service are needed.

## Usage Example

```jsx
import useScorecard from '../hooks/useScorecard';
import ScorecardResults from '../components/ScorecardResults';

function YourComponent() {
  const {
    scorecard,
    loading,
    error,
    results,
    report,
    calculateResults,
    saveResults
  } = useScorecard('your-scorecard-id');
  
  const handleSubmit = (userResponses) => {
    const calculatedResults = calculateResults(userResponses);
    saveResults();
    // Show results
  };
  
  if (results && report) {
    return <ScorecardResults results={results} report={report} scorecardId={scorecard.id} />;
  }
  
  // Render your assessment form
}
```

## Fallback Behavior

If certain configuration elements are missing, the scoring service will fall back to reasonable defaults:

- If no `primaryCategory` is defined, it will use the first score category
- If no `maxScorePerQuestion` is defined, it will calculate it from the options
- If no thresholds are defined, it will use sensible default breakpoints
- If no summaries or recommendations are defined, it will use generic text 