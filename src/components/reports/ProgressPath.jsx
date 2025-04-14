import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProgressPath = ({ currentState, targetState }) => {
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 p-4 rounded-lg bg-gray-50 border border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Current State</h4>
        <p className="text-sm text-gray-600">{currentState}</p>
      </div>
      
      <ArrowRight className="text-gray-400 flex-shrink-0" size={24} />
      
      <div className="flex-1 p-4 rounded-lg bg-blue-50 border border-blue-100">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Target State</h4>
        <p className="text-sm text-blue-700">{targetState}</p>
      </div>
    </div>
  );
};

export default ProgressPath; 