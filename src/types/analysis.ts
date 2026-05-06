export interface AnalysisData {
  overallScore: number;
  summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pros: string[];
  cons: string[];
  marketAnalysis: {
    marketSize: string;
    growthPotential: string;
    competition: string;
    targetAudience: string;
  };
  financialInsights: {
    revenueStreams: string[];
    estimatedInitialInvestment: string;
    breakEvenTimeline: string;
    pricingStrategy: string;
  };
  actionPlan: { step: number; action: string; timeline: string }[];
  riskAssessment: {
    level: string;
    keyRisks: string[];
    mitigationStrategies: string[];
  };
  recommendations: string[];
}

export interface SavedAnalysis {
  id: string;
  user_id: string;
  startup_idea: string;
  target_market: string;
  value_proposition: string;
  business_model: string;
  challenges: string;
  analysis_result: AnalysisData;
  overall_score: number;
  version: number;
  parent_id: string | null;
  created_at: string;
}
