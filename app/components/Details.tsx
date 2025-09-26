import { cn } from "~/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion"

/** Badge showing a numeric score with a color-coded background */
const ScoreBadge = ({ score }: { score: number }) => {
  const color =
    score > 69 ? "green" : score > 39 ? "yellow" : "red"

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-[96px]",
        `bg-badge-${color}`
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p className={cn("text-sm font-medium", `text-badge-${color}-text`)}>
        {score}/100
      </p>
    </div>
  )
}

/** Accordion section header: category title + score badge */
const CategoryHeader = ({ title, score }: { title: string; score: number }) => (
  <div className="flex items-center gap-4 py-2">
    <p className="text-2xl font-semibold">{title}</p>
    <ScoreBadge score={score} />
  </div>
)

/** Accordion section content: list of tips & explanations */
const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[]
}) => (
  <div className="flex flex-col gap-4 w-full items-center">
    {/* Quick overview list */}
    <div className="grid grid-cols-2 gap-4 w-full bg-gray-50 rounded-lg px-5 py-4">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-2">
          <img
            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="tip"
            className="size-5"
          />
          <p className="text-xl text-gray-500">{tip.tip}</p>
        </div>
      ))}
    </div>

    {/* Detailed explanations */}
    <div className="flex flex-col gap-4 w-full">
      {tips.map((tip, i) => {
        const isGood = tip.type === "good"
        return (
          <div
            key={`${i}-${tip.tip}`}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4 border",
              isGood
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-yellow-50 border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex items-center gap-2">
              <img
                src={isGood ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="tip"
                className="size-5"
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        )
      })}
    </div>
  </div>
)

/** Main details section: renders all feedback categories inside an accordion */
const Details = ({ feedback }: { feedback: Feedback }) => {
  // All categories to display
  const categories = [
    ["toneAndStyle", "Tone & Style"],
    ["content", "Content"],
    ["structure", "Structure"],
    ["skills", "Skills"],
  ] as const

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        {categories.map(([key, title]) => {
          const { score, tips } = feedback[key]
          return (
            <AccordionItem id={key} key={key}>
              <AccordionHeader itemId={key}>
                <CategoryHeader title={title} score={score} />
              </AccordionHeader>
              <AccordionContent itemId={key}>
                <CategoryContent tips={tips} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default Details
