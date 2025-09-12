-- Phase 1: Migrate to Supabase Built-in Auth and Enhanced Security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin profiles table to replace admin_users
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user_id
  action TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, action, window_start)
);

-- Create security settings table
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can view admin profiles"
ON public.admin_profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admin profiles"
ON public.admin_profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can insert admin profiles"
ON public.admin_profiles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true); -- Allow system to insert logs

-- RLS Policies for rate_limits (system managed)
CREATE POLICY "Admins can view rate limits"
ON public.rate_limits FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage rate limits"
ON public.rate_limits FOR ALL
USING (true);

-- RLS Policies for security_settings
CREATE POLICY "Admins can manage security settings"
ON public.security_settings FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, 
    old_values, new_values, ip_address, user_agent
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_ip_address::inet, p_user_agent
  );
END;
$$;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 15
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_count INTEGER;
BEGIN
  -- Calculate window start time
  v_window_start := date_trunc('minute', now()) - (EXTRACT(MINUTE FROM now())::INTEGER % p_window_minutes) * INTERVAL '1 minute';
  
  -- Get current count for this window
  SELECT count INTO v_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start = v_window_start;
  
  -- If no record exists, create one
  IF v_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action, window_start, count)
    VALUES (p_identifier, p_action, v_window_start, 1)
    ON CONFLICT (identifier, action, window_start) DO UPDATE SET count = rate_limits.count + 1;
    RETURN TRUE;
  END IF;
  
  -- Check if limit exceeded
  IF v_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits
  SET count = count + 1
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start = v_window_start;
  
  RETURN TRUE;
END;
$$;

-- Create session management function
CREATE OR REPLACE FUNCTION public.manage_admin_session(
  p_user_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update or create admin profile
  INSERT INTO public.admin_profiles (user_id, last_login_at)
  VALUES (p_user_id, now())
  ON CONFLICT (user_id) DO UPDATE SET
    last_login_at = now(),
    login_attempts = 0,
    locked_until = NULL;
    
  -- Log the login event
  PERFORM log_audit_event(
    'admin_login',
    'session',
    p_user_id::text,
    NULL,
    jsonb_build_object('ip', p_ip_address, 'user_agent', p_user_agent),
    p_ip_address,
    p_user_agent
  );
END;
$$;

-- Create audit triggers for products table
CREATE OR REPLACE FUNCTION public.audit_products_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      'product_created',
      'product',
      NEW.id::text,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      'product_updated',
      'product',
      NEW.id::text,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      'product_deleted',
      'product',
      OLD.id::text,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers for audit logging
DROP TRIGGER IF EXISTS audit_products_trigger ON public.products;
CREATE TRIGGER audit_products_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION audit_products_changes();

-- Insert default security settings
INSERT INTO public.security_settings (setting_name, setting_value) VALUES
('session_timeout_minutes', '"30"'),
('max_login_attempts', '"5"'),
('lockout_duration_minutes', '"15"'),
('require_mfa', 'false'),
('password_min_length', '"12"'),
('audit_retention_days', '"90"')
ON CONFLICT (setting_name) DO NOTHING;

-- Clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON public.admin_profiles(user_id);