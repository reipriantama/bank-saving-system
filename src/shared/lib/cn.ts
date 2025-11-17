import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values into a single string, handling conditional and deduplicated class names.
 *
 * This utility function combines the functionality of `clsx` (for conditional class names)
 * and `twMerge` (for intelligently merging Tailwind CSS classes).
 *
 * @param inputs - An array of class values (strings, arrays, objects, etc.) to be merged.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
