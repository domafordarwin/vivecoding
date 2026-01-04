"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent } from "@tiptap/react";
import { useProject } from "@/hooks/useProjects";
import { useChapters, useChapter, useAutoSaveChapter, ChapterListItem } from "@/hooks/useChapters";
import { ChapterSidebar } from "@/components/chapter/ChapterSidebar";
import { Toolbar } from "@/components/editor/Toolbar";
import { ExportModal } from "@/components/project/ExportModal";
import { countWords, estimateReadingTime } from "@/lib/countWords";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [chapterTitle, setChapterTitle] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const { data: projectData, isLoading: projectLoading } = useProject(projectId);
  const { data: chaptersData } = useChapters(projectId);
  const { data: chapterData, isLoading: chapterLoading } = useChapter(currentChapterId || "");

  const { save: autoSave, saveNow } = useAutoSaveChapter(currentChapterId || "");

  const project = projectData?.data;
  const chapters = chaptersData?.data || [];
  const chapter = chapterData?.data;

  // Set first chapter as current when loaded
  useEffect(() => {
    if (chapters.length > 0 && !currentChapterId) {
      setCurrentChapterId(chapters[0].id);
    }
  }, [chapters, currentChapterId]);

  // Update title when chapter changes
  useEffect(() => {
    if (chapter) {
      setChapterTitle(chapter.title);
    }
  }, [chapter]);

  const handleContentChange = useCallback(
    (content: string) => {
      if (currentChapterId) {
        setSaveStatus("unsaved");
        autoSave(content);

        // Set saved after debounce delay + a small buffer
        setTimeout(() => {
          setSaveStatus("saved");
        }, 5500);
      }
    },
    [currentChapterId, autoSave]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
    ],
    content: chapter?.content || "",
    editable: true,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] font-display",
      },
    },
  });

  // Update editor content when chapter changes
  useEffect(() => {
    if (editor && chapter?.content !== undefined) {
      const currentContent = editor.getHTML();
      if (chapter.content !== currentContent) {
        editor.commands.setContent(chapter.content || "");
        setSaveStatus("saved");
      }
    }
  }, [editor, chapter?.content]);

  const handleChapterSelect = (selectedChapter: ChapterListItem) => {
    // Save current chapter before switching
    if (currentChapterId && editor) {
      saveNow(editor.getHTML());
    }
    setCurrentChapterId(selectedChapter.id);
  };

  const wordCount = editor ? countWords(editor.getHTML()) : 0;
  const readingTime = estimateReadingTime(wordCount);

  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Project not found
          </h2>
          <button
            onClick={() => router.push("/projects")}
            className="text-primary hover:underline"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/projects")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{project.title}</p>
          <p className="font-bold text-gray-900 dark:text-white font-display">
            {chapterTitle || "Untitled Chapter"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Status */}
          <div className="hidden md:flex items-center gap-1.5 text-sm">
            {saveStatus === "saving" && (
              <>
                <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-gray-400">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-primary">Saved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-500">Error</span>
              </>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            title="Export project"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
          <ChapterSidebar
            projectId={projectId}
            currentChapterId={currentChapterId || undefined}
            onChapterSelect={handleChapterSelect}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-20">
            <div className="max-w-3xl mx-auto py-8 px-4 md:px-8">
              {/* Chapter Title Input */}
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Chapter Title"
                className="w-full text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 mb-6 font-display"
              />

              {/* Editor */}
              {chapterLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              ) : (
                <EditorContent editor={editor} />
              )}
            </div>
          </div>

          {/* Word Count Badge */}
          <div className="fixed bottom-16 right-4 md:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs text-gray-500 dark:text-gray-400 shadow-sm">
            <span className="font-medium">{wordCount.toLocaleString()} words</span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span>{readingTime} min read</span>
          </div>

          {/* Toolbar */}
          <Toolbar editor={editor} />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        projectId={projectId}
        projectTitle={project?.title || "Untitled"}
      />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          line-height: 1.8;
          font-size: 1.125rem;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror p {
          margin-bottom: 1rem;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #3c83f6;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
        }

        .dark .ProseMirror blockquote {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
