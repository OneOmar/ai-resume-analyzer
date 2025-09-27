// app/routes/not-found.tsx
import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <h1 className="text-gradient text-6xl font-bold">404</h1>
      <h2 className="text-3xl text-dark-200">Page Not Found</h2>
      <p className="text-gray-500 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="primary-button w-fit px-6 py-3 text-xl font-semibold"
      >
        Go Back Home
      </Link>
    </main>
  );
}

// Loader for proper HTTP 404 response
export const loader = () => ({ status: 404 });
