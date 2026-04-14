
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hex_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users readable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users insertable" ON public.users FOR INSERT WITH CHECK (true);

CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_hex_id TEXT NOT NULL REFERENCES public.users(hex_id) ON DELETE CASCADE,
  attended_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  upcoming_classes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attendance readable" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Attendance insertable" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Attendance updatable" ON public.attendance FOR UPDATE USING (true);

CREATE TABLE public.progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_hex_id TEXT NOT NULL REFERENCES public.users(hex_id) ON DELETE CASCADE,
  belt_level TEXT NOT NULL DEFAULT 'White',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Progress readable" ON public.progress FOR SELECT USING (true);
CREATE POLICY "Progress insertable" ON public.progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Progress updatable" ON public.progress FOR UPDATE USING (true);

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles readable" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Roles insertable" ON public.user_roles FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
