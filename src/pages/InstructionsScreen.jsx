import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import scorecardsData from "../data/index.json";
import { getScorecard } from "../utils/scorecardUtils";

export default function InstructionsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const scorecardIndex = scorecardsData.scorecards.find(
          (sc) => sc.id === id
        );

        if (!scorecardIndex) {
          console.error("Scorecard not found in index");
          setLoading(false);
          return;
        }

        const scorecardData = await getScorecard(id);
        setScorecard(scorecardData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading scorecard:", error);
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!scorecard || !scorecard.intro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-red-600">
          Scorecard not found or missing intro data
        </div>
      </div>
    );
  }

  const introData = scorecard.intro;

  return (
    <div className={`min-h-screen`}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-5xl font-serif text-indigo-700 font-bold">
            {introData.title}
          </h1>
          <p className="mt-4 mb-12 text-gray-600">{introData.subtitle}</p>

          <button
            onClick={() => navigate(introData.nextRoute)}
            className="w-full max-w-md mx-auto px-8 py-3 rounded-xl font-medium bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {introData.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
