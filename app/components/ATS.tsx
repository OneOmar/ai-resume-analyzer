import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const getScoreConfig = (value: number) => {
    if (value > 69)
      return {
        gradient: "from-green-100",
        icon: "/icons/ats-good.svg",
        subtitle: "Great Job!",
      };
    if (value > 49)
      return {
        gradient: "from-yellow-100",
        icon: "/icons/ats-warning.svg",
        subtitle: "Good Start",
      };
    return {
      gradient: "from-red-100",
      icon: "/icons/ats-bad.svg",
      subtitle: "Needs Improvement",
    };
  };

  const { gradient, icon, subtitle } = getScoreConfig(score);

  return (
    <div className={`bg-gradient-to-b ${gradient} to-white rounded-2xl shadow-md w-full p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={icon} alt="ATS Score Icon" className="w-12 h-12" />
        <h2 className="text-2xl font-bold">ATS Score – {score}/100</h2>
      </div>

      {/* Body */}
      <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
      <p className="text-gray-600 mb-4">
        This score reflects how well your resume is likely to perform in
        Applicant Tracking Systems used by employers.
      </p>

      {/* Suggestions */}
      <div className="space-y-3 mb-6">
        {suggestions.map(({ type, tip }, i) => (
          <div key={i} className="flex items-start gap-3">
            <img
              src={type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt={type === "good" ? "Check" : "Warning"}
              className="w-5 h-5 mt-1"
            />
            <p className={type === "good" ? "text-green-700" : "text-amber-700"}>{tip}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS filters
        and into the hands of recruiters.
      </p>
    </div>
  );
};

export default ATS;
