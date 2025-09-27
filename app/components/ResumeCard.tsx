import { Link } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "./ScoreCircle";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard = ({ resume }: ResumeCardProps) => {
  const { fs } = usePuterStore();
  const { id, companyName, jobTitle, feedback, imagePath } = resume;

  const [resumeUrl, setResumeUrl] = useState("");

  // Load resume image from Puter FS
  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        setResumeUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to load resume image:", err);
      }
    };
    loadImage();
  }, [imagePath, fs]);

  return (
    <Link to={`/feedback/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          {companyName || jobTitle ? (
            <>
              {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
              {jobTitle && <h3 className="text-lg text-gray-500 break-words">{jobTitle}</h3>}
            </>
          ) : (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore || 0} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 mt-2">
          <img
            src={resumeUrl}
            alt="resume preview"
            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top rounded-xl"
          />
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
