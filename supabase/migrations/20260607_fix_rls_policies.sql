-- Fix RLS policies to allow service role and proper inserts

-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update users" ON public.users;

-- Create open policies for service role (functions use service role)
CREATE POLICY "Service role can do everything on users"
ON public.users FOR ALL
TO service_role
WITH CHECK (true);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
ON public.users FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

-- Allow admins to update
CREATE POLICY "Admins can update users"
ON public.users FOR UPDATE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (true);
