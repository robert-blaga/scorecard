-- Drop any existing insert policy
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.users;

-- Create a new policy that allows anonymous users to insert
CREATE POLICY "Allow anonymous insert"
    ON public.users
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Enable RLS on the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; 