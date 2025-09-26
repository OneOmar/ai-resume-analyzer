import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const ResumeFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const navigate = useNavigate();

  // UI state
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users to auth page, preserving next
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume-feedback/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, id]);

  // Load resume data (KV + files) when id changes
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    let resumeObjectUrl: string | null = null;
    let imageObjectUrl: string | null = null;

    const loadResume = async () => {
      setLoading(true);
      setError(null);

      try {
        const raw = await kv.get(`resume:${id}`);
        if (!raw) throw new Error("Resume not found in KV");

        const data = JSON.parse(raw);

        // Read PDF blob and create URL
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) throw new Error("Failed to read resume file");
        resumeObjectUrl = URL.createObjectURL(new Blob([resumeBlob], { type: "application/pdf" }));
        if (!cancelled) setResumeUrl(resumeObjectUrl);

        // Read image blob and create URL
        const imgBlob = await fs.read(data.imagePath);
        if (!imgBlob) throw new Error("Failed to read resume image");
        imageObjectUrl = URL.createObjectURL(imgBlob);
        if (!cancelled) setImageUrl(imageObjectUrl);

        // Feedback may be string or structured JSON
        if (!cancelled) setFeedback(data.feedback ?? null);

        console.log("[ResumeFeedback] loaded:", { id, resumePath: data.resumePath, imagePath: data.imagePath });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error loading resume";
        console.error("[ResumeFeedback] load error:", err);
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResume();

    // Cleanup: revoke object URLs
    return () => {
      cancelled = true;
      if (resumeObjectUrl) URL.revokeObjectURL(resumeObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [id, kv]);

  return (
    <main className="!pt-0">
      {/* Nav */}
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Left: preview image (sticky) */}
        <section className="feedback-preview bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center p-6">
          {loading ? (
            <img src="/images/resume-scan-2.gif" alt="loading" className="w-48" />
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} className="w-full h-full object-contain rounded-2xl" title="resume" alt="resume preview" />
              </a>
            </div>
          ) : (
            <div className="text-gray-500">No preview available</div>
          )}
        </section>

        {/* Right: feedback content */}
        <section className="feedback-section flex-1 p-8">
          <h2 className="text-4xl text-black font-bold">Resume Review</h2>

          {/* TODO: Create dedicated Resume Feedback Components to display structured feedback */}
          {loading ? (
            <p className="mt-6 text-gray-600">Loading resume details…</p>
          ) : error ? (
            <p className="mt-6 text-red-600">Error: {error}</p>
          ) : feedback ? (
            // If feedback is structured, use Summary component
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">Summary</h3>
              {typeof feedback === "string" ? (
                <p className="text-gray-700">{feedback}</p>
              ) : (
                <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                  <Summary feedback={feedback} />
                  <ATS
                    score={feedback.ATS.score || 0}
                    suggestions={feedback.ATS.tips || []}
                  />
                  <Details feedback={feedback} />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 text-gray-600">
              <p>No feedback found for this resume yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ResumeFeedback;
