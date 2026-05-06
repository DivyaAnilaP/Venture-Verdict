
CREATE TABLE public.startup_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_idea TEXT NOT NULL,
  target_market TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  business_model TEXT NOT NULL,
  challenges TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES public.startup_analyses(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.startup_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses"
ON public.startup_analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
ON public.startup_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.startup_analyses FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_analyses_user_id ON public.startup_analyses(user_id);
CREATE INDEX idx_analyses_parent_id ON public.startup_analyses(parent_id);
