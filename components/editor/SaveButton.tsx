"use client";

import { useEditorStore } from "@/lib/store/editorStore";

export default function SaveButton() {
  const { selectedFile, content, isDirty, isSaving, setSaving, setError } =
    useEditorStore();

  const handleSave = async () => {
    if (!selectedFile || !isDirty || isSaving) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/github/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: selectedFile.path,
          content,
          sha: selectedFile.sha,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to save changes");
        setSaving(false);
        return;
      }

      // Reload the page to refresh file tree and SHA
      window.location.reload();
    } catch (err) {
      setError("Network error occurred");
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={!isDirty || isSaving}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
