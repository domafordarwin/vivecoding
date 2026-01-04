"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Decorative Background Element */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
      />
      {/* Main Content Container */}
      <main className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-8 max-w-md mx-auto w-full relative z-10">
        {children}
      </main>
      {/* Bottom spacing for iOS safe area */}
      <div className="h-6 w-full" />
    </div>
  );
}
