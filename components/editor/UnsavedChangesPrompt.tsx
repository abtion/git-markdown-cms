'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';

export default function UnsavedChangesPrompt() {
  const { isDirty } = useEditorStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Modern browsers require returnValue to be set
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // This component doesn't render anything
  return null;
}
