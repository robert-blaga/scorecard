import React from 'react';

const REGIONAL_MANAGERS = [
  {
    id: 'rsm_1',
    title: 'RSM 1',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'rsm_2',
    title: 'RSM 2',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'rsm_3',
    title: 'RSM 3',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'rsm_4',
    title: 'RSM 4',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'rsm_5',
    title: 'RSM 5',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
];

export default function RegionalManagerSelection({ manager, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează RSM
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi managerul regional
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {REGIONAL_MANAGERS.map((rsm) => (
            <button
              key={rsm.id}
              onClick={() => onSelect(rsm.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
                manager === rsm.id
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                  manager === rsm.id 
                    ? 'bg-deep-purple/10' 
                    : 'bg-gray-100 group-hover:bg-deep-purple/5'
                }`}>
                  {rsm.icon}
                </div>
                <div className="flex items-center flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight">{rsm.title}</h3>
                </div>
              </div>
              {manager === rsm.id && (
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
            disabled={!manager}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                manager
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