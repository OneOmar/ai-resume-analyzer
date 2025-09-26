import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes conditionally and resolve conflicts.
 * @param classes Any mix of strings, arrays or conditional objects.
 */
export function cn(...classes: ClassValue[]): string {
  // clsx expects the arguments spread, not as a single array
  return twMerge(clsx(...classes))
}


/**
 * Convert bytes to a human-readable string with appropriate units
 * @param bytes - File size in bytes
 * @returns Formatted string like "1.23 MB"
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // 1 KB = 1024 Bytes
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  // Determine unit index (0 for Bytes, 1 for KB, etc.)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Convert to chosen unit and keep 2 decimal places
  const value = bytes / Math.pow(k, i);

  return `${parseFloat(value.toFixed(2))} ${sizes[i]}`;
}

/**
 * Generate a RFC-4122 compliant UUID (v4).
 */
export const generateUUID = (): string => crypto.randomUUID()
