"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Distraction-Free Writing",
    description:
      "Immerse yourself in your story with our intuitive, focused editor designed for flow states.",
    icon: (
      <svg
        className="w-24 h-24 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    title: "Master Your Plot",
    description:
      "Organize characters, timelines, and research in one unified workspace.",
    icon: (
      <svg
        className="w-24 h-24 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Creativity Everywhere",
    description:
      "Seamlessly sync across all your devices. Never lose a sudden idea again.",
    icon: (
      <svg
        className="w-24 h-24 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8v8a2 2 0 002 2M21 8v8a2 2 0 01-2 2"
        />
      </svg>
    ),
    gradient: "from-pink-500/20 to-orange-500/20",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const slideWidth = scrollRef.current.offsetWidth;
        const newSlide = Math.round(scrollLeft / slideWidth);
        setCurrentSlide(newSlide);
      }
    };

    const scrollContainer = scrollRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col font-display text-slate-900 dark:text-white overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* TopAppBar */}
      <div className="flex items-center justify-between bg-transparent p-4 pb-2 z-10">
        <div className="w-12" />
        <h2 className="text-xl font-bold leading-tight tracking-tight text-center">
          Novel Writer
        </h2>
        <button
          onClick={() => router.push("/login")}
          className="w-12 text-sm font-medium text-primary opacity-80 hover:opacity-100 transition-opacity"
        >
          Skip
        </button>
      </div>

      {/* Main Content Area: Carousel + Text */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 px-4 gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full flex flex-col items-center justify-start snap-center gap-6"
            >
              {/* Slide Image/Icon Placeholder */}
              <div
                className={`w-full max-w-sm aspect-[4/5] bg-gradient-to-br ${slide.gradient} rounded-xl shadow-2xl shadow-primary/10 relative overflow-hidden flex items-center justify-center`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {slide.icon}
                  <div className="w-16 h-1 rounded-full bg-primary/50" />
                </div>
              </div>
              {/* Text Content */}
              <div className="px-4 text-center max-w-xs">
                <h2 className="text-2xl md:text-[28px] font-bold leading-tight pb-3">
                  {slide.title}
                </h2>
                <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Page Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-6 bg-primary"
                  : "w-2 bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 px-6 pb-8 pt-2">
        <Button
          onClick={() => router.push("/register")}
          className="w-full rounded-xl h-14 bg-primary hover:bg-blue-600 transition-colors text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/25"
        >
          Create Account
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/login")}
          className="w-full rounded-xl h-12 bg-transparent text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-base font-medium leading-normal"
        >
          I already have an account
        </Button>
      </div>
    </div>
  );
}
