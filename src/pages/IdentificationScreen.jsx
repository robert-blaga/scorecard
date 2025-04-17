import { useLocation, useNavigate } from "react-router-dom";
import UserIdentification from "../components/reports/extended_report/identification/IdentificationParent";

export default function IdentificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get complete survey data from location state
  const sessionData = {
    scorecardId: location.state?.scorecardId,
    answers: location.state?.answers || {},
    results: {
      scores: location.state?.results?.scores || {},
      totalScore: location.state?.results?.totalScore,
      interpretation: location.state?.results?.interpretation,
      recommendations: location.state?.results?.recommendations || [],
    },
  };

  console.log("Identification Screen - Survey Data:", sessionData);

  const handleComplete = (formData) => {
    // Navigate to the extended report with all data
    if (sessionData.scorecardId) {
      navigate(`/extended-report/${sessionData.scorecardId}`, {
        state: {
          ...sessionData,
          userData: formData,
        },
        replace: true,
      });
    } else {
      navigate("/library", { replace: true });
    }
  };

  // If no survey data, redirect to library
  if (!location.state?.scorecardId || !location.state?.answers) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-4">No survey data found.</div>
        <button
          onClick={() => navigate("/library")}
          className="text-deep-purple hover:text-deep-purple-600"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <UserIdentification
        onComplete={handleComplete}
        sessionData={sessionData}
      />
    </div>
  );
}
