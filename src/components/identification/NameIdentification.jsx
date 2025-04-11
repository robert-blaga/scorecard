import React from 'react';

export default function NameIdentification({ 
  fullName, 
  onFullNameChange, 
  onConfirm,
  error = ''
}) {
  const validateFullName = (value) => {
    if (!value.trim()) {
      return 'Full name is required';
    }

    const words = value.trim().split(/\s+/);
    if (words.length < 2) {
      return 'Please enter both your first and last name';
    }

    if (!/^[a-zA-Z\s-']+$/.test(value)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    return '';
  };

  const capitalizeWords = (text) => {
    return text
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleNameChange = (e) => {
    const rawValue = e.target.value;
    // Only capitalize if there's actual content
    const formattedValue = rawValue.trim() ? capitalizeWords(rawValue) : rawValue;
    onFullNameChange(formattedValue);
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Welcome!
        </h1>
        <p className="text-gray-600">
          Please enter your full name to continue
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 mb-8">
          <div>
            <input
              type="text"
              value={fullName}
              onChange={handleNameChange}
              placeholder="Full name"
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-500' : 'border-gray-200'
              } border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            disabled={!fullName.trim() || validateFullName(fullName)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${
                fullName.trim() && !validateFullName(fullName)
                  ? 'bg-deep-purple text-white hover:bg-deep-purple-500'
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