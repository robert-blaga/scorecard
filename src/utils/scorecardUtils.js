/**
 * Utility functions for working with scorecards
 */

/**
 * Loads a scorecard by ID from any file in the data directory
 * @param {string} id - The ID of the scorecard to load
 * @returns {Promise<object|null>} - The scorecard data or null if not found
 */
export async function getScorecard(id) {
  if (!id) return null;
  
  try {
    // Get the list of all scorecard files excluding the index and template
    const scorecardModules = import.meta.glob('../data/*.json', { eager: true });
    
    // Filter out the index and template files
    const excludeFiles = ['scorecardsIndex.json', 'templateScorecard.json'];
    
    // Search through all files to find one with a matching ID
    for (const path in scorecardModules) {
      const scorecard = scorecardModules[path];
      
      // Skip index and template files
      const filename = path.split('/').pop();
      if (excludeFiles.includes(filename)) continue;
      
      // If the scorecard has the matching ID, return it
      if (scorecard && scorecard.id === id) {
        return scorecard;
      }
    }
    
    console.error(`No scorecard found with ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading scorecard:', error);
    return null;
  }
} 