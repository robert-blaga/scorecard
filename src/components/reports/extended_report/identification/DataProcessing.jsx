import PropTypes from "prop-types";

export default function DataProcessing({
  gdprConsent,
  marketingConsent,
  onGdprConsentChange,
  onMarketingConsentChange,
  onBack,
  onSubmit,
  loading,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-charcoal mb-3 pt-12">
          Data Processing Agreement
        </h1>
        <p className="text-gray-600 text-lg">
          Please review our terms and provide your consent
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-deep-purple/5 to-sapphire/5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-deep-purple/10">
              <svg
                className="w-5 h-5 text-deep-purple"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-charcoal font-medium leading-relaxed">
                Privacy & Data Protection
              </h3>
              <p className="text-gray-600 mt-1">
                We take your privacy seriously. Please review how we handle your
                data.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl text-gray-600 border border-gray-100 shadow-sm">
            <p className="leading-relaxed">
              By requesting the Extended Report, you agree to our{" "}
              <a
                href="https://compass.brainiup.com/privacy-policy"
                className="text-deep-purple font-medium hover:text-deep-purple-600 transition-colors duration-200 underline decoration-2 decoration-deep-purple/30 hover:decoration-deep-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              and how we process your data
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="relative flex items-center pt-0.5">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => onGdprConsentChange(e.target.checked)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div
                  className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                    ${
                      gdprConsent
                        ? "bg-deep-purple border-deep-purple scale-105"
                        : "border-gray-300 group-hover:border-deep-purple"
                    }
                  `}
                >
                  {gdprConsent && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-base text-gray-700 leading-relaxed">
                I consent to the processing of my personal data as described
                above
              </span>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="relative flex items-center pt-0.5">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => onMarketingConsentChange(e.target.checked)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div
                  className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                    ${
                      marketingConsent
                        ? "bg-deep-purple border-deep-purple scale-105"
                        : "border-gray-300 group-hover:border-deep-purple"
                    }
                  `}
                >
                  {marketingConsent && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-base text-gray-700 leading-relaxed">
                <span className="text-gray-500">(Optional)</span> I agree to
                receive marketing communications about products and services
              </span>
            </label>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="group relative px-6 py-3 rounded-lg text-sm font-medium border border-gray-200 hover:border-deep-purple/30 transition-all duration-300"
            >
              <span className="relative z-10 text-gray-600 group-hover:text-deep-purple transition-colors duration-300">
                Back
              </span>
            </button>
            <button
              onClick={onSubmit}
              disabled={!gdprConsent || loading}
              className={`group relative px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300
                ${
                  gdprConsent && !loading
                    ? "bg-deep-purple text-white hover:bg-deep-purple-600 shadow-lg hover:shadow-deep-purple/25"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Continue to Report"
                )}
              </span>
              {gdprConsent && !loading && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep-purple to-sapphire opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DataProcessing.propTypes = {
  gdprConsent: PropTypes.bool.isRequired,
  marketingConsent: PropTypes.bool.isRequired,
  onGdprConsentChange: PropTypes.func.isRequired,
  onMarketingConsentChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
