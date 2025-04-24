import { pdf } from "@react-pdf/renderer";
import { ArrowUpRight, Download } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const CallToAction = ({
  score,
  scorecardData,
  displayText,
  priorityLevel,
  recommendationSummary,
  questions,
  answers,
  primaryCategory,
  ExtendedReportPDF,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="bg-indigo-600 relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Organization?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Discover our comprehensive training programs designed to elevate
              your team&apos;s performance and drive organizational success.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="group rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center gap-2 disabled:bg-indigo-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
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
                    <span>Preparing PDF...</span>
                  </div>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </>
                )}
              </button>
              <a
                href={scorecardData.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center gap-2"
              >
                Contact Us
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
            {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

CallToAction.propTypes = {
  score: PropTypes.number.isRequired,
  scorecardData: PropTypes.shape({
    intro: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    contactUrl: PropTypes.string.isRequired,
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
  ExtendedReportPDF: PropTypes.elementType.isRequired,
};

export default CallToAction;
