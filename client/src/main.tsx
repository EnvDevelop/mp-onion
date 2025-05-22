import { createRoot } from "react-dom/client";
// Import dark mode enforcer before any other imports to ensure it's applied first
import "./lib/dark-mode-enforcer";
// Import dark theme CSS styles
import "./styles/dark-theme.css";
// Import animations
import "./styles/animations.css";
import "./index.css";
import App from "./App";

// Add class to root element to ensure dark mode
const rootElement = document.getElementById("root")!;
rootElement.classList.add("dark", "bg-background", "text-foreground");

createRoot(rootElement).render(<App />);
