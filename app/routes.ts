// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Register all your routes
export default [
  index("routes/home.tsx"),             // maps to "/" (home page)
  route("/auth", "routes/auth.tsx"),    // maps to "/auth" (login page)
  route("/upload", "routes/upload.tsx"),
  route("*", "routes/not-found.tsx"),   // Catch-all for any unmatched routes
] satisfies RouteConfig;
