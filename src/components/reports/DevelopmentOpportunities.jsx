import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpRight, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const PriorityBadge = ({ priority }) => {
  const colors = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    development: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    strength: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

PriorityBadge.propTypes = {
  priority: PropTypes.oneOf(['critical', 'development', 'strength']).isRequired
};

const OpportunityCard = ({ opportunity }) => (
  <div 
    data-testid="opportunity-card"
    className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-950/5 transition hover:shadow-md dark:bg-zinc-900 dark:ring-white/10"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{opportunity.category}</h3>
          <PriorityBadge priority={opportunity.priority} />
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{opportunity.description}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">{opportunity.matchPercentage}%</div>
        <div className="text-sm text-zinc-500 dark:text-zinc-500">Match</div>
      </div>
    </div>
    
    <div className="mt-4 grid gap-4 @md:grid-cols-2">
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Current State</h4>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{opportunity.currentState}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Ideal State</h4>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{opportunity.idealState}</p>
      </div>
    </div>

    {opportunity.recommendations.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Recommendations</h4>
        <ul className="mt-2 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
          {opportunity.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

OpportunityCard.propTypes = {
  opportunity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    matchPercentage: PropTypes.number.isRequired,
    priority: PropTypes.string.isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentState: PropTypes.string.isRequired,
    idealState: PropTypes.string.isRequired
  }).isRequired
};

const DevelopmentOpportunities = ({ opportunities }) => {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSortedOpportunities = useMemo(() => {
    let filtered = opportunities;
    
    if (priorityFilter !== 'all') {
      filtered = opportunities.filter(opp => opp.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, development: 1, strength: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortDirection === 'asc' ? priorityDiff : -priorityDiff;
      } else {
        return sortDirection === 'asc' 
          ? a.matchPercentage - b.matchPercentage 
          : b.matchPercentage - a.matchPercentage;
      }
    });
  }, [opportunities, priorityFilter, sortBy, sortDirection]);

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  if (!opportunities?.length) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Lightbulb className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No Development Opportunities</h3>
        <p className="mt-2 text-sm text-gray-500">Great job! You're performing well in all areas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-md border-zinc-300 bg-white py-1.5 pl-3 pr-8 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            aria-label="Priority:"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="development">Development</option>
            <option value="strength">Strength</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSort('priority')}
            className={`flex items-center gap-1 text-sm font-medium ${
              sortBy === 'priority' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            aria-label="Sort by Priority"
          >
            Sort by Priority
            {sortBy === 'priority' && (
              sortDirection === 'asc' ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />
            )}
          </button>
          <button
            onClick={() => handleSort('match')}
            className={`flex items-center gap-1 text-sm font-medium ${
              sortBy === 'match' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'
            }`}
            aria-label="Sort by Match"
          >
            Sort by Match
            {sortBy === 'match' && (
              sortDirection === 'asc' ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAndSortedOpportunities.map(opportunity => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
};

DevelopmentOpportunities.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    matchPercentage: PropTypes.number.isRequired,
    priority: PropTypes.string.isRequired,
    recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentState: PropTypes.string.isRequired,
    idealState: PropTypes.string.isRequired
  })).isRequired
};

export default DevelopmentOpportunities; 