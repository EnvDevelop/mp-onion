import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  // Определяем размеры спиннера в зависимости от пропсов
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <svg
      className={cn("animate-spinner", sizeClasses[size], className)}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Загрузка"
    >
      <circle
        className="animate-spinner-circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground animate-pulse-subtle">Загрузка...</p>
    </div>
  );
} 