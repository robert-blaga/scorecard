import React, { useState } from 'react';

const JOB_FUNCTIONS = [
  {
    id: 'hr_director',
    title: 'HR Director',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'hr_bp',
    title: 'HR BP',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    id: 'ld_manager',
    title: 'L&D Manager',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'hr_ld_specialist',
    title: 'HR/L&D Specialist',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'people_manager',
    title: 'People Manager',
    icon: (
      <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

export default function JobFunctionSelection({ role, onSelect, onBack, onConfirm }) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customFunction, setCustomFunction] = useState('');
  const [selectedRole, setSelectedRole] = useState(role || '');

  const handleRoleSelect = (roleId) => {
    setShowOtherInput(false);
    setSelectedRole(roleId);
    if (onSelect) {
      onSelect(roleId);
    }
  };
  
  const handleOtherSelect = () => {
    setShowOtherInput(true);
    setSelectedRole('other');
    if (onSelect) {
      onSelect('other');
    }
  };
  
  const handleCustomFunctionChange = (e) => {
    const value = e.target.value;
    setCustomFunction(value);
    if (onSelect) {
      onSelect('other', value);
    }
  };

  const handleConfirm = () => {
    if (!selectedRole) return;
    
    try {
      if (selectedRole === 'other') {
        if (!customFunction) return;
        onConfirm('other', customFunction);
      } else {
        const selectedJobFunction = JOB_FUNCTIONS.find(job => job.id === selectedRole);
        if (!selectedJobFunction) return;
        onConfirm(selectedJobFunction.id, selectedJobFunction.title);
      }
    } catch (error) {
      console.error('Error in handleConfirm:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Select Your Job Function
        </h1>
        <p className="text-gray-600">
          Please select your role in the organization
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-8">
          {JOB_FUNCTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleRoleSelect(item.id)}
              className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
                selectedRole === item.id && !showOtherInput
                  ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                  : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                  selectedRole === item.id && !showOtherInput
                    ? 'bg-deep-purple/10' 
                    : 'bg-gray-100 group-hover:bg-deep-purple/5'
                }`}>
                  {item.icon}
                </div>
                <div className="flex items-center flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 leading-tight">{item.title}</h3>
                </div>
              </div>
              {selectedRole === item.id && !showOtherInput && (
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
          
          <button
            type="button"
            onClick={handleOtherSelect}
            className={`group relative p-3 rounded-lg border transition-all h-[120px] ${
              showOtherInput
                ? 'border-deep-purple bg-deep-purple/5 shadow-sm'
                : 'border-gray-200 hover:border-deep-purple/30 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center text-center h-full">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mb-2 ${
                showOtherInput
                  ? 'bg-deep-purple/10' 
                  : 'bg-gray-100 group-hover:bg-deep-purple/5'
              }`}>
                <svg className="w-6 h-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex items-center flex-grow">
                <h3 className="text-sm font-medium text-gray-700 leading-tight">Other</h3>
              </div>
            </div>
            {showOtherInput && (
              <div className="absolute -top-1 -right-1">
                <div className="w-5 h-5 rounded-full bg-deep-purple text-white flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>
        
        {showOtherInput && (
          <div className="mb-8">
            <label htmlFor="custom-function" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your job function
            </label>
            <input
              type="text"
              id="custom-function"
              value={customFunction}
              onChange={handleCustomFunctionChange}
              placeholder="Enter your job function"
              className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-deep-purple focus:border-transparent transition-all duration-200 rounded-lg"
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-between border-t pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedRole || (selectedRole === 'other' && !customFunction)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                (selectedRole && selectedRole !== 'other') || (selectedRole === 'other' && customFunction)
                  ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 