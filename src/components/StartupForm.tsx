import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Rocket, Loader2 } from "lucide-react";

interface StartupFormProps {
  onSubmit: (data: StartupFormData) => void;
  isLoading: boolean;
  initialData?: StartupFormData;
}

export interface StartupFormData {
  startupIdea: string;
  targetMarket: string;
  valueProposition: string;
  businessModel: string;
  challenges: string;
}

const StartupForm = ({ onSubmit, isLoading }: StartupFormProps) => {
  const [form, setForm] = useState<StartupFormData>({
    startupIdea: "",
    targetMarket: "",
    valueProposition: "",
    businessModel: "",
    challenges: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const update = (field: keyof StartupFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const fields: { key: keyof StartupFormData; label: string; placeholder: string }[] = [
    { key: "startupIdea", label: "Startup Idea", placeholder: "Describe your startup idea in detail..." },
    { key: "targetMarket", label: "Target Market", placeholder: "Who is your target market? Describe your ideal customers..." },
    { key: "valueProposition", label: "Unique Value Proposition", placeholder: "What makes your solution unique? How does it solve the problem better than existing solutions?" },
    { key: "businessModel", label: "Business Model", placeholder: "How will your startup generate revenue? (e.g., SaaS, marketplace, freemium...)" },
    { key: "challenges", label: "Key Challenges", placeholder: "What are the main challenges or risks you foresee?" },
  ];

  const isValid = Object.values(form).every((v) => v.trim().length > 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-2">
          <label className="text-sm font-semibold font-heading text-foreground">{label}</label>
          <Textarea
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="resize-none bg-card border-border focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      ))}
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full h-12 text-base font-heading font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Your Idea...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-5 w-5" />
            Validate My Startup Idea
          </>
        )}
      </Button>
    </form>
  );
};

export default StartupForm;
