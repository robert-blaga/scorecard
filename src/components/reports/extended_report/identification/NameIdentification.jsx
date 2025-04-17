import PropTypes from "prop-types";

export default function NameIdentification({
  fullName,
  onFullNameChange,
  onConfirm,
  error = "",
}) {
  const validateFullName = (value) => {
    if (!value.trim()) {
      return "Full name is required";
    }

    const words = value.trim().split(/\s+/);
    if (words.length < 2) {
      return "Please enter both your first and last name";
    }

    if (!/^[a-zA-Z\s-']+$/.test(value)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    return "";
  };

  const capitalizeWords = (text) => {
    return text
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleNameChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = rawValue.trim()
      ? capitalizeWords(rawValue)
      : rawValue;
    onFullNameChange(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName.trim() && !validateFullName(fullName)) {
      onConfirm();
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-charcoal mb-3 animate-bounce-up">
          Welcome!
        </h1>
        <p className="text-gray-600 text-lg">
          Please enter your full name to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-deep-purple/30 to-sapphire/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white rounded-lg shadow-sm">
            <input
              type="text"
              value={fullName}
              onChange={handleNameChange}
              placeholder="Your full name"
              className={`w-full px-6 py-4 rounded-lg bg-transparent text-lg
                ${error ? "border-2 border-red-500" : "border border-gray-200"}
                focus:outline-none focus:ring-2 focus:ring-deep-purple focus:border-transparent
                transition-all duration-200 placeholder:text-gray-400`}
            />
            {error && (
              <div className="absolute -bottom-6 left-0 w-full">
                <p className="text-sm text-red-500 px-2 animate-bounce-up">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!fullName.trim() || validateFullName(fullName)}
            className={`group relative px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300
              ${
                fullName.trim() && !validateFullName(fullName)
                  ? "bg-deep-purple text-white hover:bg-deep-purple-600 shadow-lg hover:shadow-deep-purple/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <span className="relative z-10">Continue</span>
            {fullName.trim() && !validateFullName(fullName) && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep-purple to-sapphire opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

NameIdentification.propTypes = {
  fullName: PropTypes.string.isRequired,
  onFullNameChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  error: PropTypes.string,
};
