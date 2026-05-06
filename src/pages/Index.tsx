import { useState, useEffect } from "react";
import { Rocket, Sparkles, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StartupForm, { type StartupFormData } from "@/components/StartupForm";
import AnalysisResults from "@/components/AnalysisResults";
import AuthPage from "@/components/AuthPage";
import HistoryPage from "@/components/HistoryPage";
import CompareView from "@/components/CompareView";
import type { AnalysisData, SavedAnalysis } from "@/types/analysis";
import type { Session } from "@supabase/supabase-js";

type View = "form" | "history" | "compare" | "viewSaved";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<StartupFormData | null>(null);
  const [view, setView] = useState<View>("form");
  const [compareA, setCompareA] = useState<SavedAnalysis | null>(null);
  const [compareB, setCompareB] = useState<SavedAnalysis | null>(null);
  const [viewedAnalysis, setViewedAnalysis] = useState<SavedAnalysis | null>(null);
  const [refineFrom, setRefineFrom] = useState<SavedAnalysis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (data: StartupFormData) => {
    setIsLoading(true);
    setResults(null);
    setIsSaved(false);
    setCurrentFormData(data);
    try {
      const { data: analysis, error } = await supabase.functions.invoke("analyze-startup", { body: data });
      if (error) throw error;
      if (analysis?.error) throw new Error(analysis.error);
      setResults(analysis);
      setView("form");
      toast({ title: "Analysis Complete!", description: "Your startup idea has been validated." });
    } catch (err) {
      toast({ title: "Analysis Failed", description: err instanceof Error ? err.message : "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results || !currentFormData || !session) return;
    try {
      const { error } = await supabase.from("startup_analyses").insert({
        user_id: session.user.id,
        startup_idea: currentFormData.startupIdea,
        target_market: currentFormData.targetMarket,
        value_proposition: currentFormData.valueProposition,
        business_model: currentFormData.businessModel,
        challenges: currentFormData.challenges,
        analysis_result: results as unknown as Record<string, never>,
        overall_score: results.overallScore,
        version: refineFrom ? refineFrom.version + 1 : 1,
        parent_id: refineFrom?.id || null,
      });
      if (error) throw error;
      setIsSaved(true);
      toast({ title: "Saved!", description: "Analysis saved to your history." });
    } catch (err) {
      toast({ title: "Save Failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    }
  };

  const handleRefine = (analysis: SavedAnalysis) => {
    setRefineFrom(analysis);
    setResults(null);
    setIsSaved(false);
    setView("form");
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <Sparkles className="h-8 w-8 text-primary animate-spin" />
    </div>;
  }

  if (!session) {
    return <AuthPage onAuth={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center cursor-pointer"
            onClick={() => { setView("form"); setResults(null); setRefineFrom(null); }}>
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-xl font-bold cursor-pointer"
            onClick={() => { setView("form"); setResults(null); setRefineFrom(null); }}>StartupValidator</h1>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView("history")}>
              <History className="mr-1 h-4 w-4" /> History
            </Button>
            <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {view === "history" && (
          <HistoryPage
            onBack={() => setView("form")}
            onView={(a) => { setViewedAnalysis(a); setView("viewSaved"); }}
            onCompare={(a, b) => { setCompareA(a); setCompareB(b); setView("compare"); }}
            onRefine={handleRefine}
          />
        )}

        {view === "compare" && compareA && compareB && (
          <CompareView a={compareA} b={compareB} onBack={() => setView("history")} />
        )}

        {view === "viewSaved" && viewedAnalysis && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setView("history")} className="mb-4">
              ← Back to History
            </Button>
            <AnalysisResults data={viewedAnalysis.analysis_result} ideaName={viewedAnalysis.startup_idea} />
          </div>
        )}

        {view === "form" && (
          <>
            <div className="text-center space-y-3">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {refineFrom ? "Refine Your Idea" : "Validate Your Startup Idea"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {refineFrom
                  ? `Iterating on v${refineFrom.version} (Score: ${refineFrom.overall_score}/100). Modify your inputs and re-analyze.`
                  : "Get instant AI-powered analysis including SWOT, market insights, financial projections, and a step-by-step action plan."}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8 shadow-sm">
              <StartupForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialData={refineFrom ? {
                  startupIdea: refineFrom.startup_idea,
                  targetMarket: refineFrom.target_market,
                  valueProposition: refineFrom.value_proposition,
                  businessModel: refineFrom.business_model,
                  challenges: refineFrom.challenges,
                } : undefined}
              />
            </div>

            {isLoading && (
              <div className="flex flex-col items-center py-16 space-y-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary animate-spin" />
                </div>
                <p className="text-muted-foreground font-heading font-medium">Analyzing your startup idea...</p>
                <p className="text-sm text-muted-foreground/70">This may take 15-30 seconds</p>
              </div>
            )}

            {results && !isLoading && (
              <AnalysisResults
                data={results}
                ideaName={currentFormData?.startupIdea}
                onSave={handleSave}
                isSaved={isSaved}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
