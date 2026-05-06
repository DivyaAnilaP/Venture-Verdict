import { useEffect, useState } from "react";

const ScoreGauge = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const color = animatedScore >= 70 ? "#16a34a" : animatedScore >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
          className="transition-all duration-300"
        />
        <text x="75" y="70" textAnchor="middle" className="font-heading" fontSize="32" fontWeight="700" fill={color}>
          {animatedScore}
        </text>
        <text x="75" y="92" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">
          out of 100
        </text>
      </svg>
    </div>
  );
};

export default ScoreGauge;
