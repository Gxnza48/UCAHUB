-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.users FOR SELECT
  USING ( true );
CREATE POLICY "Users can insert their own profile."
  ON public.users FOR INSERT
  WITH CHECK ( auth.uid() = id );
CREATE POLICY "Users can update own profile."
  ON public.users FOR UPDATE
  USING ( auth.uid() = id );

-- Create files table
CREATE TABLE public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  type TEXT CHECK (type IN ('summary', 'exam')),
  career TEXT,
  year INTEGER,
  subject TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Files are viewable by everyone."
  ON public.files FOR SELECT
  USING ( true );
CREATE POLICY "Authenticated users can insert files."
  ON public.files FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
CREATE POLICY "Users can update own files."
  ON public.files FOR UPDATE
  USING ( auth.uid() = user_id );
CREATE POLICY "Users can delete own files."
  ON public.files FOR DELETE
  USING ( auth.uid() = user_id );

-- Create Storage bucket for files
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true) ON CONFLICT DO NOTHING;

-- Storage bucket policies (Simplified for MVP: Authenticated users can insert, anyone can view)
CREATE POLICY "Give public access to files" ON storage.objects FOR SELECT USING (bucket_id = 'files');
CREATE POLICY "Give authenticated users upload access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');
