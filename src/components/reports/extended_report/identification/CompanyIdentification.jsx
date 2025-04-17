import PropTypes from "prop-types";

// Generic company names to check against
const GENERIC_COMPANY_NAMES = [
  "company",
  "business",
  "enterprise",
  "corporation",
  "inc",
  "llc",
  "ltd",
  "limited",
];

// Generic email domains to check against
const GENERIC_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
];

export default function CompanyIdentification({
  companyName,
  companyEmail,
  onCompanyNameChange,
  onCompanyEmailChange,
  onBack,
  onConfirm,
  errors = {},
}) {
  const validateCompanyName = (value) => {
    if (!value.trim()) {
      return "Company name is required";
    }
    if (value.trim().length < 2) {
      return "Company name must be at least 2 characters long";
    }
    const lowerValue = value.toLowerCase();
    if (GENERIC_COMPANY_NAMES.some((generic) => lowerValue.includes(generic))) {
      return "Please provide your specific company name";
    }
    return "";
  };

  const validateCompanyEmail = (value) => {
    if (!value.trim()) {
      return "Company email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    const domain = value.split("@")[1].toLowerCase();
    if (GENERIC_EMAIL_DOMAINS.includes(domain)) {
      const messages = [
        "Would you mind using your company email? It helps us better tailor our services to your organization ✨",
        "We noticed you're using a personal email - your company email would help us serve you better 💫",
        "Your company email would be perfect here - it helps us understand your business needs better ✉️",
        "A small suggestion: using your company email allows us to provide a more personalized experience 💡",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return "";
  };

  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    onCompanyNameChange(value);
  };

  const handleCompanyEmailChange = (e) => {
    const value = e.target.value;
    onCompanyEmailChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim() && companyEmail.trim()) {
      onConfirm();
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-charcoal mb-3 animate-bounce-up">
          Company Details
        </h1>
        <p className="text-gray-600 text-lg">
          Please enter your company information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="space-y-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-deep-purple/30 to-sapphire/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-lg shadow-sm">
              <input
                type="text"
                value={companyName}
                onChange={handleCompanyNameChange}
                placeholder="Company name"
                className={`w-full px-6 py-4 rounded-lg bg-transparent text-lg
                  ${
                    errors.companyName
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  }
                  focus:outline-none focus:ring-2 focus:ring-deep-purple focus:border-transparent
                  transition-all duration-200 placeholder:text-gray-400`}
              />
              {errors.companyName && (
                <div className="absolute -bottom-6 left-0 w-full">
                  <p className="text-sm text-red-500 px-2 animate-bounce-up">
                    {errors.companyName}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sapphire/30 to-emerald/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-lg shadow-sm">
              <input
                type="email"
                value={companyEmail}
                onChange={handleCompanyEmailChange}
                placeholder="Business email"
                className={`w-full px-6 py-4 rounded-lg bg-transparent text-lg
                  ${
                    errors.companyEmail
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                  }
                  focus:outline-none focus:ring-2 focus:ring-deep-purple focus:border-transparent
                  transition-all duration-200 placeholder:text-gray-400`}
              />
              {errors.companyEmail && (
                <div className="absolute -bottom-6 left-0 w-full">
                  <p className="text-sm text-red-500 px-2 animate-bounce-up">
                    {errors.companyEmail}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t pt-8">
          <button
            type="button"
            onClick={onBack}
            className="group relative px-6 py-3 rounded-lg text-sm font-medium border border-gray-200 hover:border-deep-purple/30 transition-all duration-300"
          >
            <span className="relative z-10 text-gray-600 group-hover:text-deep-purple transition-colors duration-300">
              Back
            </span>
          </button>
          <button
            type="submit"
            disabled={!companyName.trim() || !companyEmail.trim()}
            className={`group relative px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300
              ${
                companyName.trim() && companyEmail.trim()
                  ? "bg-deep-purple text-white hover:bg-deep-purple-600 shadow-lg hover:shadow-deep-purple/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <span className="relative z-10">Continue</span>
            {companyName.trim() && companyEmail.trim() && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep-purple to-sapphire opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

CompanyIdentification.propTypes = {
  companyName: PropTypes.string.isRequired,
  companyEmail: PropTypes.string.isRequired,
  onCompanyNameChange: PropTypes.func.isRequired,
  onCompanyEmailChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    companyName: PropTypes.string,
    companyEmail: PropTypes.string,
  }),
};
