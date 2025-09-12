-- Create admin_users table for custom authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Only authenticated users can view admin_users" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Insert the default admin user (you'll need to update the password hash)
-- This is a placeholder - the edge function will handle password hashing
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('vibewonder_admin', 'placeholder_hash');

-- Create function to update timestamps
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();