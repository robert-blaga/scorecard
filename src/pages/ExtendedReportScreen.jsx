import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ExtendedReportPDF from "../components/pdf/ExtendedReportPDF";
import CallToAction from "../components/reports/extended_report/extended_components/CallToAction";
import ExtendedOverallAssessment from "../components/reports/extended_report/extended_components/ExtendedOverallAssessment";
import ExtendedScoringMagazine from "../components/reports/extended_report/extended_components/ExtendedScoringMagazine";
import QuestionAnalysis from "../components/reports/extended_report/extended_components/QuestionAnalysis";
import { getScorecard } from "../utils/scorecardUtils";
import { calculateScores } from "../utils/scoringService";

// Helper function to process thresholds - same as in ResultsScreen
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

export default function ExtendedReportScreen() {
  const location = useLocation();
  const params = useParams();
  const scorecardId = params.scorecardId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [maxScorePerQuestion, setMaxScorePerQuestion] = useState(4);
  const [primaryCategory, setPrimaryCategory] = useState("maturity");
  const [displayText, setDisplayText] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [recommendationSummary, setRecommendationSummary] = useState("");
  const [scorecardData, setScorecardData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadExtendedReport = async () => {
      try {
        // Get the answers and user data from navigation state
        const answers = location.state?.answers;
        const userData = location.state?.userData;

        if (!answers) {
          throw new Error("No answers found in navigation state");
        }

        if (!scorecardId) {
          throw new Error("No scorecard ID found in URL");
        }

        if (!userData) {
          throw new Error("No user data found in navigation state");
        }

        // Load the scorecard data
        const scorecardData = await getScorecard(scorecardId);

        if (!scorecardData) {
          throw new Error("Failed to load scorecard data");
        }

        // Process the results using our scoring service
        const processedResults = calculateScores(answers, scorecardData);
        const primaryCat = scorecardData.basic_scoring.primaryCategory;
        const calculatedScore =
          processedResults.interpretation[primaryCat].percentage;

        // Process thresholds to get correct text and levels
        const [selectedThreshold, selectedPriority, selectedRecommendation] =
          processThresholds(calculatedScore, scorecardData);

        // Set the assessment details
        setScore(calculatedScore);
        setQuestions(scorecardData.questions.items);
        setAnswers(answers);
        setMaxScorePerQuestion(
          scorecardData.basic_scoring.maxScorePerQuestion || 4
        );
        setPrimaryCategory(primaryCat);
        setScorecardData(scorecardData);

        // Set the overall assessment information using processed thresholds
        setDisplayText(selectedThreshold.displayText);
        setPriorityLevel(selectedPriority.displayText);
        setRecommendationSummary(selectedRecommendation.text);
      } catch (err) {
        console.error("Error processing extended report:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExtendedReport();
  }, [location.state, scorecardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading extended report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-gray-900 border-b border-gray-800"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span
                className={`font-bold tracking-wider transition-colors duration-300 ${
                  isScrolled ? "text-gray-50" : "text-gray-900"
                }`}
              >
                BRAINIUP
              </span>
              <span
                className={`transition-colors duration-300 ${
                  isScrolled ? "text-gray-500" : "text-gray-400"
                }`}
              >
                /
              </span>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isScrolled ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {scorecardData?.intro?.title || "Assessment Report"}
              </span>
            </div>
            <div
              className={`text-sm transition-colors duration-300 ${
                isScrolled ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p>contact@brainiup.com</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Magazine Header - Full width splash */}
      <div className="relative h-48 sm:h-64 mb-8 sm:mb-16 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 opacity-10"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 max-w-7xl mx-auto">
          <div className="text-white text-3xl sm:text-5xl font-serif mb-2 sm:mb-4 font-bold">
            {scorecardData?.intro?.title || "Assessment Report"}
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            {scorecardData?.extended_scoring?.title ||
              scorecardData?.basic_scoring?.title}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="h-px w-8 sm:w-12 bg-white/30" />
            <div className="text-white/70 font-light text-sm sm:text-base">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Magazine-style Extended Scoring */}
        {scorecardData && (
          <ExtendedScoringMagazine
            score={score}
            scorecardData={scorecardData}
            displayText={displayText}
            priorityLevel={priorityLevel}
            recommendationSummary={recommendationSummary}
            questions={questions}
            answers={answers}
            primaryCategory={primaryCategory}
          />
        )}

        {/* Overall Assessment */}
        <ExtendedOverallAssessment
          score={score}
          displayText={displayText}
          priorityLevel={priorityLevel}
          recommendationSummary={recommendationSummary}
        />

        {/* Question Analysis */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Question Analysis
          </h2>
          <QuestionAnalysis
            questions={questions}
            userAnswers={answers}
            maxScorePerQuestion={maxScorePerQuestion}
            primaryCategory={primaryCategory}
          />
        </div>
      </main>

      {/* Call to Action */}
      <div className="mt-16">
        <CallToAction
          score={score}
          scorecardData={scorecardData}
          displayText={displayText}
          priorityLevel={priorityLevel}
          recommendationSummary={recommendationSummary}
          questions={questions}
          answers={answers}
          primaryCategory={primaryCategory}
          ExtendedReportPDF={ExtendedReportPDF}
        />
      </div>
    </div>
  );
}
