export interface FileSelection {
  path: string;
  sha: string;
}

export interface EditorState {
  selectedFile: FileSelection | null;
  content: string;
  originalContent: string;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
}

// For react-complex-tree
export interface TreeItem {
  index: string;
  canMove: boolean;
  isFolder: boolean;
  children?: string[];
  data: {
    name: string;
    path: string;
    sha: string;
  };
}

export interface TreeData {
  [key: string]: TreeItem;
}
