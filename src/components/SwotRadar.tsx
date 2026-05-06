import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from "recharts";
import type { AnalysisData } from "@/types/analysis";

const SwotRadar = ({ swot }: { swot: AnalysisData["swot"] }) => {
  const data = [
    { category: "Strengths", value: swot.strengths.length * 33 },
    { category: "Opportunities", value: swot.opportunities.length * 33 },
    { category: "Weaknesses", value: swot.weaknesses.length * 33 },
    { category: "Threats", value: swot.threats.length * 33 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="SWOT" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SwotRadar;
