     "_documentation": {
    "version_control": "This field tracks the version of the assessment template",
    "structure_overview": "This template defines the structure for all assessments in the system",
    "validation_rules": {
      "required_fields": [
        "id",
        "version",
        "intro",
        "questions",
        "scoring",
        "thankYou"
      ],
    "question_rules": {
        "count": "Exactly 12 questions required",
        "options": "5 options per question required",
        "scoring": "Scores must range from 1-5, where 1 is most positive",
        "categories": "Each question must have a category and contribute to primaryCategory"
      },
      "recommendation_rules": {
        "levels": "Must include: very-high, high, medium, low, very-low",
        "format": "Use lowercase with hyphens for all recommendation levels",
        "count": "Each level should have 3-5 recommendations"
      },
      "threshold_rules": {
        "values": "Must include thresholds: 75, 60, 40, 25, 0",
        "labels": "Must use consistent labels: very-high, high, medium, low, very-low",
        "displayText": "Each threshold must have a user-friendly displayText"
      },
      "results_sections": {
        "required": [
          "specific_recommendations",
          "general_recommendations"
        ],
        "specific_recommendations": {
          "title": "Must be 'Specific Recommendations'",
          "icon": "Must be a valid icon name",
          "style": {
            "required": [
              "border",
              "hoverBg",
              "iconColor"
            ],
            "format": "Must use Tailwind CSS classes"
          }
        },
        "general_recommendations": {
          "title": "Must be 'General Recommendations'",
          "icon": "Must be a valid icon name",
          "style": {
            "required": [
              "border",
              "hoverBg",
              "iconColor"
            ],
            "format": "Must use Tailwind CSS classes"
          }
        }
      }
    },
    "best_practices": {
      "naming": {
        "categories": "Use Title Case for category names (e.g., 'Stress Management')",
        "recommendations": "Use lowercase with hyphens for recommendation levels",
        "ids": "Use kebab-case for IDs (e.g., 'team-performance-metrics')",
        "results_sections": "Use consistent titles: 'Specific Recommendations' and 'General Recommendations'"
      },
      "content": {
        "questions": "Keep questions clear and concise",
        "options": "Ensure options are mutually exclusive and cover the full range",
        "recommendations": "Make recommendations specific and actionable",
        "results_sections": "Keep section titles consistent across all assessments"
      },
      "scoring": {
        "consistency": "Maintain consistent scoring across all questions",
        "direction": "1 is always the most positive/desired response",
        "categories": "Each question should contribute to both its category and primaryCategory"
      }
    },
    "common_pitfalls": [
      "Avoid duplicate recommendation sections",
      "Don't mix case styles in recommendation levels",
      "Ensure all placeholder text is replaced",
      "Maintain consistent scoring direction",
      "Don't skip required sections"
    ],
    "scorecard_rules": {
      "required_fields": [
        "id",
        "scorecardInfo",
        "title",
        "shortDescription",
        "category",
        "visibility"
      ],
      "format": {
        "id": "Use kebab-case (e.g., 'agile-leadership-metrics')",
        "title": "Use Title Case",
        "category": "Use Title Case",
        "visibility": "Must be boolean"
      }
    },
    "examples": {
      "complete_question": {
        "id": "question-1",
        "category": "Adaptive Mindset",
        "text": "How do your leaders typically respond to unexpected changes or disruptions?",
        "number": 1,
        "type": "single_choice",
        "options": [
          {
            "text": "Often resist change and struggle to adapt plans",
            "scores": {
              "Adaptive Mindset": 5,
              "Agile Leadership": 5
            }
          },
          {
            "text": "Accept change reluctantly but have difficulty adjusting strategies",
            "scores": {
              "Adaptive Mindset": 4,
              "Agile Leadership": 4
            }
          },
          {
            "text": "Adapt to change adequately but could improve flexibility",
            "scores": {
              "Adaptive Mindset": 3,
              "Agile Leadership": 3
            }
          },
          {
            "text": "Generally embrace change and adjust plans accordingly",
            "scores": {
              "Adaptive Mindset": 2,
              "Agile Leadership": 2
            }
          },
          {
            "text": "View change as opportunity and quickly pivot strategies when needed",
            "scores": {
              "Adaptive Mindset": 1,
              "Agile Leadership": 1
            }
          }
        ]
      },
      "complete_recommendations": {
        "base": [
          "Focus on developing an agile mindset before implementing specific practices",
          "Build a culture of psychological safety to enable experimentation",
          "Ensure leaders model the behaviors they wish to see in their teams"
        ],
        "very-high": [
          "Implement a comprehensive agile leadership development program",
          "Establish regular leadership retrospectives to drive continuous improvement",
          "Create clear metrics for measuring leadership effectiveness in agility",
          "Partner leaders with agile coaches for personalized development"
        ]
      },
      "complete_thresholds": {
        "needLevel": [
          {
            "threshold": 75,
            "label": "very-high",
            "displayText": "There is a very high chance your team could benefit from agile leadership training"
          },
          {
            "threshold": 60,
            "label": "high",
            "displayText": "There is a high chance your team could benefit from agile leadership training"
          }
        ]
      },
      "complete_results_sections": {
        "specific_recommendations": {
          "title": "Specific Recommendations",
          "icon": "Compass",
          "style": {
            "border": "border-blue-200",
            "hoverBg": "hover:bg-blue-50",
            "iconColor": "text-blue-600"
          }
        },
        "general_recommendations": {
          "title": "General Recommendations",
          "icon": "CalendarCheck",
          "style": {
            "border": "border-gray-200",
            "hoverBg": "hover:bg-gray-100",
            "iconColor": "text-gray-600"
          }
        }
      },
      "complete_scorecard": {
        "id": "agile-leadership-metrics",
        "scorecardInfo": {
          "title": "Agile Leadership Metrics",
          "shortDescription": "Evaluate your organization's agile leadership capabilities and identify improvement opportunities",
          "category": "Leadership Development",
          "visibility": true
        }
      }
    },
    "update_instructions": {
      "new_scorecard": "1. Copy the complete_scorecard example. 2. Update all fields with your specific values. 3. Ensure the id is unique and in kebab-case. 4. Add the scorecard to the scorecards array.",
      "update_scorecard": "1. Locate the existing scorecard in the scorecards array. 2. Update the relevant fields while maintaining the structure. 3. Ensure all required fields are present. 4. Verify the id remains unchanged.",
      "validation": "After creating or updating a scorecard, verify: 1. All required fields are present. 2. The id is unique and properly formatted. 3. The title and category use Title Case. 4. The visibility field is a boolean."
    }
  },
  "sync_test": {
    "version": "1.0.2",
    "timestamp": "2024-04-04",
    "description": "Final sync test",
    "status": "active",
    "test_nested": {
      "field1": "value1",
      "field2": "value2"
    }
  },
  "test_sync": "This field should be added to all JSONs",
  "_setup_instructions": "IMPORTANT SETUP INSTRUCTIONS: 1. Replace all placeholder values marked with ${...}. 2. For each question in your assessment, add a corresponding category in questionRecommendations. 3. Ensure primaryCategory is set to your main scoring category. 4. Use the question's category name exactly as it appears in the questions section. 5. Each question should contribute to both its own category score and the primaryCategory score. 6. The paths in nextRoute should include the assessment ID (e.g., '/survey/your-assessment-id'). 7. Remove this _setup_instructions field when done.",
  "_question_standardization": "QUESTION STANDARDIZATION RULES: 1. All assessments must have exactly 12 questions. 2. All questions must be in English. 3. Question scoring follows this pattern: a) Each question has 5 options. b) Options are scored from 1 to 5, where 1 is the most positive/desired response and 5 is the least positive/desired response. c) Each option contributes to both its specific category score and the primaryCategory score. d) The scoring should be consistent across all questions in the assessment.",

    "_scoring_notes": {
      "primaryCategory": "This is the main category used for overall assessment scoring",
      "maxScorePerQuestion": "Maximum score per question (should be 5)",
      "recommendations": "Recommendations are organized by need level",
      "thresholds": "Thresholds determine the recommendation level based on scores",
      "results_sections": "Keep section titles consistent: 'Specific Recommendations' and 'General Recommendations'"
    },

    