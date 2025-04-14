import React from 'react';
import { Target } from 'lucide-react';

const PrioritySection = ({ 
  areas, 
  config,
  children 
}) => {
  if (!areas?.length) return null;

  return (
    <div className="page-break-inside-avoid mt-6">
      <div className={`rounded-lg border border-gray-200 overflow-hidden ${config.style.background}`}>
        <div className={`px-6 py-4 border-b ${config.style.border} ${config.style.background}`}>
          <div className="flex items-center">
            <Target className={`w-4 h-4 ${config.style.iconColor} mr-2`} />
            <h2 className="text-xl font-medium text-charcoal">{config.label}</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">{config.description}</p>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrioritySection; 