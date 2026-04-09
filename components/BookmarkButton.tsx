'use client'

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BookmarkButton({ 
  fileId, 
  initialIsBookmarked,
  userId 
}: { 
  fileId: string; 
  initialIsBookmarked: boolean;
  userId?: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleBookmark = async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`btn-premium flex items-center justify-center gap-3 w-full py-4 text-sm font-black uppercase tracking-widest transition-all duration-500 ${
        isBookmarked 
          ? 'bg-cta text-white shadow-cta/20' 
          : 'liquid-glass text-primary border-primary/20 hover:bg-primary/5'
      }`}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'En mi Colección' : 'Coleccionar'}
    </button>
  );
}
