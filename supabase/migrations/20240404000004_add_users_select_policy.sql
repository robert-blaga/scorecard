-- Drop any existing select policy
DROP POLICY IF EXISTS "Allow public read access" ON public.users;

-- Create a new policy that allows anyone to read users
CREATE POLICY "Allow public read access"
    ON public.users
    FOR SELECT
    TO public
    USING (true);

-- Enable RLS on the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; 