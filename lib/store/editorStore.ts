import { create } from 'zustand';
import type { FileSelection } from '@/types/editor';

interface EditorState {
  selectedFile: FileSelection | null;
  content: string;
  originalContent: string;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;

  setSelectedFile: (file: FileSelection | null) => void;
  setContent: (content: string) => void;
  setOriginalContent: (content: string) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedFile: null,
  content: '',
  originalContent: '',
  isDirty: false,
  isSaving: false,
  error: null,

  setSelectedFile: (file) =>
    set({
      selectedFile: file,
      content: '',
      originalContent: '',
      isDirty: false,
      error: null,
    }),

  setContent: (content) =>
    set((state) => ({
      content,
      isDirty: content !== state.originalContent,
    })),

  setOriginalContent: (content) =>
    set({
      originalContent: content,
      content,
      isDirty: false,
    }),

  setSaving: (saving) => set({ isSaving: saving }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      selectedFile: null,
      content: '',
      originalContent: '',
      isDirty: false,
      isSaving: false,
      error: null,
    }),
}));
