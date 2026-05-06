import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { startupIdea, targetMarket, valueProposition, businessModel, challenges } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an expert startup analyst and business consultant. Analyze the following startup idea and provide a comprehensive validation report.

**Startup Idea:** ${startupIdea}
**Target Market:** ${targetMarket}
**Unique Value Proposition:** ${valueProposition}
**Business Model:** ${businessModel}
**Key Challenges:** ${challenges}

Provide your analysis in the following JSON format (return ONLY valid JSON, no markdown):
{
  "overallScore": <number 1-100>,
  "summary": "<2-3 sentence executive summary>",
  "swot": {
    "strengths": ["<strength1>", "<strength2>", "<strength3>"],
    "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
    "opportunities": ["<opportunity1>", "<opportunity2>", "<opportunity3>"],
    "threats": ["<threat1>", "<threat2>", "<threat3>"]
  },
  "pros": ["<pro1>", "<pro2>", "<pro3>", "<pro4>"],
  "cons": ["<con1>", "<con2>", "<con3>", "<con4>"],
  "marketAnalysis": {
    "marketSize": "<estimated market size>",
    "growthPotential": "<high/medium/low with explanation>",
    "competition": "<competitive landscape summary>",
    "targetAudience": "<refined target audience>"
  },
  "financialInsights": {
    "revenueStreams": ["<stream1>", "<stream2>"],
    "estimatedInitialInvestment": "<range>",
    "breakEvenTimeline": "<estimated timeline>",
    "pricingStrategy": "<suggested pricing approach>"
  },
  "actionPlan": [
    {"step": 1, "action": "<action>", "timeline": "<timeline>"},
    {"step": 2, "action": "<action>", "timeline": "<timeline>"},
    {"step": 3, "action": "<action>", "timeline": "<timeline>"},
    {"step": 4, "action": "<action>", "timeline": "<timeline>"},
    {"step": 5, "action": "<action>", "timeline": "<timeline>"}
  ],
  "riskAssessment": {
    "level": "<high/medium/low>",
    "keyRisks": ["<risk1>", "<risk2>", "<risk3>"],
    "mitigationStrategies": ["<strategy1>", "<strategy2>", "<strategy3>"]
  },
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a startup analysis expert. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-startup error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
