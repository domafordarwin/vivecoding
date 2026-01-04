"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect, useMemo } from "react";
import { countWords, estimateReadingTime } from "@/lib/countWords";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function Editor({
  content,
  onChange,
  placeholder = "Start writing your story...",
  editable = true,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] font-display",
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const wordCount = useMemo(() => {
    return countWords(editor?.getHTML() || "");
  }, [editor?.state.doc]);

  const readingTime = useMemo(() => {
    return estimateReadingTime(wordCount);
  }, [wordCount]);

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className="min-h-[400px] px-4 py-6 md:px-8"
      />

      {/* Word count badge */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">{wordCount.toLocaleString()} words</span>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <span>{readingTime} min read</span>
      </div>

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

export { useEditor };
