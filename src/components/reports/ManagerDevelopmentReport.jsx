import React from 'react';

const ManagerDevelopmentReport = ({ report }) => {
  if (!report) return null;

  const { development_areas, priorities, implementation_steps } = report;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-purple flex items-center justify-center">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-base text-charcoal font-medium leading-relaxed">Manager Development Report</h2>
            <p className="text-sm text-gray-500 mt-0.5">Comprehensive analysis of management development areas and priorities</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {/* Development Areas */}
        <div className="mb-6">
          <h3 className="text-base text-charcoal font-medium mb-3">Development Areas</h3>
          <p className="text-sm text-gray-600 mb-4">Key areas identified for management development:</p>
          <div className="space-y-2">
            {development_areas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-charcoal">{area}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Areas */}
        <div className="mb-6">
          <h3 className="text-base text-charcoal font-medium mb-3">Priority Focus Areas</h3>
          <p className="text-sm text-gray-600 mb-4">Areas requiring immediate attention and action:</p>
          {priorities.map((priority, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-charcoal mb-1">{priority.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{priority.description}</p>
                  <ul className="space-y-1">
                    {priority.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-deep-purple rounded-full mr-2"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Steps */}
        <div>
          <h3 className="text-base text-charcoal font-medium mb-3">Implementation Strategy</h3>
          <p className="text-sm text-gray-600 mb-4">Strategic steps for implementing development initiatives:</p>
          <div className="space-y-2">
            {implementation_steps.map((step, index) => (
              <div key={index} className="flex items-start p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0 h-5 w-5 text-deep-purple">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-charcoal mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.timeline && (
                    <p className="text-xs text-gray-500 mt-1">Timeline: {step.timeline}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDevelopmentReport; 