'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSessionValid } from '@/lib/auth/session';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSessionValid()) {
      router.push('/auth');
    }
  }, [router]);

  return <EditorLayout />;
}
