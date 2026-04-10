import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const fileId = 'afe13194-2d1c-4b3d-9122-39bd022824c3';
  const { data, error } = await supabase.from('files').select('file_url').eq('id', fileId).single();
  
  if (error) {
    console.error("DB error:", error);
    return;
  }
  
  const fileUrl = data.file_url;
  console.log("File URL:", fileUrl);
  
  console.log("Sending to Jina...");
  const t0 = Date.now();
  const res = await fetch(`https://r.jina.ai/${fileUrl}`);
  console.log(`Jina status: ${res.status} in ${Date.now() - t0}ms`);
  const text = await res.text();
  console.log("Response starts with:");
  console.log(text.slice(0, 500));
}

check();
