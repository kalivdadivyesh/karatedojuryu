-- Create belts table to dynamically manage belt levels
CREATE TABLE public.belts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  color_class TEXT NOT NULL,
  text_color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.belts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Belts readable by all" ON public.belts FOR SELECT USING (true);
CREATE POLICY "Service role can manage belts" ON public.belts FOR ALL TO service_role WITH CHECK (true);

-- Insert default belts
INSERT INTO public.belts (rank, name, color_class, text_color, description) VALUES
(1, 'White', 'bg-white', 'text-black', 'Beginning level'),
(2, 'Yellow', 'bg-yellow-400', 'text-black', 'Beginner'),
(3, 'Blue', 'bg-blue-500', 'text-white', 'Intermediate'),
(4, 'Green', 'bg-green-500', 'text-white', 'Advanced'),
(5, 'Black', 'bg-black border border-white/20', 'text-white', 'Master level')
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_belts_updated_at
  BEFORE UPDATE ON public.belts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
