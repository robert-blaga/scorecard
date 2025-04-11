-- Add unique constraint to survey_answers table
ALTER TABLE survey_answers
ADD CONSTRAINT survey_answers_session_question_unique 
UNIQUE (session_id, scorecard_id, question_id);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_survey_answers_session_id ON survey_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_scorecard_id ON survey_answers(scorecard_id); 