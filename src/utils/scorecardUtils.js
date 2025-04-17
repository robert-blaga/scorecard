/**
 * Utility functions for working with scorecards
 */
import scorecardsData from "../data/index.json";

/**
 * Loads a scorecard by ID from the data directory structure
 * @param {string} id - The ID of the scorecard to load
 * @returns {Promise<object|null>} - The scorecard data or null if not found
 */
export async function getScorecard(id) {
  if (!id) return null;

  try {
    // Get metadata from index.json
    const scorecardMetadata = scorecardsData?.scorecards?.find(
      (sc) => sc.id === id
    );
    if (!scorecardMetadata) {
      console.error(`No scorecard metadata found for ID: ${id}`);
      return null;
    }

    // Dynamically import the scorecard data file
    try {
      const scorecardData = await import(`../data/${id}.json`);

      // Merge metadata with scorecard data
      const mergedData = {
        ...scorecardData.default,
        scorecardInfo: scorecardMetadata.scorecardInfo,
      };

      // Verify critical data is present
      if (!mergedData.basic_scoring || !mergedData.questions) {
        console.error(`Invalid scorecard structure for ID: ${id}`);
        return null;
      }

      return mergedData;
    } catch (importError) {
      console.error(`Failed to load scorecard data for ID: ${id}`, importError);
      return null;
    }
  } catch (error) {
    console.error("Error loading scorecard:", error);
    return null;
  }
}
