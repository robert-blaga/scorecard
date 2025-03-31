import React from 'react';

export default function OrganizationSelection({ selected, onSelect, onConfirm }) {
  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Bine ai venit!
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi organizația pentru a continua
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Sediul Central Card */}
        <button
          onClick={() => onSelect('sediul_central')}
          className={`p-6 rounded-xl border-2 transition-all ${
            selected === 'sediul_central'
              ? 'border-deep-purple bg-deep-purple/5'
              : 'border-gray-200 hover:border-deep-purple/50'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-deep-purple/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sediul Central</h3>
            <p className="text-gray-500 text-sm">
              Sediile din București și Brașov
            </p>
          </div>
        </button>

        {/* Retail Group Card */}
        <button
          onClick={() => onSelect('retail_group')}
          className={`p-6 rounded-xl border-2 transition-all ${
            selected === 'retail_group'
              ? 'border-deep-purple bg-deep-purple/5'
              : 'border-gray-200 hover:border-deep-purple/50'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-deep-purple/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Retail Group</h3>
            <p className="text-gray-500 text-sm">
              Operațiuni și managementul magazinelor
            </p>
          </div>
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onConfirm}
          disabled={!selected}
          className={`px-8 py-3 rounded-lg font-medium transition-all
            ${
              selected
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