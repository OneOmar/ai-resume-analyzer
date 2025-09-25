// app/routes/not-found.tsx
export default function NotFound() {
  // Return null to silently handle unmatched routes
  // This will prevent the Chrome DevTools error from showing
  return null;
}

// Loader that returns a 404 status for proper HTTP response
export function loader() {
  throw new Response(null, { status: 404 });
}