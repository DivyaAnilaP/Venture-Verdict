import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisData } from "@/types/analysis";

export const generatePDF = (data: AnalysisData, ideaName: string) => {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFillColor(45, 106, 99);
  doc.rect(0, 0, w, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Startup Validation Report", 14, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(ideaName.slice(0, 80), 14, 28);
  doc.text(`Score: ${data.overallScore}/100`, 14, 36);
  y = 50;

  doc.setTextColor(30, 30, 30);

  // Summary
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(data.summary, w - 28);
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 5 + 8;

  // SWOT
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SWOT Analysis", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Strengths", "Weaknesses", "Opportunities", "Threats"]],
    body: [
      [
        data.swot.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        data.swot.weaknesses.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        data.swot.opportunities.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        data.swot.threats.map((s, i) => `${i + 1}. ${s}`).join("\n"),
      ],
    ],
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [45, 106, 99] },
    theme: "grid",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Pros & Cons
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Pros & Cons", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Pros", "Cons"]],
    body: [[
      data.pros.map((p, i) => `✓ ${p}`).join("\n"),
      data.cons.map((c, i) => `✗ ${c}`).join("\n"),
    ]],
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [45, 106, 99] },
    theme: "grid",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Market Analysis
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Market Analysis", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    body: [
      ["Market Size", data.marketAnalysis.marketSize],
      ["Growth Potential", data.marketAnalysis.growthPotential],
      ["Competition", data.marketAnalysis.competition],
      ["Target Audience", data.marketAnalysis.targetAudience],
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    theme: "striped",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Financial
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Insights", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    body: [
      ["Initial Investment", data.financialInsights.estimatedInitialInvestment],
      ["Break-Even", data.financialInsights.breakEvenTimeline],
      ["Pricing Strategy", data.financialInsights.pricingStrategy],
      ["Revenue Streams", data.financialInsights.revenueStreams.join(", ")],
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
    theme: "striped",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Action Plan
  if (y > 200) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Action Plan", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Step", "Action", "Timeline"]],
    body: data.actionPlan.map((s) => [String(s.step), s.action, s.timeline]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [45, 106, 99] },
    theme: "grid",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Risk + Recommendations
  if (y > 200) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Risk Assessment (${data.riskAssessment.level.toUpperCase()})`, 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  data.riskAssessment.keyRisks.forEach((r) => {
    doc.text(`• ${r}`, 16, y);
    y += 5;
  });
  y += 4;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Key Recommendations", 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  data.recommendations.forEach((r, i) => {
    if (y > 280) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(`${i + 1}. ${r}`, w - 30);
    doc.text(lines, 16, y);
    y += lines.length * 5 + 2;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`StartupValidator Report — Page ${i}/${pageCount}`, w / 2, 290, { align: "center" });
  }

  doc.save(`startup-validation-${Date.now()}.pdf`);
};
