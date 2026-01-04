"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/project/ProjectCard";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const genres = ["All Projects", "Sci-Fi", "Fantasy", "Mystery", "Romance"];

export default function ProjectsPage() {
  const { data: session } = useSession();
  const { data: projectsData, isLoading, error } = useProjects();
  const [selectedGenre, setSelectedGenre] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const projects = projectsData?.data || [];

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesGenre =
      selectedGenre === "All Projects" ||
      project.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center bg-background-light dark:bg-background-dark p-4 justify-between border-b border-gray-200 dark:border-gray-800/50 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-900 dark:text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight flex-1 text-center font-display">
          My Bookshelf
        </h2>
        <div className="flex size-10 items-center justify-end">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-surface-dark text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            title="Sign out"
          >
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 sticky top-[73px] z-10 bg-background-light dark:bg-background-dark">
        <div className="flex w-full h-12 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center pl-4 pr-2">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            placeholder="Search titles or genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto pt-2" style={{ scrollbarWidth: "none" }}>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all ${
              selectedGenre === genre
                ? "bg-primary text-white"
                : "bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <p className="text-sm font-medium leading-normal font-display">
              {genre}
            </p>
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="px-4 flex flex-col gap-4">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-200 dark:border-gray-800 animate-pulse"
              >
                <div className="w-24 aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 p-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          // Error state
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load projects</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try again
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery || selectedGenre !== "All Projects"
                ? "No projects found"
                : "No projects yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || selectedGenre !== "All Projects"
                ? "Try adjusting your search or filter"
                : "Start your first novel by creating a new project"}
            </p>
            {!searchQuery && selectedGenre === "All Projects" && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary hover:bg-blue-600 text-white"
              >
                Create your first project
              </Button>
            )}
          </div>
        ) : (
          // Project cards
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onMenuClick={(p) => console.log("Menu clicked for", p.title)}
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 h-14 pl-5 pr-6 rounded-full bg-primary hover:bg-blue-600 text-white shadow-[0_8px_30px_rgb(60,131,246,0.3)] transition-all transform hover:scale-105 active:scale-95"
        >
          <svg
            className="w-7 h-7"
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
          <span className="font-display font-bold text-base tracking-wide">
            New Project
          </span>
        </button>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
