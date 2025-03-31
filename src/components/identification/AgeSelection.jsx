import React from 'react';

const AGE_GROUPS = [
  { id: '18_24', title: '18-24 ani' },
  { id: '25_34', title: '25-34 ani' },
  { id: '35_44', title: '35-44 ani' },
  { id: '45_54', title: '45-54 ani' },
  { id: '55_plus', title: '55+ ani' },
];

export default function AgeSelection({ age, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează vârsta
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi intervalul de vârstă pentru a continua
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {AGE_GROUPS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[80px] ${
                age === item.id
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <h3 className="text-sm font-medium text-gray-700 leading-tight">{item.title}</h3>
              </div>
              {age === item.id && (
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
            disabled={!age}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                age
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