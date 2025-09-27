// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("routes/home.tsx"),                // Home page → "/"
  route("/auth", "routes/auth.tsx"),       // Login page → "/auth"
  route("/upload", "routes/upload.tsx"),   // Resume upload → "/upload"
  route("/feedback/:id", "routes/resume-feedback.tsx"), // Resume feedback → "/feedback/:id"
  route("/wipe", "routes/wipe.tsx"),   // Wipe app data → "/wipe"
  route("*", "routes/not-found.tsx"),      // Catch-all for unmatched routes
];

export default routes;
