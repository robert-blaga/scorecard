import React from 'react';

const RETAIL_REGIONS = [
  { id: 'banat', title: 'Banat' },
  { id: 'bucuresti', title: 'București' },
  { id: 'dobrogea', title: 'Dobrogea' },
  { id: 'moldova', title: 'Moldova' },
  { id: 'muntenia', title: 'Muntenia' },
  { id: 'oltenia', title: 'Oltenia' },
  { id: 'transilvania', title: 'Transilvania' },
];

const CENTRAL_REGIONS = [
  { id: 'bucuresti', title: 'București' },
  { id: 'brasov', title: 'Brașov' },
];

export default function RegionSelection({ region, onSelect, onBack, onConfirm, isCentralOffice }) {
  const regions = isCentralOffice ? CENTRAL_REGIONS : RETAIL_REGIONS;
  
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează regiunea
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi regiunea pentru a continua
        </p>
      </div>

      <div className="space-y-2 mb-8">
        {regions.map((reg) => (
          <button
            key={reg.id}
            onClick={() => onSelect(reg.id)}
            className={`w-full py-3 px-4 rounded-lg border transition-all flex items-center justify-between ${
              region === reg.id
                ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
            }`}
          >
            <h3 className="text-base font-medium text-gray-700">{reg.title}</h3>
            {region === reg.id && (
              <div className="w-5 h-5 rounded-full bg-deep-purple text-white flex items-center justify-center flex-shrink-0 ml-3">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
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
          disabled={!region}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
            ${
              region
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          Continuă
        </button>
      </div>
    </div>
  );
} 