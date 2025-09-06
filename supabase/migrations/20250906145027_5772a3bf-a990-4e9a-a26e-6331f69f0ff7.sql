-- Secure admin_users with Row Level Security and restrictive policies
-- 1) Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2) Drop existing policies if any (idempotent safe guards)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users'
  ) THEN
    -- Drop known policies by name if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Only admins can select admin_users') THEN
      DROP POLICY "Only admins can select admin_users" ON public.admin_users;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Only admins can insert admin_users') THEN
      DROP POLICY "Only admins can insert admin_users" ON public.admin_users;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Only admins can update admin_users') THEN
      DROP POLICY "Only admins can update admin_users" ON public.admin_users;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Only admins can delete admin_users') THEN
      DROP POLICY "Only admins can delete admin_users" ON public.admin_users;
    END IF;
  END IF;
END$$;

-- 3) Create strict policies allowing only authenticated admins
CREATE POLICY "Only admins can select admin_users"
ON public.admin_users
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert admin_users"
ON public.admin_users
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update admin_users"
ON public.admin_users
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete admin_users"
ON public.admin_users
FOR DELETE
USING (has_role(auth.uid(), 'admin'));
