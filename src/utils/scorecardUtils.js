/**
 * Utility functions for working with scorecards
 */
import scorecardsData from '../data/index.json';

/**
 * Loads a scorecard by ID from the data directory structure
 * @param {string} id - The ID of the scorecard to load
 * @returns {Promise<object|null>} - The scorecard data or null if not found
 */
export async function getScorecard(id) {
  if (!id) return null;
  
  try {
    // Get metadata from index.json
    const scorecardMetadata = scorecardsData.scorecards.find(sc => sc.id === id);
    if (!scorecardMetadata) {
      console.error(`No scorecard metadata found for ID: ${id}`);
      return null;
    }

    // Use Vite's import.meta.glob to load all JSON files in the data directory and subdirectories
    const modules = import.meta.glob('../data/**/*.json', { eager: true });
    
    // First check for direct file match (most reliable)
    const directFilePath = `../data/${id}.json`;
    if (modules[directFilePath]) {
      // Merge metadata with scorecard data
      return {
        ...modules[directFilePath],
        scorecardInfo: scorecardMetadata.scorecardInfo
      };
    }
    
    // If no direct match, search through all JSON files to find one with the matching ID
    for (const path in modules) {
      const fileData = modules[path];
      
      // If the file has the matching ID, return it merged with metadata
      if (fileData && fileData.id === id) {
        return {
          ...fileData,
          scorecardInfo: scorecardMetadata.scorecardInfo
        };
      }
    }
    
    console.error(`No scorecard found with ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading scorecard:', error);
    return null;
  }
} 