import { useState } from "react";
import { Rocket, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StartupForm, { type StartupFormData } from "@/components/StartupForm";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: StartupFormData) => {
    setIsLoading(true);
    setResults(null);
    try {
      const { data: analysis, error } = await supabase.functions.invoke("analyze-startup", {
        body: data,
      });

      if (error) throw error;
      if (analysis?.error) throw new Error(analysis.error);

      setResults(analysis);
      toast({ title: "Analysis Complete!", description: "Your startup idea has been validated." });
    } catch (err) {
      console.error(err);
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-xl font-bold">StartupValidator</h1>
          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Validate Your Startup Idea
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered analysis including SWOT, market insights, financial projections, and a step-by-step action plan.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8 shadow-sm">
          <StartupForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center py-16 space-y-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-heading font-medium">Analyzing your startup idea...</p>
            <p className="text-sm text-muted-foreground/70">This may take 15-30 seconds</p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && <AnalysisResults data={results} />}
      </main>
    </div>
  );
};

export default Index;
