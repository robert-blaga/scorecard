-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own data"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth_id = auth.uid());

-- Create policy to allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert"
    ON public.users
    FOR INSERT
    TO anon
    WITH CHECK (true); 