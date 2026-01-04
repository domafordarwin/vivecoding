"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProject } from "@/hooks/useProjects";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  genre: z.string().optional(),
  description: z.string().max(1000).optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const genres = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Thriller",
  "Mystery",
  "Horror",
  "Literary Fiction",
  "Non-Fiction",
];

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject.mutateAsync({
        ...data,
        genre: selectedGenre || undefined,
      });
      reset();
      setSelectedGenre("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#111418] border-gray-200 dark:border-gray-800">
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-display text-gray-900 dark:text-white">
            New Novel
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
            Start your next masterpiece
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Project Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-gray-900 dark:text-white font-medium"
            >
              Project Title
            </Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="Enter novel title..."
                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2027] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-3 pr-10 focus:border-primary focus:ring-1 focus:ring-primary h-auto"
                autoFocus
                {...register("title")}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            </div>
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-white font-medium">
              Genre
            </Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2027] text-gray-900 dark:text-white h-12">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#1b2027] border-gray-200 dark:border-gray-700">
                {genres.map((genre) => (
                  <SelectItem
                    key={genre}
                    value={genre}
                    className="text-gray-900 dark:text-white"
                  >
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-white font-medium">
              Synopsis{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              placeholder="What is your story about? Briefly describe the plot, main characters, or theme."
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2027] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-3 min-h-[140px] resize-none focus:border-primary focus:ring-1 focus:ring-primary"
              {...register("description")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-lg border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="flex-1 h-12 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold"
            >
              {createProject.isPending ? (
                "Creating..."
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Create
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
