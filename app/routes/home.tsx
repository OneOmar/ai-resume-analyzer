import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind – AI Resume Analyzer" },
    { name: "description", content: "Get instant AI feedback on your resume and improve your chances of getting hired." },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  // Load resumes from KV store
  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);
      try {
        const items = (await kv.list("resume:*", true)) as KVItem[];
        const parsed = items?.map((i) => JSON.parse(i.value) as Resume) || [];
        console.log("Resumes loaded:", parsed);
        setResumes(parsed);
      } catch (err) {
        console.error("Failed to load resumes:", err);
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, [kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        {/* Page heading */}
        <div className="page-heading py-16 text-center">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>
            {!loadingResumes && resumes.length === 0
              ? "No resumes found. Upload and check AI-powered feedback."
              : "Review your submissions and check AI-powered feedback."}
          </h2>
        </div>

        {/* Loading state */}
        {loadingResumes && (
          <div className="flex justify-center">
            <img src="/images/resume-scan-2.gif" alt="resume scan" className="w-[200px]" />
          </div>
        )}

        {/* Resumes list */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section flex flex-wrap gap-4 justify-center">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex justify-center mt-10">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
