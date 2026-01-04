"use client";

import { useState } from "react";
import { useChapters, useCreateChapter, ChapterListItem } from "@/hooks/useChapters";
import { Button } from "@/components/ui/button";

interface ChapterSidebarProps {
  projectId: string;
  currentChapterId?: string;
  onChapterSelect: (chapter: ChapterListItem) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ChapterSidebar({
  projectId,
  currentChapterId,
  onChapterSelect,
  isOpen = true,
  onClose,
}: ChapterSidebarProps) {
  const { data: chaptersData, isLoading } = useChapters(projectId);
  const createChapter = useCreateChapter();
  const [isCreating, setIsCreating] = useState(false);

  const chapters = chaptersData?.data || [];

  const handleCreateChapter = async () => {
    setIsCreating(true);
    try {
      const nextChapterNumber = chapters.length + 1;
      const result = await createChapter.mutateAsync({
        projectId,
        title: `Chapter ${nextChapterNumber}`,
      });
      onChapterSelect(result.data);
    } catch (error) {
      console.error("Failed to create chapter:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="w-72 h-full bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white font-display">
            Chapters
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 md:hidden"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No chapters yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  chapter.id === currentChapterId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <svg
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      chapter.id === currentChapterId
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatWordCount(chapter.wordCount)} words
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Chapter Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <Button
          onClick={handleCreateChapter}
          disabled={isCreating}
          variant="outline"
          className="w-full justify-center gap-2 h-10 text-primary border-primary/30 hover:bg-primary/10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {isCreating ? "Creating..." : "New Chapter"}
        </Button>
      </div>
    </div>
  );
}
