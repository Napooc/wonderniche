-- Tighten RLS on admin_users to restrict access to admins only
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only authenticated users can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));