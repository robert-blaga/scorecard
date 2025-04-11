import React from 'react';

// Generic company names to check against
const GENERIC_COMPANY_NAMES = [
  'company',
  'business',
  'enterprise',
  'corporation',
  'inc',
  'llc',
  'ltd',
  'limited'
];

// Generic email domains to check against
const GENERIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com'
];

export default function CompanyIdentification({ 
  companyName, 
  companyEmail, 
  onCompanyNameChange, 
  onCompanyEmailChange, 
  onBack, 
  onConfirm,
  errors = {}
}) {
  const validateCompanyName = (value) => {
    if (!value.trim()) {
      return 'Company name is required';
    }
    if (value.trim().length < 2) {
      return 'Company name must be at least 2 characters long';
    }
    const lowerValue = value.toLowerCase();
    if (GENERIC_COMPANY_NAMES.some(generic => lowerValue.includes(generic))) {
      return 'Please provide your specific company name';
    }
    return '';
  };

  const validateCompanyEmail = (value) => {
    if (!value.trim()) {
      return 'Company email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    const domain = value.split('@')[1].toLowerCase();
    if (GENERIC_EMAIL_DOMAINS.includes(domain)) {
      const messages = [
        "Would you mind using your company email? It helps us better tailor our services to your organization ✨",
        "We noticed you're using a personal email - your company email would help us serve you better 💫",
        "Your company email would be perfect here - it helps us understand your business needs better ✉️",
        "A small suggestion: using your company email allows us to provide a more personalized experience 💡"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return '';
  };

  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    onCompanyNameChange(value);
  };

  const handleCompanyEmailChange = (e) => {
    const value = e.target.value;
    onCompanyEmailChange(value);
  };

  const isValid = () => {
    return !validateCompanyName(companyName) && !validateCompanyEmail(companyEmail);
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Company Details
        </h1>
        <p className="text-gray-600">
          Please enter your company information
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-8">
          <div>
            <input
              type="text"
              value={companyName}
              onChange={handleCompanyNameChange}
              placeholder="Company name"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.companyName ? 'border-red-500' : 'border-gray-200'
              }} border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              value={companyEmail}
              onChange={handleCompanyEmailChange}
              placeholder="Business email"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.companyEmail ? 'border-red-500' : 'border-gray-200'
              } border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            />
            {errors.companyEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.companyEmail}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between border-t pt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={!companyName.trim() || !companyEmail.trim()}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                companyName.trim() && companyEmail.trim()
                  ? 'bg-deep-purple text-white hover:bg-deep-purple-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 