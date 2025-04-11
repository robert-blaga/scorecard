-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.users;

-- Then drop the foreign key constraint and auth columns
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_auth_user_id_fkey CASCADE;

ALTER TABLE public.users
DROP COLUMN IF EXISTS auth_user_id CASCADE,
DROP COLUMN IF EXISTS auth_id CASCADE;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows anyone to read the users table
CREATE POLICY "Allow public read access"
    ON public.users
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Create a policy that allows anyone to insert into the users table
CREATE POLICY "Allow public insert"
    ON public.users
    FOR INSERT
    TO PUBLIC
    WITH CHECK (true); 