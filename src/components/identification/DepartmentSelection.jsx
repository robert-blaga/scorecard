import React from 'react';

const DEPARTMENTS = [
  {
    id: 'hr',
    title: 'Resurse Umane',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'finance',
    title: 'Financiar',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'it',
    title: 'Tehnologia Informației',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
  {
    id: 'operations',
    title: 'Operațiuni',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: 'legal',
    title: 'Juridic',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  },
  {
    id: 'purchasing',
    title: 'Achiziții',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 'quality',
    title: 'Control Calitate',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  }
];

export default function DepartmentSelection({ department, onSelect, onBack, onConfirm }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Selectează Departamentul
        </h1>
        <p className="text-gray-600">
          Te rugăm să selectezi departamentul din care faci parte
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onSelect(dept.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
                department === dept.id
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                  department === dept.id 
                    ? 'bg-deep-purple/10' 
                    : 'bg-gray-100 group-hover:bg-deep-purple/5'
                }`}>
                  {dept.icon}
                </div>
                <div className="flex items-center flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight">{dept.title}</h3>
                </div>
              </div>
              {department === dept.id && (
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
            disabled={!department}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                department
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