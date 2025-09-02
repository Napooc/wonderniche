-- Tighten RLS on admin_users to prevent any client-side access to credentials
-- Ensure RLS is enabled (it should already be, but this is idempotent)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Remove existing SELECT policy that allowed admins to view rows via the client
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Note: With RLS enabled and no policies, no client (even admins) can access this table.
-- Edge functions using the service role key will continue to operate normally.
