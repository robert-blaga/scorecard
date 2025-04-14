import React from 'react';
import { ArrowRight } from 'lucide-react';

const TimelineItem = ({
  title,
  description,
  targetState,
  actions,
  icon: Icon,
  iconColor,
  borderColor,
  type,
  score
}) => {
  return (
    <div className={`rounded-lg border ${borderColor} bg-white overflow-hidden`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium
          ${type === 'priority' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {score}%
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${type === 'priority' ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">Progress</span>
        </div>

        {/* Action items */}
        {actions && actions.length > 0 && (
          <div className="space-y-2">
            {actions.slice(0, 2).map((action, index) => (
              <div key={index} className="flex items-start gap-2">
                <ArrowRight className={`w-4 h-4 ${iconColor} mt-0.5`} />
                <p className="text-sm text-gray-600 line-clamp-2">{action}</p>
              </div>
            ))}
            {actions.length > 2 && (
              <p className="text-xs text-gray-500 pl-6">
                +{actions.length - 2} more actions
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem; 