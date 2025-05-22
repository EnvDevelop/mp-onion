import { useContext } from "react";
import { ThemeProviderContext } from "@/lib/theme-provider";

// Simple hook to access theme context
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  // Add a toggle function that actually does nothing since we're forcing dark mode
  const toggleTheme = () => {
    // No-op function as we're enforcing dark theme
    context.setTheme("dark");
  };

  return {
    ...context,
    toggleTheme
  };
} 