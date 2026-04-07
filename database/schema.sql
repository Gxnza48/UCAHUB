-- 1. Create users table (if you haven't already, otherwise it will just error and skip)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  last_username_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure we add the last_username_update column if the table already existed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_username_update TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Users can update own profile." ON public.users;
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING ( auth.uid() = id );

-- 2. CREATE THE MISSING TRIGGER TO INSERT USERS UPON REGISTRATION!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. FIX: Backfill any users that registered while the trigger wasn't active!
INSERT INTO public.users (id, email, username)
SELECT id, email, split_part(email, '@', 1) FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Create files table
CREATE TABLE IF NOT EXISTS public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  type TEXT,
  career TEXT,
  year INTEGER,
  subject TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure old restriction is dropped if the table already existed
ALTER TABLE public.files DROP CONSTRAINT IF EXISTS files_type_check;

-- RLS for files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Files are viewable by everyone." ON public.files;
CREATE POLICY "Files are viewable by everyone." ON public.files FOR SELECT USING ( true );
DROP POLICY IF EXISTS "Authenticated users can insert files." ON public.files;
CREATE POLICY "Authenticated users can insert files." ON public.files FOR INSERT WITH CHECK ( auth.role() = 'authenticated' AND auth.uid() = user_id );
DROP POLICY IF EXISTS "Users can update own files." ON public.files;
CREATE POLICY "Users can update own files." ON public.files FOR UPDATE USING ( auth.uid() = user_id );
DROP POLICY IF EXISTS "Users can delete own files." ON public.files;
CREATE POLICY "Users can delete own files." ON public.files FOR DELETE USING ( auth.uid() = user_id );

-- 5. Create Storage bucket for files
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true) ON CONFLICT DO NOTHING;

-- Storage bucket policies
DROP POLICY IF EXISTS "Give public access to files" ON storage.objects;
CREATE POLICY "Give public access to files" ON storage.objects FOR SELECT USING (bucket_id = 'files');
DROP POLICY IF EXISTS "Give authenticated users upload access" ON storage.objects;
CREATE POLICY "Give authenticated users upload access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');
