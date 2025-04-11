-- Function to set session IDs in the database configuration
CREATE OR REPLACE FUNCTION public.set_session_ids(session_ids uuid)
RETURNS void AS $$
BEGIN
    -- Store the session IDs in a temporary configuration setting
    PERFORM set_config('app.current_session_ids', session_ids::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.set_session_ids(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_session_ids(uuid) TO anon; 