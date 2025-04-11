export const getThemeColors = (scorecardId) => {
  // Default theme colors based on scorecard type
  const themeMap = {
    'discover-work': {
      primary: 'bg-indigo-600',
      secondary: 'bg-indigo-100',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-700',
      border: 'border-indigo-200'
    },
    'team-performance-metrics': {
      primary: 'bg-emerald-600',
      secondary: 'bg-emerald-100',
      text: 'text-emerald-600',
      hover: 'hover:bg-emerald-700',
      border: 'border-emerald-200'
    },
    'innovation-capability': {
      primary: 'bg-violet-600',
      secondary: 'bg-violet-100',
      text: 'text-violet-600',
      hover: 'hover:bg-violet-700',
      border: 'border-violet-200'
    },
    'neuro-leadership': {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-700',
      border: 'border-blue-200'
    }
  };

  return themeMap[scorecardId] || {
    primary: 'bg-deep-purple',
    secondary: 'bg-purple-100',
    text: 'text-deep-purple',
    hover: 'hover:bg-purple-700',
    border: 'border-purple-200'
  };
}; 