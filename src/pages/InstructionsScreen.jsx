import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructionsScreen() {
  const navigate = useNavigate();
  const [hasReadInstructions, setHasReadInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            Studiu de Angajament Optiblu
          </h1>
          <p className="text-gray-600">
            Opinia ta contează pentru noi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Despre acest chestionar
            </h2>
            <p className="text-gray-600 text-sm">
              Acest studiu face parte din inițiativa noastră continuă de a îmbunătăți mediul de lucru și experiența angajaților Optiblu. Răspunsurile tale ne vor ajuta să identificăm zonele în care excelăm și cele în care putem aduce îmbunătățiri.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Câteva aspecte importante
            </h2>
            
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-deep-purple/5 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-lg bg-deep-purple/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">Pentru fiecare întrebare, selectează <strong>un singur răspuns</strong> care reflectă cel mai bine opinia ta.</p>
              </div>

              <div className="flex items-start gap-3 bg-deep-purple/5 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-lg bg-deep-purple/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">Studiul este <strong>complet anonim</strong>. Răspunsurile tale nu pot fi asociate cu identitatea ta.</p>
              </div>

              <div className="flex items-start gap-3 bg-deep-purple/5 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-lg bg-deep-purple/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">Completarea chestionarului durează aproximativ <strong>10-15 minute</strong>.</p>
              </div>

              <div className="flex items-start gap-3 bg-deep-purple/5 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-lg bg-deep-purple/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">Răspunsurile sincere ne ajută să luăm decizii mai bune pentru îmbunătățirea mediului de lucru.</p>
              </div>
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
            Am citit instrucțiunile
          </label>
          
          <button
            onClick={() => navigate('/survey')}
            disabled={!hasReadInstructions}
            className={`w-full px-6 py-2.5 rounded-lg font-medium transition-colors ${
              hasReadInstructions
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Începe chestionarul
          </button>
        </div>
      </div>
    </div>
  );
} 