import { getScoreStyles } from "~/lib/scoreHelpers";
import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

interface CategoryProps {
  title: string;
  score: number;
}

const Category: React.FC<CategoryProps> = ({ title, score }) => {
  const { textColor } = getScoreStyles(score);

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

interface SummaryProps {
  feedback: Feedback;
}

const Summary: React.FC<SummaryProps> = ({ feedback }) => {
  const categories = [
    { title: "Tone & Style", score: feedback.toneAndStyle.score },
    { title: "Content", score: feedback.content.score },
    { title: "Structure", score: feedback.structure.score },
    { title: "Skills", score: feedback.skills.score },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      {/* Overall gauge + heading */}
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the categories below.
          </p>
        </div>
      </div>

      {/* Categories list */}
      {categories.map(({ title, score }) => (
        <Category key={title} title={title} score={score} />
      ))}
    </div>
  );
};

export default Summary;
