import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export interface Chapter {
  id: string;
  title: string;
  content: string | null;
  wordCount: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
  };
}

export interface ChapterListItem {
  id: string;
  title: string;
  wordCount: number;
  orderIndex: number;
  updatedAt: string;
}

interface ChaptersResponse {
  data: ChapterListItem[];
  success: boolean;
}

interface ChapterResponse {
  data: Chapter;
  success: boolean;
}

interface CreateChapterInput {
  projectId: string;
  title: string;
  content?: string;
}

interface UpdateChapterInput {
  id: string;
  title?: string;
  content?: string;
}

// Fetch all chapters for a project
export function useChapters(projectId: string) {
  return useQuery<ChaptersResponse>({
    queryKey: ["chapters", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/chapters`);
      if (!response.ok) {
        throw new Error("Failed to fetch chapters");
      }
      return response.json();
    },
    enabled: !!projectId,
  });
}

// Fetch single chapter
export function useChapter(id: string) {
  return useQuery<ChapterResponse>({
    queryKey: ["chapter", id],
    queryFn: async () => {
      const response = await fetch(`/api/chapters/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chapter");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Create chapter
export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, title, content }: CreateChapterInput) => {
      const response = await fetch(`/api/projects/${projectId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create chapter");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// Update chapter
export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateChapterInput) => {
      const response = await fetch(`/api/chapters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update chapter");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chapter", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// Delete chapter
export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/chapters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete chapter");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// Auto-save chapter with debounce
export function useAutoSaveChapter(chapterId: string, delay = 5000) {
  const queryClient = useQueryClient();
  const previousContent = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const save = useCallback(
    async (content: string) => {
      // Skip if content hasn't changed
      if (content === previousContent.current) {
        return { skipped: true };
      }

      isSavingRef.current = true;

      try {
        const response = await fetch(`/api/chapters/${chapterId}/autosave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error("Autosave failed");
        }

        const result = await response.json();
        previousContent.current = content;

        // Invalidate queries to update word counts
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({ queryKey: ["chapters"] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });

        return result;
      } finally {
        isSavingRef.current = false;
      }
    },
    [chapterId, queryClient]
  );

  const debouncedSave = useCallback(
    (content: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        save(content);
      }, delay);
    },
    [save, delay]
  );

  const cancelPendingSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    save: debouncedSave,
    saveNow: save,
    cancelPendingSave,
    isSaving: () => isSavingRef.current,
  };
}
