import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar, 
  Clock, 
  Search, 
  Database, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  FileCheck 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Language, t } from '../utils/translations';

interface ReportsViewProps {
  reports: any[];
  onDeleteReport: (id: string) => void;
  language: Language;
}

// Simple inline markdown text decorator
function parseInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Custom simple markdown formatter to output beautiful spaced paragraphs and list structures in the preview
function renderPreviewMarkdown(text: string) {
  let processedText = text;
  processedText = processedText.replace(/\s\*\s\*\*/g, '\n* **');
  processedText = processedText.replace(/\s###\s/g, '\n\n### ');

  const lines = processedText.replace(/\r\n/g, '\n').split('\n');
  
  return (
    <div className="space-y-2 font-sans text-xs">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Heading 3
        if (trimmed.startsWith('###')) {
          const content = trimmed.replace(/^###\s*/, '');
          return (
            <h4 key={idx} className="text-xs font-bold text-[#A78BFA] mt-3 mb-1 tracking-wide">
              {parseInlineMarkdown(content)}
            </h4>
          );
        }

        // Bullet lists starting with *
        if (trimmed.startsWith('*') && !trimmed.startsWith('**')) {
          const content = trimmed.replace(/^\*\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5 text-white/80 my-0.5 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="flex-1 text-[11px]">{parseInlineMarkdown(content)}</span>
            </div>
          );
        }

        // Bullet lists starting with -
        if (trimmed.startsWith('-')) {
          const content = trimmed.replace(/^-\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5 text-white/80 my-0.5 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="flex-1 text-[11px]">{parseInlineMarkdown(content)}</span>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-white/85 leading-relaxed text-[11px]">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function ReportsView({ reports, onDeleteReport, language }: ReportsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  // Auto-select first report if the selected one is deleted
  const activeReportId = reports.find(r => r.id === selectedReportId) 
    ? selectedReportId 
    : reports.length > 0 ? reports[0].id : null;

  const selectedReport = reports.find(r => r.id === activeReportId);

  // Filtered reports
  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PDF Download Trigger using jsPDF
  const handleDownloadPDF = (report: any) => {
    if (!report) return;

    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2); // 170mm

      // 1. Dark Header Band
      doc.setFillColor(11, 18, 32); // Deep slate/navy
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Header Brand text
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('AnalytixAI', margin, 20);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(167, 139, 250); // Muted lavender
      doc.text('EXECUTIVE INTELLIGENCE LEDGER', margin, 27);

      // 2. Report Information Meta Block
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text(report.title, margin, 58);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Timestamp: ${report.timestamp}   |   Source Dataset: ${report.filename}`, margin, 65);

      // Fine grey divider
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(margin, 70, pageWidth - margin, 70);

      // 3. AI Executive Summary (Highlighted block)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129); // Emerald green
      doc.text('1. AI EXECUTIVE SUMMARY', margin, 80);

      // Dynamic Wrap Summary text to fit PDF dimensions
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85); // Slate-700
      
      const summaryLines = doc.splitTextToSize(report.summary, contentWidth - 10);
      const summaryBlockHeight = Math.max(34, summaryLines.length * 5 + 10);

      // Draw light green tint box
      doc.setFillColor(240, 253, 250); // Emerald 50
      doc.rect(margin, 85, contentWidth, summaryBlockHeight, 'F');
      doc.setDrawColor(209, 250, 229); // Emerald 100 border
      doc.rect(margin, 85, contentWidth, summaryBlockHeight, 'S');

      doc.text(summaryLines, margin + 5, 92);

      // 4. Core KPIs grid
      const kpiY = 92 + summaryBlockHeight + 12;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('2. CORE PERFORMANCE INDICATORS', margin, kpiY);

      const kpis = [
        { label: 'Total Revenue', val: `$${report.kpis.totalRevenue.toLocaleString()}` },
        { label: 'Growth rate', val: `${report.kpis.growthPercent >= 0 ? '+' : ''}${report.kpis.growthPercent}%` },
        { label: 'Active Users', val: `${report.kpis.activeUsers.toLocaleString()}` },
        { label: 'Churn Target', val: `${report.kpis.churnRate}%` }
      ];

      let cardX = margin;
      const cardWidth = contentWidth / 4 - 3; // ~39.5mm

      kpis.forEach((kpi) => {
        // Draw KPI Card
        doc.setFillColor(248, 250, 252); // Slate-50
        doc.rect(cardX, kpiY + 5, cardWidth, 20, 'F');
        doc.setDrawColor(226, 232, 240); // Slate-200 border
        doc.rect(cardX, kpiY + 5, cardWidth, 20, 'S');

        // Write label
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label.toUpperCase(), cardX + 3, kpiY + 11);

        // Write value
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text(kpi.val, cardX + 3, kpiY + 19);

        cardX += cardWidth + 4;
      });

      // 5. Strategic Insights & Recommendations
      const detailsY = kpiY + 38;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('3. ACTIONABLE PORTFOLIO RECOMMENDATIONS', margin, detailsY);

      let currentY = detailsY + 7;
      const recs = report.recommendations || [];
      
      recs.slice(0, 3).forEach((rec: any, idx: number) => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(79, 70, 229); // Purple Indigo
        doc.text(`${idx + 1}. Recommendation: ${rec.action}`, margin, currentY);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Level: ${rec.impact}`, margin, currentY + 4.5);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const splitRationale = doc.splitTextToSize(`Strategy: ${rec.rationale}`, contentWidth);
        doc.text(splitRationale, margin, currentY + 9);

        currentY += 19;
      });

      // Footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Page 1 of 1  •  Confidential executive intelligence report compiled by AnalytixAI.', margin, 282);

      // Save the generated PDF file with timestamp formatted name
      const safeTitle = report.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      doc.save(`${safeTitle}.pdf`);
    } catch (error) {
      console.error('PDF Generation Failure:', error);
      alert('Encountered an issue compiling the downloadable PDF document. Please retry.');
    }
  };

  return (
    <div id="reports-module" className="flex-1 flex flex-col h-full bg-[#050508] overflow-hidden select-none">
      
      {/* Page Header */}
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between bg-[#060913]/60 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">{t('rep.title', language)}</h2>
          <p className="text-xs text-white/40 mt-1 font-sans">
            {t('rep.subtitle', language)}
          </p>
        </div>
        <div className="text-[10px] font-mono bg-white/[0.02] border border-white/[0.05] text-white/50 px-3 py-1.5 rounded-lg">
          {t('rep.saved_copies', language)}: <span className="text-[#10B981] font-bold">{reports.length}</span>
        </div>
      </div>

      {reports.length === 0 ? (
        /* Empty State Layout */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-violet-500/5 border border-violet-500/10 flex items-center justify-center mb-5 animate-pulse">
            <FileText className="w-7 h-7 text-violet-400/70" />
          </div>
          <h3 className="text-md font-bold text-white tracking-wide">{t('rep.no_reports_title', language)}</h3>
          <p className="text-xs text-white/50 leading-relaxed mt-2 mb-6">
            {t('rep.no_reports_desc', language)}
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] text-white/40 font-mono">
            <span>READY TO COMPILE PROTOCOL</span>
          </div>
        </div>
      ) : (
        /* Master-Detail Split Screen Layout */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* ================= LEFT MASTER LIST ================= */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/[0.03] flex flex-col bg-[#050508] shrink-0 h-64 md:h-full">
            {/* Search filter bar */}
            <div className="p-4 border-b border-white/[0.03] shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder={t('rep.filter_placeholder', language)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0E1324]/85 border border-white/[0.03] text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#A78BFA]/40 transition-all font-sans placeholder-white/20"
                />
              </div>
            </div>

            {/* Reports scrollable list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredReports.map((report) => {
                const isSelected = report.id === activeReportId;
                return (
                  <div
                    key={report.id}
                    id={`report-item-${report.id}`}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#10B981]/5 border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.04)]'
                        : 'bg-white/[0.01] border-white/[0.02] hover:bg-white/[0.03] hover:border-white/[0.06]'
                    }`}
                  >
                    {/* Pulsing indicator if brand new */}
                    {isSelected && (
                      <span className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    )}

                    <div className="flex items-start gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]' 
                          : 'bg-white/5 border-white/5 text-white/50'
                      }`}>
                        <FileCheck className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                          {report.title}
                        </h4>
                        <p className="text-[9px] text-white/40 truncate mt-0.5 font-sans">
                          Source: {report.filename}
                        </p>
                        
                        {/* Pretty date and time footer */}
                        <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-white/50 font-mono">
                          <Calendar className="w-3 h-3 text-violet-400 shrink-0" />
                          <span className="truncate">{report.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="p-8 text-center text-white/30 text-xs">
                  No matching archived reports found.
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT DETAIL VIEWER ================= */}
          <div className="flex-1 flex flex-col bg-[#070914] overflow-hidden">
            {selectedReport ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Actions Ribbon */}
                <div className="px-6 py-4 border-b border-white/[0.03] bg-[#090D1D]/75 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-wider font-bold text-white/80 uppercase">{t('rep.live_preview', language)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onDeleteReport(selectedReport.id)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-rose-400 hover:border-rose-500/20 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('rep.delete', language)}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownloadPDF(selectedReport)}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#0ea5e9] text-[#050816] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:scale-[1.01] active:scale-95 duration-200"
                    >
                      <Download className="w-3.5 h-3.5 text-[#050816]" />
                      <span>{t('rep.download_pdf', language)}</span>
                    </button>
                  </div>
                </div>

                {/* Report Content Body Preview */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Outer Frame mimicking standard PDF canvas */}
                  <div className="max-w-3xl mx-auto bg-[#0A0E1F] border border-white/[0.04] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/[0.02] to-transparent rounded-bl-3xl pointer-events-none" />
                    
                    {/* Header bar within frame */}
                    <div className="flex items-start justify-between pb-6 border-b border-white/[0.05]">
                      <div>
                        <div className="text-[9px] font-mono font-bold tracking-widest text-[#A78BFA] uppercase">AnalytixAI Executive Analytics</div>
                        <h3 className="text-base font-bold text-white mt-1 leading-tight font-display">{selectedReport.title}</h3>
                        <p className="text-[10px] text-white/40 mt-1 font-sans">
                          Footprint source: {selectedReport.filename}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1.5 text-[9px] text-[#10B981] font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>ARCHIVED SECURITY STATE</span>
                        </div>
                        <span className="text-[9px] text-white/30 font-mono mt-1">{selectedReport.timestamp}</span>
                      </div>
                    </div>

                    {/* AI Summary Block inside preview */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#10B981] font-sans">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>AI EXECUTIVE ANALYSIS</span>
                      </div>
                      <div className="p-4.5 rounded-xl bg-white/[0.01] border border-white/[0.03] text-white/90 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]" />
                        {renderPreviewMarkdown(selectedReport.summary)}
                      </div>
                    </div>

                    {/* Performance metrics grid inside preview */}
                    <div className="mt-6 space-y-2">
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">CORE STATISTICAL BASELINES</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        {/* Rev */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Total Revenue</span>
                          <span className="text-sm font-bold text-white font-display block mt-1">
                            ${selectedReport.kpis.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                        {/* Growth */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Growth rate</span>
                          <span className="text-sm font-bold text-[#10B981] font-display block mt-1">
                            {selectedReport.kpis.growthPercent >= 0 ? '+' : ''}{selectedReport.kpis.growthPercent}%
                          </span>
                        </div>
                        {/* Users */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Active Users</span>
                          <span className="text-sm font-bold text-white font-display block mt-1">
                            {selectedReport.kpis.activeUsers.toLocaleString()}
                          </span>
                        </div>
                        {/* Churn */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Churn Target</span>
                          <span className="text-sm font-bold text-white font-display block mt-1">
                            {selectedReport.kpis.churnRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Strategic actionable recommendation items inside preview */}
                    {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
                      <div className="mt-6 space-y-2">
                        <h4 className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">EXECUTIVE STRATEGIC RECOMMENDATIONS</h4>
                        <div className="space-y-2.5 mt-2">
                          {selectedReport.recommendations.slice(0, 3).map((rec: any, index: number) => (
                            <div key={rec.id || index} className="p-3.5 rounded-xl bg-[#090D1A]/50 border border-white/[0.03] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-violet-400 font-sans">
                                  {index + 1}. {rec.action}
                                </span>
                                <span className="text-[8px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full uppercase">
                                  {rec.impact}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/60 leading-normal font-sans pt-0.5">
                                <span className="text-white/40 font-semibold font-mono text-[9px] mr-1">RATIONALE:</span> {rec.rationale}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40 text-xs">
                Please select a report from the list to view its contents.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
