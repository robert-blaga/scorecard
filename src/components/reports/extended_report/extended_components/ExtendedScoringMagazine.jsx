import { pdf } from "@react-pdf/renderer";
import { ArrowRight, ClipboardList, Download } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import ExtendedReportPDF from "../../../pdf/ExtendedReportPDF";

const ExtendedScoringMagazine = ({
  score,
  scorecardData,
  displayText,
  priorityLevel,
  recommendationSummary,
  questions,
  answers,
  primaryCategory,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Find the matching threshold based on score
  const getMatchingThreshold = () => {
    const thresholds = scorecardData.extended_scoring.thresholds;
    for (let i = 0; i < thresholds.length; i++) {
      if (
        score > (thresholds[i + 1]?.threshold ?? 0) &&
        score <= thresholds[i].threshold
      ) {
        return thresholds[i];
      }
    }
    return thresholds[thresholds.length - 1];
  };

  const threshold = getMatchingThreshold();
  const { current_state, impact, next_steps } = threshold.sections;

  // Extract first paragraph and rest of the text
  const [firstParagraph, ...restParagraphs] =
    current_state.narrative.main_text.split("\\n\\n");

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Create the PDF document
      const doc = (
        <ExtendedReportPDF
          score={score}
          scorecardData={scorecardData}
          displayText={displayText}
          priorityLevel={priorityLevel}
          recommendationSummary={recommendationSummary}
          questions={questions}
          answers={answers}
          primaryCategory={primaryCategory}
        />
      );

      console.log("Generating PDF...");

      // Generate the PDF blob
      const pdfBlob = await pdf(doc).toBlob();
      console.log("PDF blob generated:", pdfBlob);

      if (!pdfBlob) {
        throw new Error("PDF blob generation failed");
      }

      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      console.log("Blob URL created:", url);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        scorecardData?.intro?.title || "Assessment"
      }_Report.pdf`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Cleanup completed");
      }, 100);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError(`Failed to generate PDF: ${err.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <article className="relative bg-white rounded-xl">
      {/* Main Content Area */}
      <div className="px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Article */}
          <div className="lg:col-span-8">
            {/* Article Title and Intro */}
            <div className="mb-8 sm:mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                {current_state.title}
              </h2>
              <p className="text-xl sm:text-2xl font-light text-gray-600 leading-relaxed border-l-2 border-gray-900 pl-4 sm:pl-6">
                {current_state.narrative.intro}
              </p>
            </div>

            {/* First Paragraph with Drop Cap */}
            <div className="mb-6 sm:mb-8">
              <p className="first-letter:text-5xl sm:first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-1 text-gray-800 leading-relaxed">
                {firstParagraph}
              </p>
            </div>

            {/* Rest of the Article */}
            <div className="sm:columns-2 gap-8 text-gray-700 leading-relaxed mb-8 sm:mb-12">
              {restParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Business Impact and Next Steps Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Business Impact Box */}
              <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-lg">
                <div className="flex flex-col items-center mb-6">
                  <ClipboardList className="w-8 h-8 text-gray-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    {impact.title}
                  </h3>
                </div>
                <p className="text-gray-600 italic mb-6 text-center sm:text-left">
                  {impact.description}
                </p>
                <ul className="space-y-4">
                  {impact.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm mr-3 mt-1">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps Box */}
              <div className="bg-gray-50 p-6 sm:p-8 border border-gray-200 rounded-lg">
                <div className="flex flex-col items-center mb-6">
                  <ArrowRight className="w-8 h-8 text-gray-900 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    {next_steps.title}
                  </h3>
                </div>
                <p className="text-gray-600 italic mb-6 text-center sm:text-left">
                  {next_steps.description}
                </p>
                <ul className="space-y-4">
                  {next_steps.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm mr-3 mt-1">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Score and Key Insights */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {/* Score Display */}
            <div className="relative bg-gray-900 p-6 sm:p-8 text-white rounded-xl">
              <div className="absolute top-0 right-0 transform translate-x-2 sm:translate-x-4 -translate-y-2 sm:-translate-y-4">
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-white border-4 border-gray-900 flex items-center justify-center text-3xl sm:text-4xl font-bold text-gray-900">
                  {Math.round(score)}
                  <span className="text-base sm:text-lg">%</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {scorecardData.extended_scoring.score_title ||
                  "Assessment Score"}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                {scorecardData.extended_scoring.score_description ||
                  "Based on comprehensive analysis"}
              </p>
            </div>

            {/* Key Insights Box */}
            <div className="bg-gray-50 p-6 sm:p-8 border border-gray-200 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-6 sm:w-8 h-px bg-gray-400 mr-3 sm:mr-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {scorecardData.extended_scoring.insight_title ||
                    "Key Insight"}
                </h3>
              </div>
              <p className="text-gray-800 italic text-sm sm:text-base">
                {current_state.narrative.conclusion}
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  <span>Preparing PDF...</span>
                </div>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </>
              )}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </article>
  );
};

ExtendedScoringMagazine.propTypes = {
  score: PropTypes.number.isRequired,
  scorecardData: PropTypes.shape({
    title: PropTypes.string,
    intro: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    extended_scoring: PropTypes.shape({
      title: PropTypes.string,
      score_title: PropTypes.string,
      score_description: PropTypes.string,
      insight_title: PropTypes.string,
      thresholds: PropTypes.arrayOf(
        PropTypes.shape({
          threshold: PropTypes.number.isRequired,
          sections: PropTypes.shape({
            current_state: PropTypes.shape({
              title: PropTypes.string.isRequired,
              narrative: PropTypes.shape({
                intro: PropTypes.string.isRequired,
                main_text: PropTypes.string.isRequired,
                conclusion: PropTypes.string.isRequired,
              }).isRequired,
            }).isRequired,
            impact: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              points: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
            next_steps: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              points: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
    basic_scoring: PropTypes.shape({
      title: PropTypes.string,
    }).isRequired,
  }).isRequired,
  displayText: PropTypes.string.isRequired,
  priorityLevel: PropTypes.string.isRequired,
  recommendationSummary: PropTypes.string,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          scores: PropTypes.object.isRequired,
        })
      ).isRequired,
    })
  ),
  answers: PropTypes.object,
  primaryCategory: PropTypes.string,
};

export default ExtendedScoringMagazine;
