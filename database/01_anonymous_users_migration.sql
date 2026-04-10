-- 1. Enable anonymous users in your public.users table to have a fallback email
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;

-- 2. Update the trigger to handle anonymous users with the requested ID format
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  IF new.email IS NULL OR new.email = '' THEN
    -- It's an anonymous user. We will generate the ID format: random 4-digit number + random string (e.g., "4821xkqz")
    -- floor(random() * 9000 + 1000) generates a 4 digit number
    -- substring(md5(random()::text) from 1 for 4) generates a random 4-char string
    base_username := floor(random() * 9000 + 1000)::text || substring(md5(random()::text) from 1 for 4);
    final_username := base_username;
  ELSE
    base_username := split_part(new.email, '@', 1);
    final_username := base_username;
    
    WHILE EXISTS (SELECT 1 FROM public.users WHERE username = final_username) LOOP
      counter := counter + 1;
      final_username := base_username || counter::text;
    END LOOP;
  END IF;

  INSERT INTO public.users (id, email, username)
  VALUES (new.id, new.email, final_username);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
