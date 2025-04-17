import { Download, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OverallAssessment from "../components/reports/basic_report/OverallAssessment";
import SpecificRecommendations from "../components/reports/basic_report/SpecificRecommendations";
import { getScorecard } from "../utils/scorecardUtils";
import { calculateScores } from "../utils/scoringService";

const ResultsScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const scorecardId = params.scorecardId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [displayText, setDisplayText] = useState(null);
  const [priorityText, setPriorityText] = useState(null);
  const [recommendationSummary, setRecommendationSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Debug current route
  console.log("Current route info:", {
    pathname: location.pathname,
    params,
    scorecardId,
    state: location.state,
  });

  useEffect(() => {
    const loadResultsData = async () => {
      try {
        // Get the answers from navigation state
        const answers = location.state?.answers;

        if (!answers) {
          throw new Error("No answers found in navigation state");
        }

        if (!scorecardId) {
          throw new Error("No scorecard ID found in URL");
        }

        // Load the scorecard data
        const scorecardData = await getScorecard(scorecardId);

        if (!scorecardData) {
          throw new Error("Failed to load scorecard data");
        }

        // Process the results using our scoring service
        const processedResults = calculateScores(answers, scorecardData);
        const primaryCategory = scorecardData.basic_scoring.primaryCategory;
        const score =
          processedResults.interpretation[primaryCategory].percentage;

        // Process thresholds and set states
        const [
          selectedThreshold,
          selectedPriority,
          selectedRecommendation,
          selectedSpecificRecommendations,
        ] = processThresholds(score, scorecardData);

        setPercentage(score);
        setDisplayText(selectedThreshold.displayText);
        setPriorityText(selectedPriority.displayText);
        setRecommendationSummary(selectedRecommendation.text);
        setRecommendations(selectedSpecificRecommendations.recommendations);
      } catch (err) {
        console.error("Error processing results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResultsData();
  }, [location.state, scorecardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Processing results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top navigation bar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider">BRAINIUP</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400 text-sm">
                {scorecardId?.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Row 1: Assessment and Recommendations */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <OverallAssessment
                score={percentage}
                displayText={displayText}
                priorityLevel={priorityText}
                recommendationSummary={recommendationSummary}
              />
            </div>

            <div className="bg-white rounded-2xl p-8">
              <SpecificRecommendations recommendations={recommendations} />
            </div>

            {/* Row 2: Action Buttons */}
            <div className="rounded-xl">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors group"
                onClick={() =>
                  navigate("/identify", {
                    state: {
                      scorecardId,
                      answers: location.state?.answers,
                      results: {
                        scores: percentage,
                        interpretation: {
                          displayText,
                          priorityText,
                          recommendationSummary,
                        },
                        recommendations,
                      },
                    },
                  })
                }
              >
                <span>Extended Report</span>
                <Download className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="rounded-xl">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-4 rounded-xl hover:bg-gray-700 transition-colors group"
                onClick={() =>
                  window.open("https://brainiup.com/contact", "_blank")
                }
              >
                <span>Get Consultation</span>
                <MessageSquare className="w-4 h-4 group-hover:transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function to process thresholds
const processThresholds = (score, scorecardData) => {
  const thresholdTypes = [
    "needPercentage",
    "priorityLevel",
    "summary",
    "recommendations",
  ].map((type) => ({
    data: [
      ...(scorecardData.basic_scoring.overview_thresholds[type] ||
        scorecardData.basic_scoring.recommendations_summaries[type] ||
        []),
    ].sort((a, b) => b.threshold - a.threshold),
  }));

  return thresholdTypes.map(({ data }) => {
    for (let i = 0; i < data.length - 1; i++) {
      if (score > data[i + 1].threshold && score <= data[i].threshold) {
        return data[i];
      }
    }
    return data[data.length - 1];
  });
};

export default ResultsScreen;
