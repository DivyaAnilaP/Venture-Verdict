import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, GitCompare, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SavedAnalysis } from "@/types/analysis";

interface HistoryPageProps {
  onBack: () => void;
  onView: (analysis: SavedAnalysis) => void;
  onCompare: (a: SavedAnalysis, b: SavedAnalysis) => void;
  onRefine: (analysis: SavedAnalysis) => void;
}

const HistoryPage = ({ onBack, onView, onCompare, onRefine }: HistoryPageProps) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("startup_analyses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAnalyses((data || []) as unknown as SavedAnalysis[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("startup_analyses").delete().eq("id", id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
    toast({ title: "Deleted" });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const handleCompare = () => {
    if (selected.length === 2) {
      const a = analyses.find((x) => x.id === selected[0])!;
      const b = analyses.find((x) => x.id === selected[1])!;
      onCompare(a, b);
    }
  };

  const scoreColor = (s: number) => s >= 70 ? "text-green-600" : s >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
          <h2 className="font-heading text-2xl font-bold">My Analyses</h2>
          <Badge variant="secondary">{analyses.length}</Badge>
        </div>
        {selected.length === 2 && (
          <Button onClick={handleCompare} className="bg-primary text-primary-foreground">
            <GitCompare className="mr-2 h-4 w-4" /> Compare Selected
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : analyses.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          No analyses yet. Go validate your first startup idea!
        </CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((a) => (
            <Card
              key={a.id}
              className={`cursor-pointer transition-all ${selected.includes(a.id) ? "ring-2 ring-primary" : "hover:border-primary/30"}`}
              onClick={() => toggleSelect(a.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`text-3xl font-heading font-bold ${scoreColor(a.overall_score)}`}>
                  {a.overall_score}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold truncate">{a.startup_idea.slice(0, 80)}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(a.created_at).toLocaleDateString()} • v{a.version}
                    {a.parent_id && " • Refined"}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onView(a)} title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onRefine(a)} title="Refine">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} title="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {selected.length > 0 && selected.length < 2 && (
        <p className="text-sm text-muted-foreground text-center">Select one more to compare</p>
      )}
    </div>
  );
};

export default HistoryPage;
