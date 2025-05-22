import { ReactNode, createContext, useEffect } from "react";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: string;
  setTheme: (theme: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  // Always set dark theme
  const theme = "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any other theme classes
    root.classList.remove("light");
    
    // Add dark class
    root.classList.add("dark");
    
    // Set dark attribute for any elements that might rely on it
    root.setAttribute("data-theme", "dark");
    
    // Set dark color scheme
    document.body.style.colorScheme = "dark";
    document.body.classList.add("bg-background", "text-foreground");
    
    // Store the theme in localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // This provider forces dark mode and ignores any attempts to change it
  const value = {
    theme,
    setTheme: () => null, // No-op function since we're forcing dark mode
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
} 