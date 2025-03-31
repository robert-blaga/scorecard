import React from 'react';

const SENIORITY_LEVELS = [
  {
    id: 'executie',
    title: 'Execuție',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'middle_management',
    title: 'Middle Management',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'top_management',
    title: 'Top Management',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  }
];

export default function SenioritySelection({ seniority, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează Nivelul de Senioritate
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi nivelul tău de senioritate în organizație
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {SENIORITY_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
                seniority === level.id
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                  seniority === level.id 
                    ? 'bg-deep-purple/10' 
                    : 'bg-gray-100 group-hover:bg-deep-purple/5'
                }`}>
                  {level.icon}
                </div>
                <div className="flex items-center flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight">{level.title}</h3>
                </div>
              </div>
              {seniority === level.id && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-5 h-5 rounded-full bg-deep-purple text-white flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between border-t pt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all"
          >
            Înapoi
          </button>
          <button
            onClick={onConfirm}
            disabled={!seniority}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                seniority
                  ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Continuă
          </button>
        </div>
      </div>
    </div>
  );
} 