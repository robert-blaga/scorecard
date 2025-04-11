import React from 'react';

export default function DataProcessing({ 
  gdprConsent, 
  marketingConsent, 
  onGdprConsentChange, 
  onMarketingConsentChange,
  onBack,
  onSubmit,
  loading
}) {
  return (
    <div className="space-y-6">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-base text-charcoal font-medium leading-relaxed">Data Processing</h3>
            <p className="text-sm text-gray-600 mt-1">Please review and accept our terms</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-100">
            <p className="mb-3">By requesting the Extended Report, you agree to our <a href="https://compass.brainiup.com/privacy-policy" className="text-deep-purple underline hover:text-deep-purple-600" target="_blank">Privacy Policy</a> and how we process your data</p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => onGdprConsentChange(e.target.checked)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
                  ${gdprConsent 
                    ? 'bg-deep-purple border-deep-purple' 
                    : 'border-gray-300 group-hover:border-deep-purple'
                  }
                `}>
                  {gdprConsent && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700">I consent to the processing of my personal data as described above</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group mt-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => onMarketingConsentChange(e.target.checked)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
                  ${marketingConsent 
                    ? 'bg-deep-purple border-deep-purple' 
                    : 'border-gray-300 group-hover:border-deep-purple'
                  }
                `}>
                  {marketingConsent && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700">(Optional) I agree to receive marketing communications about products and services</span>
            </label>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            disabled={!gdprConsent || loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${gdprConsent
                ? 'bg-deep-purple text-white hover:bg-deep-purple-600 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? 'Processing...' : 'Continue to Report'}
          </button>
        </div>
      </div>
    </div>
  );
} 