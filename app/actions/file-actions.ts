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

export async function deleteFile(fileId: string, fileUrl: string) {
  const supabase = await createClient();

  // 1. Delete from storage if it's a Supabase URL
  if (fileUrl.includes('storage/v1/object/public/files')) {
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([fileName]);
      if (storageError) console.error('Storage Delete Error:', storageError);
    }
  }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (dbError) throw dbError;

  revalidatePath('/profile');
  revalidatePath('/hub');
}

export async function updateFile(fileId: string, data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('files')
    .update({
      title: data.title,
      description: data.description,
      subject: data.subject,
      career: data.career,
      type: data.type,
      year: data.year
    })
    .eq('id', fileId);

  if (error) throw error;

  revalidatePath('/profile');
  revalidatePath('/hub');
  revalidatePath(`/file/${fileId}`);
}
