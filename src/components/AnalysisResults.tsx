import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, Shield, Target, DollarSign,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb, ArrowRight,
  Download, Save
} from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import SwotRadar from "@/components/SwotRadar";
import { generatePDF } from "@/lib/pdfExport";
import type { AnalysisData } from "@/types/analysis";

interface AnalysisResultsProps {
  data: AnalysisData;
  ideaName?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

const SwotCard = ({ title, items, icon: Icon, colorClass }: { title: string; items: string[]; icon: React.ElementType; colorClass: string }) => (
  <Card className="border-border/50">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-heading flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorClass}`} /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${colorClass.replace("text-", "bg-")}`} />
            {item}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const AnalysisResults = ({ data, ideaName = "Startup Idea", onSave, isSaved }: AnalysisResultsProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onSave && (
          <Button variant="outline" onClick={onSave} disabled={isSaved}>
            <Save className="mr-2 h-4 w-4" /> {isSaved ? "Saved ✓" : "Save Analysis"}
          </Button>
        )}
        <Button variant="outline" onClick={() => generatePDF(data, ideaName)}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      {/* Score & Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ScoreGauge score={data.overallScore} />
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg mb-2">Validation Score</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SWOT with Radar */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> SWOT Analysis
        </h2>
        <Card className="mb-4">
          <CardContent className="pt-6">
            <SwotRadar swot={data.swot} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SwotCard title="Strengths" items={data.swot.strengths} icon={TrendingUp} colorClass="text-green-600" />
          <SwotCard title="Weaknesses" items={data.swot.weaknesses} icon={TrendingDown} colorClass="text-red-500" />
          <SwotCard title="Opportunities" items={data.swot.opportunities} icon={Lightbulb} colorClass="text-blue-500" />
          <SwotCard title="Threats" items={data.swot.threats} icon={AlertTriangle} colorClass="text-amber-500" />
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Pros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.pros.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" /> Cons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.cons.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Market Size", value: data.marketAnalysis.marketSize },
              { label: "Growth Potential", value: data.marketAnalysis.growthPotential },
              { label: "Competition", value: data.marketAnalysis.competition },
              { label: "Target Audience", value: data.marketAnalysis.targetAudience },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                <div className="text-sm">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Initial Investment", value: data.financialInsights.estimatedInitialInvestment },
              { label: "Break-Even", value: data.financialInsights.breakEvenTimeline },
              { label: "Pricing Strategy", value: data.financialInsights.pricingStrategy },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                <div className="text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Revenue Streams</div>
            <div className="flex flex-wrap gap-2">
              {data.financialInsights.revenueStreams.map((s, i) => (
                <Badge key={i} variant="secondary" className="font-body">{s}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" /> Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.actionPlan.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-heading shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{step.action}</div>
                  <div className="text-xs text-muted-foreground mt-1">{step.timeline}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className={`border-l-4 ${
        data.riskAssessment.level === "high" ? "border-l-destructive" :
        data.riskAssessment.level === "medium" ? "border-l-accent" : "border-l-green-500"
      }`}>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Risk Assessment
            <Badge variant={data.riskAssessment.level === "high" ? "destructive" : "secondary"} className="ml-2 capitalize">
              {data.riskAssessment.level} Risk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Risks</div>
            <ul className="space-y-1">
              {data.riskAssessment.keyRisks.map((r, i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mitigation</div>
            <ul className="space-y-1">
              {data.riskAssessment.mitigationStrategies.map((s, i) => <li key={i} className="text-sm text-muted-foreground">• {s}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" /> Key Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="text-sm flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="text-primary font-bold font-heading">{i + 1}.</span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
