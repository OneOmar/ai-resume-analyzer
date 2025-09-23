import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  // Set the page title and meta description for SEO
  return [
    { title: "Resumind – AI Resume Analyzer" },
    { name: "description", content: "Get instant AI feedback on your resume and improve your chances of getting hired." },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  // Redirect unauthenticated users to /auth
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/"); // preserve intended route after login
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      {/* Global navbar */}
      <Navbar />

      <section className="main-section">
        {/* Page heading */}
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>

        {/* List of resume cards */}
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
