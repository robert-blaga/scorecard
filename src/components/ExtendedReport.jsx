import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useScorecard from '../hooks/useScorecard';
import { Target, CircleArrowRight } from 'lucide-react';

// Components
import PerformanceOverview from './reports/PerformanceOverview';
import QuestionAnalysis from './reports/QuestionAnalysis';
import RecommendationsSection from './reports/RecommendationsSection';

// Utils
import { getQuestionAnalysis } from '../utils/reportAnalysis';
import { getContextualRecommendations } from '../utils/recommendationUtils';
import { getThemeColors } from '../utils/themeUtils';

const ExtendedReport = ({ scorecardId }) => {
  const navigate = useNavigate();
  const { scorecard, loading, error, results, report } = useScorecard(scorecardId);
  const reportRef = useRef(null);

  // Function to trigger browser print with custom settings
  const handlePrint = () => {
    // Store current page title
    const originalTitle = document.title;
    
    // Add a temporary print stylesheet that improves PDF output
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'print-pdf-style';
    style.innerHTML = `
      @media print {
        /* Preserve the content styling with page margins */
        @page {
          size: auto;
          margin: 1cm 1cm !important;
        }
        
        /* First page - no extra top margin */
        @page :first {
          margin-top: 0.75cm !important;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Attempt to hide URL/metadata in all browsers */
        @page :header {
          display: none !important;
          content: "";
          height: 0;
        }
        
        @page :footer {
          display: none !important;
          content: "";
          height: 0;
        }
        
        /* Hide all other page elements */
        body > *:not(.print-only-content) {
          display: none !important;
        }
        
        /* Page break styles - simplified to prevent blank pages */
        .page-break {
          page-break-before: always !important;
          break-before: page !important;
        }
        
        /* Explicit section wrappers */
        .section-wrapper {
          display: block;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Keep essential styling */
        .bg-deep-purple { background-color: rgb(67, 56, 202) !important; }
        .text-deep-purple { color: rgb(67, 56, 202) !important; }
        .bg-blue-50 { background-color: rgb(239, 246, 255) !important; }
        .border-blue-500 { border-color: rgb(59, 130, 246) !important; }
        
        /* Ensure content is properly paginated */
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0.5cm !important;
        }
        
        /* Force background colors and images to print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    if (!reportRef.current) {
      window.print();
      return;
    }
    
    // Create temporary print container
    const printContainer = document.createElement('div');
    printContainer.className = 'print-only-content';
    printContainer.style.cssText = 'width: 100%; padding: 0; margin: 0; background-color: white;';
    
    // Clone the report for printing
    const clonedReport = reportRef.current.cloneNode(true);
    
    // Make sure we don't have duplicate IDs
    clonedReport.id = 'print-report-content';
    
    // Find all the major sections first before modifying the DOM
    const sections = Array.from(clonedReport.querySelectorAll('.page-break-inside-avoid'));
    
    // Adjust the styling of the cloned report to reduce spacing
    const headerElement = clonedReport.querySelector('.px-5.py-4.border-b');
    if (headerElement) {
      headerElement.style.cssText = 'padding: 5px 10px; margin: 0; border-bottom-width: 1px;';
    }
    
    const contentSection = clonedReport.querySelector('.p-5');
    if (contentSection) {
      contentSection.style.cssText = 'padding: 5px 10px; margin: 0;';
    }
    
    // Create a new, simpler container to hold all sections
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'sections-container';
    
    // Process sections to ensure optimal page breaks
    sections.forEach((section, index) => {
      // Remove from original parent
      if (section.parentNode) {
        section.parentNode.removeChild(section);
      }
      
      // Apply section styling directly
      section.style.cssText = `
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block;
        margin-bottom: ${index < sections.length - 1 ? '0.5cm' : '0'};
        ${index > 0 ? 'margin-top: 0.5cm;' : ''}
        ${(index === 1 || index === 2) ? 'page-break-before: always !important; break-before: page !important;' : ''}
      `;
      
      // For sections with subsections, make sure those don't break either
      const subsections = section.querySelectorAll('div[class*="bg-"]');
      subsections.forEach(subsection => {
        subsection.style.cssText += 'page-break-inside: avoid !important; break-inside: avoid !important;';
      });
      
      // Make sure charts/tables in each section stay together
      const charts = section.querySelectorAll('.chart-container, table');
      charts.forEach(chart => {
        chart.style.cssText += 'page-break-inside: avoid !important; break-inside: avoid !important;';
      });
      
      // Ensure headings stay with content
      const headings = section.querySelectorAll('h2, h3, h4');
      headings.forEach(heading => {
        heading.style.cssText += 'page-break-after: avoid !important; break-after: avoid !important; margin: 0.25cm 0;';
      });
      
      // Add the section to our container
      sectionsContainer.appendChild(section);
    });
    
    // Find the content section in the cloned report
    const mainContentSection = clonedReport.querySelector('.p-5');
    if (mainContentSection) {
      // Clear existing content
      mainContentSection.innerHTML = '';
      // Add our optimized sections
      mainContentSection.appendChild(sectionsContainer);
    }
    
    printContainer.appendChild(clonedReport);
    
    // Add to body
    document.body.appendChild(printContainer);
    
    // Update print styles
    style.innerHTML += `
      @media print {
        /* Reduce spacing for printed content */
        .print-only-content {
          margin: 0 !important;
          padding: 0.25cm !important;
        }
        
        .print-only-content #print-report-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Ensure Overview starts on first page */
        .print-only-content .mb-6 {
          margin-top: 0 !important;
          margin-bottom: 5px !important;
          page-break-before: avoid !important;
        }
        
        /* Reduce all spacing */
        .p-5, .p-6, .py-4, .px-5, .px-6 {
          padding: 5px 10px !important;
          margin: 0 !important;
        }
        
        /* Position print container properly */
        .print-only-content {
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          box-sizing: border-box;
        }
        
        /* Improved page break controls - adjust to prevent blank pages */
        .page-break-inside-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0.5cm !important;
          display: block !important;
        }
        
        /* Force sections to start on new pages if needed - reduced margins */
        .page-break-inside-avoid + .page-break-inside-avoid {
          page-break-before: auto !important;
          break-before: auto !important; 
          margin-top: 0.5cm !important;
        }
        
        /* Ensure headings stay with their content */
        h2, h3 {
          page-break-after: avoid !important;
          break-after: avoid !important;
          margin-top: 0.25cm !important;
          margin-bottom: 0.25cm !important;
        }
        
        /* Section wrappers with page breaks */
        .section-wrapper {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Only add page breaks where needed - avoid extra space */
        .section-wrapper:nth-child(2),
        .section-wrapper:nth-child(3) {
          page-break-before: always !important;
          break-before: page !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        
        /* Prevent orphans and widows */
        p, li {
          orphans: 3 !important;
          widows: 3 !important;
        }
        
        /* Ensure tables stay together */
        table {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }
    `;
    
    // Trigger print dialog
    setTimeout(() => {
      // Force a repaint to ensure styles are applied
      printContainer.style.display = 'none';
      // This forces a reflow
      void printContainer.offsetHeight;
      printContainer.style.display = 'block';
      
      // Short delay to ensure styles are applied
      setTimeout(() => {
        window.print();
        
        // Clean up after printing
        setTimeout(() => {
          document.title = originalTitle;
          document.body.removeChild(printContainer);
          document.head.removeChild(style);
        }, 1000);
      }, 100);
    }, 200);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
        <button onClick={() => navigate(-1)} className="text-deep-purple hover:text-deep-purple-600">
          Go Back
        </button>
      </div>
    );
  }

  if (!scorecard || !results || !report) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Report not found</h2>
        <p className="text-gray-600 mb-4">Please complete the survey first to view the extended report.</p>
        <button onClick={() => navigate(`/survey/${scorecardId}`)} className="text-deep-purple hover:text-deep-purple-600">
          Take Survey
        </button>
      </div>
    );
  }

  const primaryCategory = scorecard.scoring?.primaryCategory;
  const interpretation = results.interpretation?.[primaryCategory];

  if (!interpretation) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Report Data</h2>
        <p className="text-gray-600 mb-4">There was an issue with the report data. Please try taking the survey again.</p>
        <button onClick={() => navigate(`/survey/${scorecardId}`)} className="text-deep-purple hover:text-deep-purple-600">
          Retake Survey
        </button>
      </div>
    );
  }

  const theme = getThemeColors(scorecardId);
  const recommendations = getContextualRecommendations(scorecard, results, report);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div id="report-content" ref={reportRef}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-deep-purple flex items-center justify-center">
              <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-base text-charcoal font-medium leading-relaxed">{scorecard.scorecardInfo?.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Completed on {new Date(report.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Overview Section */}
        <div className="p-5">
          <div className="mb-6 page-break-inside-avoid">
            <div className="bg-blue-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-500 bg-blue-50">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-blue-900 mr-2" />
                  <h2 className="text-xl font-medium text-charcoal">Overview</h2>
                </div>
              </div>
              <div className="p-6">
                <PerformanceOverview scorecard={scorecard} responses={results.answers} />
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <div className="page-break-inside-avoid">
            <QuestionAnalysis
              questions={scorecard.questions.items}
              answers={results.answers}
              scorecard={scorecard}
              maxScorePerQuestion={scorecard.scoring.maxScorePerQuestion}
            />
          </div>

          {/* Recommendations - this will include all sections configured in the JSON */}
          {recommendations && recommendations.sections && recommendations.sections.length > 0 && (
            <div className="page-break-inside-avoid">
              <RecommendationsSection recommendations={recommendations} />
            </div>
          )}
        </div>
      </div>

      {/* Direct Action Buttons (without preview) */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 print:hidden">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
          
          <a
            href="https://www.brainiup.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-white bg-deep-purple hover:bg-opacity-90 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Speak with a Specialist
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExtendedReport; 