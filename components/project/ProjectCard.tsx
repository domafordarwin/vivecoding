"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/hooks/useProjects";

const genreColors: Record<string, { bg: string; text: string; ring: string }> = {
  "Science Fiction": {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-700/10 dark:ring-blue-400/20",
  },
  "Sci-Fi": {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-700/10 dark:ring-blue-400/20",
  },
  Fantasy: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-700/10 dark:ring-amber-400/20",
  },
  Mystery: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    ring: "ring-purple-700/10 dark:ring-purple-400/20",
  },
  Romance: {
    bg: "bg-pink-50 dark:bg-pink-900/30",
    text: "text-pink-700 dark:text-pink-300",
    ring: "ring-pink-700/10 dark:ring-pink-400/20",
  },
  Thriller: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    ring: "ring-red-700/10 dark:ring-red-400/20",
  },
  Horror: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    ring: "ring-gray-700/10 dark:ring-gray-400/20",
  },
  "Literary Fiction": {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-700/10 dark:ring-emerald-400/20",
  },
  "Non-Fiction": {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    text: "text-slate-700 dark:text-slate-300",
    ring: "ring-slate-700/10 dark:ring-slate-400/20",
  },
};

const defaultGenreColor = {
  bg: "bg-gray-100 dark:bg-gray-800",
  text: "text-gray-600 dark:text-gray-400",
  ring: "ring-gray-700/10 dark:ring-gray-400/20",
};

interface ProjectCardProps {
  project: Project;
  onMenuClick?: (project: Project) => void;
}

export function ProjectCard({ project, onMenuClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const genreStyle = project.genre
    ? genreColors[project.genre] || defaultGenreColor
    : defaultGenreColor;

  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const isDraft = project.wordCount === 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className={`group relative flex overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md active:scale-[0.99] ${
          isDraft ? "opacity-75" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Book Cover Thumbnail */}
        <div
          className={`w-24 shrink-0 aspect-[2/3] flex items-center justify-center relative ${
            isDraft
              ? "bg-gray-100 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-800"
              : "bg-gradient-to-br from-primary/20 to-purple-500/20"
          }`}
        >
          {isDraft ? (
            <svg
              className="w-10 h-10 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
              <svg
                className="w-10 h-10 text-white/80 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 justify-between">
          {/* Top Row: Genre & Menu */}
          <div className="flex justify-between items-start mb-1">
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset font-display ${genreStyle.bg} ${genreStyle.text} ${genreStyle.ring}`}
            >
              {project.genre || (isDraft ? "Draft" : "Uncategorized")}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMenuClick?.(project);
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 -mt-1 -mr-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>

          {/* Title & Synopsis */}
          <div className="mb-3">
            <h3
              className={`text-gray-900 dark:text-white text-lg font-bold leading-tight font-display mb-1 ${
                isDraft ? "italic" : ""
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-gray-500 dark:text-gray-400 text-sm font-normal leading-snug line-clamp-2 ${
                isDraft ? "italic" : ""
              }`}
            >
              {project.description ||
                (isDraft
                  ? "No synopsis available yet. Start writing to add details."
                  : "No synopsis available.")}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <svg
                className={`w-4 h-4 ${isDraft ? "text-gray-400" : "text-primary"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span className="font-medium">
                {formatWordCount(project.wordCount)} words
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {isDraft ? "Created" : "Edited"} {formatDate(project.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
