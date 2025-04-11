import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getScorecard } from '../utils/scorecardUtils';

export default function ThankYouScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Extract scorecard ID from the URL parameters or state
  const { id } = useParams();
  const scorecardId = id || (location.state && location.state.scorecardId);
  
  useEffect(() => {
    // Clear any survey-specific localStorage data
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('survey_answers') || key.includes('survey_current_question')
    );
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Load the scorecard if we have an ID
    const fetchScorecard = async () => {
      if (scorecardId) {
        try {
          const data = await getScorecard(scorecardId);
          setScorecard(data);
        } catch (error) {
          console.error('Error loading scorecard:', error);
        }
      }
      setLoading(false);
    };
    
    fetchScorecard();
  }, [scorecardId]);
  
  const thankYouData = scorecard?.thankYou;

  // Show loading indicator while fetching the scorecard
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-deep-purple/10 p-3">
            <CheckCircle className="h-12 w-12 text-deep-purple" />
          </div>
        </div>
        
        <h2 className="mt-6 text-3xl font-serif text-gray-900">
          {thankYouData?.title || "Mulțumim pentru completarea chestionarului!"}
        </h2>
        
        <p className="text-sm text-gray-600 mb-4">
          {thankYouData?.message || "Răspunsurile tale au fost înregistrate cu succes. Poți închide această pagină în siguranță."}
        </p>
        
        {thankYouData?.nextSteps && (
          <p className="text-sm text-gray-500 mb-6">
            {thankYouData.nextSteps}
          </p>
        )}
        
        {thankYouData?.buttonText && (
          <button
            onClick={() => {
              // Check if the link is external (starts with http or https)
              if (thankYouData.buttonLink?.startsWith('http')) {
                window.open(thankYouData.buttonLink, '_blank');
              } else {
                navigate(thankYouData.buttonLink || "/library");
              }
            }}
            className="w-full px-6 py-3 rounded-lg font-medium transition-colors bg-deep-purple text-white hover:bg-deep-purple-600"
          >
            {thankYouData.buttonText}
          </button>
        )}
      </div>
    </div>
  );
} 