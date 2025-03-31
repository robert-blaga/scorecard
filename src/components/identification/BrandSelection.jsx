import React from 'react';

export default function BrandSelection({ brand, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează brandul
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi brandul pentru care lucrezi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Optiblue Card */}
        <button
          onClick={() => onSelect('optiblue')}
          className={`p-6 rounded-xl border-2 transition-all ${
            brand === 'optiblue'
              ? 'border-deep-purple bg-deep-purple/5'
              : 'border-gray-200 hover:border-deep-purple/50'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-deep-purple/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Optiblu</h3>
          </div>
        </button>

        {/* Optiplaza Card */}
        <button
          onClick={() => onSelect('optiplaza')}
          className={`p-6 rounded-xl border-2 transition-all ${
            brand === 'optiplaza'
              ? 'border-deep-purple bg-deep-purple/5'
              : 'border-gray-200 hover:border-deep-purple/50'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-deep-purple/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Optiplaza</h3>
          </div>
        </button>
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
          disabled={!brand}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
            ${
              brand
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