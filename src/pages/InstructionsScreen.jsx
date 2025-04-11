import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import scorecardsData from '../data/index.json';
import { getScorecard } from '../utils/scorecardUtils';

export default function InstructionsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        const scorecardIndex = scorecardsData.scorecards.find(
          (sc) => sc.id === id
        );
        
        if (!scorecardIndex) {
          console.error('Scorecard not found in index');
          setLoading(false);
          return;
        }

        const scorecardData = await getScorecard(id);
        setScorecard(scorecardData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading scorecard:', error);
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!scorecard || !scorecard.intro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Scorecard not found or missing intro data</div>
      </div>
    );
  }

  const introData = scorecard.intro;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            {introData.title}
          </h1>
          <p className="text-gray-600">
            {introData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {introData.columns[0].title}
            </h2>
            <p className="text-gray-600 text-sm">
              {introData.columns[0].content}
            </p>
            {/* Instructions Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {introData.instructions.title}
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {introData.instructions.steps.map((step, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              {introData.columns[1].title}
            </h2>
            
            <div className="space-y-2">
              {introData.columns[1].points.map((point, index) => (
                <div key={index} className="flex items-start gap-3 bg-deep-purple/5 p-3 rounded-lg">
                  <div className="w-7 h-7 rounded-lg bg-deep-purple/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-gray-600 text-sm">
                    <div className="font-medium mb-0.5">{point.text}</div>
                    <div className="text-gray-500">{point.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={hasReadInstructions}
              onChange={(e) => setHasReadInstructions(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-deep-purple focus:ring-deep-purple"
            />
            {introData.consentText}
          </label>
          
          <button
            onClick={() => navigate(introData.nextRoute)}
            disabled={!hasReadInstructions}
            className={`w-full px-6 py-2.5 rounded-lg font-medium transition-colors ${
              hasReadInstructions
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {introData.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
} 