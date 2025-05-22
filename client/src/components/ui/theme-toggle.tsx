import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // We're forcing dark mode, so this button doesn't actually do anything
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Dark theme"
    >
      <Moon className="h-5 w-5" />
    </Button>
  )
}
