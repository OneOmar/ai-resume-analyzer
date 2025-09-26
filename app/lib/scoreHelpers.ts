// Map a numeric score to text color, badge background + label
export function getScoreStyles(score: number) {
  if (score > 70) {
    return {
      textColor: "text-green-600",
      badgeColor: "bg-badge-green text-green-600",
      badgeText: "Strong",
    };
  }
  if (score > 49) {
    return {
      textColor: "text-yellow-600",
      badgeColor: "bg-badge-yellow text-yellow-600",
      badgeText: "Good Start",
    };
  }
  return {
    textColor: "text-red-600",
    badgeColor: "bg-badge-red text-red-600",
    badgeText: "Needs Work",
  };
}
