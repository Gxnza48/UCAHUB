import { createClient } from '@/utils/supabase/server';
import LandingContent from '@/components/LandingContent';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <LandingContent user={user} />;
}
