import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

// Register fonts using system fonts
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "Helvetica",
    },
    {
      src: "Helvetica-Bold",
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.6,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#9CA3AF",
  },
  // Magazine Section Styles
  magazineTitle: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
  },
  magazineIntro: {
    fontSize: 11,
    color: "#4B5563",
    marginBottom: 16,
    paddingLeft: 12,
    borderLeft: 2,
    borderColor: "#111827",
  },
  magazineText: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  // Score Display Styles
  scoreBox: {
    backgroundColor: "#111827",
    padding: 10,
    paddingBottom: 30,
    borderRadius: 6,
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: "Helvetica",
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
  // Assessment Section Styles
  assessmentBox: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  assessmentLabel: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  assessmentText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 16,
    lineHeight: 1.6,
  },
  priorityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    color: "#111827",
    fontWeight: 500,
  },
  // Question Analysis Styles
  questionBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  questionNumber: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 16,
  },
  answerBox: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 12,
    color: "#111827",
  },
  scoreIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  scoreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  scoreText: {
    fontSize: 10,
    color: "#4B5563",
  },
  // Cover Page Styles
  coverPage: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    position: "relative",
    height: "100%",
  },
  coverHeader: {
    position: "absolute",
    top: 40,
    left: 40,
    right: 40,
    textAlign: "left",
    color: "#6B7280",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  coverContent: {
    position: "absolute",
    top: "50%",
    left: 40,
    right: 40,
    transform: "translateY(-50%)",
  },
  coverTitle: {
    fontSize: 48,
    fontFamily: "Times-Roman",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 18,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  coverDate: {
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 10,
  },
  // Contact Page Styles
  contactPage: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  contactSection: {
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 24,
    fontFamily: "Times-Roman",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  contactInfo: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    marginTop: 24,
  },
  topicsList: {
    marginBottom: 24,
  },
  topicItem: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  insightBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  insightText: {
    fontSize: 11,
    color: "#4B5563",
    lineHeight: 1.4,
  },
});

const ExtendedReportPDF = ({
  score,
  scorecardData,
  displayText,
  priorityLevel,
  recommendationSummary,
  questions,
  answers,
  primaryCategory,
}) => {
  // Get matching threshold for magazine section
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

  // Split the main text into paragraphs for better layout
  const paragraphs = current_state.narrative.main_text.split("\\n\\n");
  const [firstParagraph, ...restParagraphs] = paragraphs;

  // Create chunks of 3 questions for pagination
  const questionChunks = questions
    ? Array.from({ length: Math.ceil(questions.length / 3) }, (_, i) =>
        questions.slice(i * 3, (i + 1) * 3)
      )
    : [];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        {/* Header */}
        <View style={styles.coverHeader}>
          <Text>Learning Technology - Extended Scorecard</Text>
        </View>

        {/* Center Content */}
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>
            {scorecardData?.intro?.title || "Assessment Report"}
          </Text>
          <Text style={styles.coverSubtitle}>
            {scorecardData?.extended_scoring?.title ||
              scorecardData?.basic_scoring?.title}
          </Text>
          <Text style={styles.coverDate}>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.coverFooter}>
          <Text>contact@brainiup.com • contact@teamlearn.ai</Text>
        </View>
      </Page>

      {/* Magazine Style Scoring Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: "row" }}>
          {/* Left Sidebar with Score */}
          <View style={{ width: 100, paddingRight: 20 }}>
            <View style={[styles.scoreBox, { marginBottom: 20 }]}>
              <Text style={styles.scoreValue}>{Math.round(score)}%</Text>
              <Text style={styles.scoreLabel}>Assessment Score</Text>
            </View>
          </View>

          {/* Magazine Content - Right Side */}
          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              borderLeft: 1,
              borderColor: "#E5E7EB",
            }}
          >
            {/* Magazine Content */}
            <View style={styles.section}>
              <Text style={styles.magazineTitle}>{current_state.title}</Text>
              <Text style={styles.magazineIntro}>
                {current_state.narrative.intro}
              </Text>

              {/* First Paragraph with Drop Cap styling */}
              <Text
                style={[
                  styles.magazineText,
                  { fontSize: 11, marginBottom: 16 },
                ]}
              >
                {firstParagraph}
              </Text>

              {/* Rest of the Paragraphs in Two Columns */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  {restParagraphs
                    .slice(0, Math.ceil(restParagraphs.length / 2))
                    .map((paragraph, index) => (
                      <Text key={index} style={styles.magazineText}>
                        {paragraph}
                      </Text>
                    ))}
                </View>
                <View style={{ flex: 1 }}>
                  {restParagraphs
                    .slice(Math.ceil(restParagraphs.length / 2))
                    .map((paragraph, index) => (
                      <Text key={index} style={styles.magazineText}>
                        {paragraph}
                      </Text>
                    ))}
                </View>
              </View>
            </View>

            {/* Business Impact and Next Steps in Two Columns */}
            <View
              style={[
                styles.section,
                { flexDirection: "row", gap: 10, marginTop: 5 },
              ]}
            >
              {/* Business Impact Box */}
              <View style={[styles.assessmentBox, { flex: 1 }]}>
                <Text
                  style={[
                    styles.assessmentLabel,
                    {
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontSize: 9,
                    },
                  ]}
                >
                  Business Impact
                </Text>
                <Text
                  style={[
                    styles.magazineText,
                    { fontStyle: "italic", marginBottom: 5, fontSize: 10 },
                  ]}
                >
                  {impact.description}
                </Text>
                {impact.points.map((point, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", marginBottom: 2 }}
                  >
                    <Text style={[styles.magazineText, { marginRight: 2 }]}>
                      •
                    </Text>
                    <Text style={styles.magazineText}>{point}</Text>
                  </View>
                ))}
              </View>

              {/* Next Steps Box */}
              <View
                style={[
                  styles.assessmentBox,
                  { flex: 1, backgroundColor: "#F3F4F6" },
                ]}
              >
                <Text
                  style={[
                    styles.assessmentLabel,
                    {
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontSize: 9,
                    },
                  ]}
                >
                  Next Steps
                </Text>
                <Text
                  style={[
                    styles.magazineText,
                    { fontStyle: "italic", marginBottom: 12, fontSize: 10 },
                  ]}
                >
                  {next_steps.description}
                </Text>
                {next_steps.points.map((point, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", marginBottom: 6 }}
                  >
                    <Text style={[styles.magazineText, { marginRight: 6 }]}>
                      {String.fromCharCode(65 + index)}.
                    </Text>
                    <Text style={styles.magazineText}>{point}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Assessment Details Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.magazineTitle}>Assessment Details</Text>

        {/* Main Content - Full Width */}
        <View style={styles.assessmentBox}>
          <Text style={styles.assessmentLabel}>Overall Assessment</Text>
          <Text style={styles.assessmentText}>{displayText}</Text>
          {recommendationSummary && (
            <Text style={styles.magazineText}>{recommendationSummary}</Text>
          )}
        </View>

        {/* Priority Level - Full Width and Height */}
        <View
          style={[
            styles.scoreBox,
            {
              width: "100%",
              flex: 1,
              marginBottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              styles.priorityDot,
              {
                width: 24,
                height: 24,
                borderRadius: 12,
                marginBottom: 16,
                backgroundColor:
                  priorityLevel === "Urgent" || priorityLevel === "High"
                    ? "#EF4444"
                    : priorityLevel === "Moderate"
                    ? "#F59E0B"
                    : "#10B981",
              },
            ]}
          />
          <Text style={[styles.scoreValue, { fontSize: 32, marginBottom: 8 }]}>
            {priorityLevel}
          </Text>
          <Text style={[styles.scoreLabel, { fontSize: 14 }]}>
            Priority Level
          </Text>
        </View>
      </Page>

      {/* Question Analysis Pages - One page per 3 questions */}
      {questionChunks.map((questionGroup, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <Text style={[styles.title, { fontSize: 16, marginBottom: 20 }]}>
            Question Analysis - Page {pageIndex + 1}
          </Text>

          {questionGroup.map((question) => {
            const userAnswerIndex = answers[question.id];
            const userAnswer = question.options[userAnswerIndex];
            const userScore = userAnswer?.scores[primaryCategory];
            const bestScore = Math.max(
              ...question.options.map((opt) => opt.scores[primaryCategory])
            );
            const bestAnswer = question.options.find(
              (opt) => opt.scores[primaryCategory] === bestScore
            );

            return (
              <View
                key={question.id}
                style={[styles.questionBox, { marginBottom: 30 }]}
              >
                <Text style={styles.questionNumber}>
                  Question {question.id}
                </Text>
                <Text style={styles.questionText}>{question.text}</Text>

                {/* Side by side answers */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {/* Your Answer */}
                  <View style={[styles.answerBox, { flex: 1 }]}>
                    <Text style={styles.answerLabel}>Your Answer</Text>
                    <Text style={styles.answerText}>{userAnswer?.text}</Text>
                    <View style={styles.scoreIndicator}>
                      <View
                        style={[
                          styles.scoreDot,
                          { backgroundColor: "#4F46E5" },
                        ]}
                      />
                      <Text style={styles.scoreText}>Score: {userScore}</Text>
                    </View>
                  </View>

                  {/* Best Practice Answer */}
                  <View
                    style={[
                      styles.answerBox,
                      { flex: 1, backgroundColor: "#F3F4F6" },
                    ]}
                  >
                    <Text style={styles.answerLabel}>Best Practice</Text>
                    <Text style={styles.answerText}>{bestAnswer?.text}</Text>
                    <View style={styles.scoreIndicator}>
                      <View
                        style={[
                          styles.scoreDot,
                          { backgroundColor: "#10B981" },
                        ]}
                      />
                      <Text style={styles.scoreText}>Score: {bestScore}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Page number */}
          <Text style={styles.pageNumber}>
            Question Analysis Page {pageIndex + 1} of {questionChunks.length}
          </Text>
        </Page>
      ))}

      {/* Contact Page */}
      <Page size="A4" style={styles.contactPage}>
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get in Touch</Text>

          {/* Contact Information */}
          <Text style={styles.contactInfo}>Email: contact@brainiup.com & contact@teamlearn.ai</Text>
          <Text style={styles.contactInfo}>Phone: +40 756 048 571</Text>
          <Text style={styles.contactInfo}>Website: www.brainiup.com & www.teamlearn.ai</Text>
        </View>

        {/* Training Topics */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Training Topics</Text>
          <View style={styles.topicsList}>
            {[
              "Leadership Development",
              "Professional Communication",
              "Productivity & Time Management",
              "Mental Health & Well-being",
              "Artificial Intelligence Integration",
            ].map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <Text>• {topic}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Our Solutions */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Our Innovative Solutions</Text>

          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>
              AI-Powered Learning Platforms
            </Text>
            <Text style={styles.insightText}>
              Personalized learning experiences powered by advanced AI
              algorithms, adapting to each learner's pace and style.
            </Text>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>
              Interactive AI Learning Agents
            </Text>
            <Text style={styles.insightText}>
              Intelligent AI agents that provide real-time guidance, feedback,
              and support throughout the learning journey.
            </Text>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>
              Gamified Compliance Training
            </Text>
            <Text style={styles.insightText}>
              Transform traditional compliance training into engaging,
              game-based experiences that boost retention and participation.
            </Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>Contact Information</Text>
      </Page>
    </Document>
  );
};

ExtendedReportPDF.propTypes = {
  score: PropTypes.number.isRequired,
  scorecardData: PropTypes.shape({
    intro: PropTypes.shape({
      title: PropTypes.string,
    }),
    extended_scoring: PropTypes.shape({
      title: PropTypes.string,
      thresholds: PropTypes.arrayOf(
        PropTypes.shape({
          threshold: PropTypes.number.isRequired,
          sections: PropTypes.shape({
            current_state: PropTypes.shape({
              title: PropTypes.string.isRequired,
              narrative: PropTypes.shape({
                intro: PropTypes.string.isRequired,
                main_text: PropTypes.string.isRequired,
              }).isRequired,
            }).isRequired,
            impact: PropTypes.shape({
              description: PropTypes.string.isRequired,
              points: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
            next_steps: PropTypes.shape({
              description: PropTypes.string.isRequired,
              points: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
    basic_scoring: PropTypes.shape({
      title: PropTypes.string,
    }),
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

export default ExtendedReportPDF;
