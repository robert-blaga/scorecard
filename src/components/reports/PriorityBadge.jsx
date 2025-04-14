import React from 'react';

const PriorityBadge = ({ level }) => {
  const styles = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100'
    },
    medium: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100'
    },
    low: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100'
    }
  };

  const style = styles[level] || styles.medium;
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${style.border} border`}>
      {label} Priority
    </span>
  );
};

export default PriorityBadge; 