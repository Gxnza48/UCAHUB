'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function incrementDownloadCount(fileId: string) {
  const supabase = await createClient();

  // Try using the RPC first (most secure/atomic)
  const { error } = await supabase.rpc('increment_download_count', { file_id: fileId });

  if (error) {
    console.error('RPC Error, falling back:', error);
    // Fallback if RPC is not yet created in the DB
    const { data: currentFile } = await supabase
      .from('files')
      .select('download_count')
      .eq('id', fileId)
      .single();

    if (currentFile) {
        await supabase
          .from('files')
          .update({ download_count: (currentFile.download_count || 0) + 1 })
          .eq('id', fileId);
    }
  }

  revalidatePath('/profile');
  revalidatePath('/hub');
  revalidatePath(`/file/${fileId}`);
}

export async function rateFile(fileId: string, userId: string, rating: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ratings')
    .upsert({ 
      file_id: fileId, 
      user_id: userId, 
      rating: rating 
    }, { onConflict: 'file_id,user_id' });

  if (error) throw error;

  revalidatePath(`/file/${fileId}`);
  revalidatePath('/profile');
}
