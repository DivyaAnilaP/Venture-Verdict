import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import type { SavedAnalysis } from "@/types/analysis";

interface CompareViewProps {
  a: SavedAnalysis;
  b: SavedAnalysis;
  onBack: () => void;
}

const CompareView = ({ a, b, onBack }: CompareViewProps) => {
  const da = a.analysis_result;
  const db = b.analysis_result;
  const diff = db.overallScore - da.overallScore;
  const DiffIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const diffColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="font-heading text-2xl font-bold">Compare Ideas</h2>
        <div className={`flex items-center gap-1 ${diffColor}`}>
          <DiffIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">{diff > 0 ? "+" : ""}{diff} pts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[a, b].map((item, idx) => {
          const d = item.analysis_result;
          return (
            <Card key={idx} className={idx === 0 ? "border-primary/30" : "border-accent/30"}>
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit mb-2">
                  {idx === 0 ? "Idea A" : "Idea B"} • v{item.version}
                </Badge>
                <CardTitle className="text-sm font-heading leading-snug">{item.startup_idea.slice(0, 100)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreGauge score={d.overallScore} />
                <p className="text-xs text-muted-foreground">{d.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-green-50 dark:bg-green-950/20">
                    <div className="font-semibold text-green-700 dark:text-green-400">Strengths</div>
                    {d.swot.strengths.map((s, i) => <div key={i} className="text-muted-foreground mt-1">• {s}</div>)}
                  </div>
                  <div className="p-2 rounded bg-red-50 dark:bg-red-950/20">
                    <div className="font-semibold text-red-700 dark:text-red-400">Weaknesses</div>
                    {d.swot.weaknesses.map((s, i) => <div key={i} className="text-muted-foreground mt-1">• {s}</div>)}
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div><span className="font-semibold">Market:</span> {d.marketAnalysis.marketSize}</div>
                  <div><span className="font-semibold">Risk:</span> <Badge variant={d.riskAssessment.level === "high" ? "destructive" : "secondary"} className="text-xs capitalize">{d.riskAssessment.level}</Badge></div>
                  <div><span className="font-semibold">Investment:</span> {d.financialInsights.estimatedInitialInvestment}</div>
                  <div><span className="font-semibold">Break-even:</span> {d.financialInsights.breakEvenTimeline}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompareView;
