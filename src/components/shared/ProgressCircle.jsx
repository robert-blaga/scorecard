import React from 'react';

const ProgressCircle = ({ percentage }) => {
  const getColorClasses = (value) => {
    if (value >= 70) return { bg: 'bg-green-100', text: 'text-green-500' };
    if (value >= 40) return { bg: 'bg-amber-100', text: 'text-amber-500' };
    return { bg: 'bg-red-100', text: 'text-red-500' };
  };

  const colors = getColorClasses(percentage);

  return (
    <div className="relative w-20 h-20">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-deep-purple" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" className="text-deep-purple" stopColor="currentColor" />
          </linearGradient>
          <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        <circle
          className="transition-all duration-300 ease-in-out"
          strokeWidth="4"
          stroke="url(#backgroundGradient)"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
        />
        <circle
          className={`transition-all duration-300 ease-in-out ${colors.text}`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
          r="36"
          cx="40"
          cy="40"
          strokeDasharray={`${226.19 * (percentage / 100)} 226.19`}
        />
      </svg>
      {/* Percentage in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${colors.text}`}>
          {Math.round(percentage) -100}%
        </span>
        <span className="text-xs text-gray-400 mt-0.5">gap</span>
      </div>
    </div>
  );
};

export default ProgressCircle; 