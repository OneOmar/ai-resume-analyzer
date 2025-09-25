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

export const generateUUID = () => crypto.randomUUID();