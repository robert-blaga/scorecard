import React from 'react';
import PropTypes from 'prop-types';
import { ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const StatCard = ({ label, value, icon: Icon, description, color }) => (
  <div className={`
    relative overflow-hidden rounded-xl border ${color.border}
    bg-white p-6 shadow-sm transition-all duration-300
    hover:shadow-lg hover:scale-[1.02] hover:${color.hover}
  `}>
    <div className="flex items-center gap-4">
      <div className={`rounded-lg ${color.iconBg} p-3`}>
        <Icon className={`h-6 w-6 ${color.icon}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
      </div>
    </div>
    {description && (
      <p className="mt-3 text-sm text-gray-500">{description}</p>
    )}
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  description: PropTypes.string,
  color: PropTypes.shape({
    border: PropTypes.string,
    hover: PropTypes.string,
    icon: PropTypes.string,
    iconBg: PropTypes.string,
  }).isRequired,
};

const DevelopmentStats = ({ stats }) => {
  const colorSchemes = {
    critical: {
      border: 'border-red-200',
      hover: 'bg-red-50',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    opportunity: {
      border: 'border-amber-200',
      hover: 'bg-amber-50',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    strength: {
      border: 'border-emerald-200',
      hover: 'bg-emerald-50',
      icon: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Critical Focus Areas"
          value={stats.criticalAreas}
          icon={ExclamationTriangleIcon}
          description={`${stats.criticalAreas} areas need immediate attention (score < 40)`}
          color={colorSchemes.critical}
        />
        <StatCard
          label="Development Opportunities"
          value={stats.developmentAreas}
          icon={ChartBarIcon}
          description={`${stats.developmentAreas} areas for potential improvement (score 40-60)`}
          color={colorSchemes.opportunity}
        />
        <StatCard
          label="Areas of Strength"
          value={stats.strengthAreas}
          icon={CheckCircleIcon}
          description={`${stats.strengthAreas} areas performing well (score > 60)`}
          color={colorSchemes.strength}
        />
      </div>

      {stats.matchPercentage !== undefined && (
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  Overall Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {stats.matchPercentage}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                data-testid="progress-bar"
                style={{ width: `${stats.matchPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DevelopmentStats.propTypes = {
  stats: PropTypes.shape({
    criticalAreas: PropTypes.number.isRequired,
    developmentAreas: PropTypes.number.isRequired,
    strengthAreas: PropTypes.number.isRequired,
    matchPercentage: PropTypes.number,
  }).isRequired,
};

export default DevelopmentStats; 