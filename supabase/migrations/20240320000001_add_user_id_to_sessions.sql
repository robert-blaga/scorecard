-- Add user_id column to survey_sessions table
ALTER TABLE survey_sessions
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for user_id to improve query performance
CREATE INDEX idx_survey_sessions_user_id ON survey_sessions(user_id);

-- Add a function to automatically update user_id when a user registers
CREATE OR REPLACE FUNCTION public.link_session_to_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Update any existing survey sessions with the new user's ID
    UPDATE survey_sessions
    SET user_id = NEW.id
    WHERE id IN (
        SELECT ss.id 
        FROM survey_sessions ss
        WHERE ss.user_id IS NULL 
        AND ss.id = ANY(string_to_array(current_setting('app.current_session_ids', true), ',')::uuid[])
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run when new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.link_session_to_user(); 