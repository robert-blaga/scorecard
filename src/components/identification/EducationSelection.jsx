import React from 'react';

const EDUCATION_LEVELS = [
  {
    id: 'liceu',
    title: 'Liceu',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
      </svg>
    )
  },
  {
    id: 'facultate',
    title: 'Facultate',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    id: 'master',
    title: 'Master',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'doctorat',
    title: 'Doctorat',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  }
];

export default function EducationSelection({ education, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Ultima școală absolvită
        </h1>
        <p className="text-gray-600">
          Vă rugăm să selectați ultimul nivel de educație absolvit
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {EDUCATION_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
                education === level.id
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                  education === level.id 
                    ? 'bg-deep-purple/10' 
                    : 'bg-gray-100 group-hover:bg-deep-purple/5'
                }`}>
                  {level.icon}
                </div>
                <div className="flex items-center flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight">{level.title}</h3>
                </div>
              </div>
              {education === level.id && (
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
            disabled={!education}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                education
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