import { supabase } from '../lib/supabase';

/**
 * Fetches all survey answers for a specific user
 * @param {string} userId - The UUID of the user
 * @returns {Promise<Array>} Array of survey answers
 */
export const getUserSurveyAnswers = async (userId) => {
  const { data, error } = await supabase
    .from('survey_answers')
    .select(`
      *,
      survey_sessions!inner (
        id,
        created_at,
        status,
        scorecard_id
      )
    `)
    .eq('survey_sessions.user_id', userId);

  if (error) {
    console.error('Error fetching user survey answers:', error);
    throw error;
  }

  return data;
};

/**
 * Fetches summary of user's survey activity
 * @param {string} userId - The UUID of the user
 * @returns {Promise<Object>} Summary of user's survey activity
 */
export const getUserSurveySummary = async (userId) => {
  const { data, error } = await supabase
    .from('survey_sessions')
    .select(`
      id,
      created_at,
      status,
      scorecard_id,
      survey_answers (count)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user survey summary:', error);
    throw error;
  }

  return {
    totalSessions: data.length,
    completedSessions: data.filter(session => session.status === 'completed').length,
    totalAnswers: data.reduce((sum, session) => sum + session.survey_answers[0].count, 0),
    sessions: data
  };
}; 