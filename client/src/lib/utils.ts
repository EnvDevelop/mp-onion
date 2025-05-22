import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Объединяет множество классов в одну строку, корректно обрабатывая
 * дублирующиеся и конфликтующие Tailwind классы
 * @param inputs Список классов, которые нужно объединить
 * @returns Объединенная строка классов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
