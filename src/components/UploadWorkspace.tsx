import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Play, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, t } from '../utils/translations';
import { 
  parseFile, 
  detectColumnTypes, 
  validateDataset, 
  cleanDataset, 
  ValidationError, 
  DetectedType 
} from '../utils/dataValidator';

interface UploadWorkspaceProps {
  onUploadSuccess: (data: string | any[], filename: string) => void;
  onTrySample: () => void;
  language: Language;
}

export default function UploadWorkspace({ onUploadSuccess, onTrySample, language }: UploadWorkspaceProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [detectedTypes, setDetectedTypes] = useState<Record<string, DetectedType>>({});
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [activeFilename, setActiveFilename] = useState<string>('');

  const loadingSteps = [
    t('upload.step1', language),
    t('upload.step2', language),
    t('upload.step3', language),
    t('upload.step4', language)
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const startAnalysisSequence = (rows: any[], filename: string) => {
    setIsProcessing(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onUploadSuccess(rows, filename);
            setIsProcessing(false);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      setIsFileProcessing(true);
      setIsDragging(false);
      setValidationErrors([]);
      setValidationSuccess(false);
      
      // Delay so that the user is treated to a beautiful, clear loading sequence
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const rows = await parseFile(file);
      if (!rows || rows.length === 0) {
        alert('The uploaded file appears to be empty or has an invalid format.');
        setIsFileProcessing(false);
        return;
      }

      // Silent detection of column types
      const types = detectColumnTypes(rows);
      // Validate dataset
      const errors = validateDataset(rows, types);

      setParsedData(rows);
      setDetectedTypes(types);
      setActiveFilename(file.name);

      if (errors.length > 0) {
        // Show output list directly below upload control if errors exist
        setValidationErrors(errors);
        setValidationSuccess(false);
      } else {
        // If no errors are found, display "No errors present" and show continue option
        setValidationErrors([]);
        setValidationSuccess(true);
      }
    } catch (err) {
      console.error('File Processing Error:', err);
      alert('Error parsing file. Please check the file formatting and structure.');
    } finally {
      setIsFileProcessing(false);
    }
  };

  const handleFixAndContinue = () => {
    if (parsedData.length > 0 && activeFilename) {
      const cleaned = cleanDataset(parsedData, detectedTypes);
      setValidationErrors([]);
      setValidationSuccess(false);
      startAnalysisSequence(cleaned, activeFilename);
    }
  };

  const handleProceedClean = () => {
    if (parsedData.length > 0 && activeFilename) {
      setValidationSuccess(false);
      startAnalysisSequence(parsedData, activeFilename);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Mock recent files
  const recentFiles = [
    { name: 'sales_performance_q1.csv', size: '142 KB', date: '2 hours ago' },
    { name: 'customer_cohorts_may.csv', size: '64 KB', date: '1 day ago' },
    { name: 'ad_spend_returns_annual.csv', size: '280 KB', date: '3 days ago' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#050816] relative overflow-y-auto">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-[#0B1220]/80 border border-violet-950/40 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        
        {!isProcessing ? (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white font-display">{t('upload.title', language)}</h2>
              <p className="text-sm text-gray-400 mt-1.5 font-sans">
                {t('upload.subtitle', language)}
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={isFileProcessing ? undefined : handleDragOver}
              onDragLeave={isFileProcessing ? undefined : handleDragLeave}
              onDrop={isFileProcessing ? undefined : handleDrop}
              onClick={isFileProcessing ? undefined : triggerFileSelect}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-200 ${
                isFileProcessing
                  ? 'border-[#A78BFA]/40 bg-[#A78BFA]/5 cursor-default'
                  : isDragging
                  ? 'border-[#A78BFA] bg-[#A78BFA]/5 shadow-[0_0_20px_rgba(167,139,250,0.15)] cursor-pointer'
                  : 'border-white/10 hover:border-white/30 hover:bg-white/5 cursor-pointer'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv, .txt, .xlsx, .xls"
                className="hidden"
                disabled={isFileProcessing}
              />
              
              {isFileProcessing ? (
                <div className="flex flex-col items-center py-4 select-none">
                  <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                    {/* Pulsing glow ring */}
                    <div className="absolute inset-0 rounded-full border border-[#A78BFA]/30 animate-ping opacity-60" />
                    {/* Spinning modern loader icon */}
                    <RefreshCw className="w-6 h-6 text-[#A78BFA] animate-spin" />
                  </div>
                  <h3 className="text-white font-medium text-base font-display animate-pulse">
                    Parsing & validating file...
                  </h3>
                  <p className="text-xs text-white/40 mt-1.5 font-mono text-center">
                    Scanning structure, validating row data & mapping types
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#A78BFA] animate-pulse" />
                  </div>
                  
                  <h3 className="text-white font-medium text-base font-display">{t('upload.drag_drop', language)}</h3>
                  <p className="text-xs text-white/40 mt-1 font-mono">{t('upload.supported_formats', language)}</p>
                  
                  <button 
                    type="button"
                    className="mt-5 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {t('upload.browse', language)}
                  </button>
                </>
              )}
            </div>

            {/* Lightweight Inline Validation List (Below Upload Control) */}
            {validationErrors.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3 select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">
                      Validation Issues Detected ({validationErrors.length})
                    </span>
                  </div>
                  <button
                    onClick={handleFixAndContinue}
                    className="px-3.5 py-1.5 rounded-lg bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#050816] hover:scale-[1.02] active:scale-95 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#050816]" />
                    <span>Fix errors & continue</span>
                  </button>
                </div>

                {/* Compact Scrollable List of Issues */}
                <div className="max-h-48 overflow-y-auto divide-y divide-white/5 pr-1 font-mono text-[11px] space-y-1.5">
                  {validationErrors.map((err, i) => (
                    <div key={i} className="flex items-start justify-between py-1.5 gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white/40 shrink-0">Row {err.row}</span>
                        {err.column && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/80 shrink-0 text-[10px]">
                            {err.column}
                          </span>
                        )}
                        <span className="text-white/60 truncate">{err.description}</span>
                      </div>
                      <span className={`text-[9px] uppercase font-bold shrink-0 px-1.5 py-0.5 rounded ${
                        err.type === 'missing'
                          ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      }`}>
                        {err.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Success Indicator */}
            {validationSuccess && (
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col gap-3 select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">
                      No errors present
                    </span>
                  </div>
                  <button
                    onClick={handleProceedClean}
                    className="px-3.5 py-1.5 rounded-lg bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#050816] hover:scale-[1.02] active:scale-95 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.25)] font-display"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#050816]" />
                    <span>Proceed & continue</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-white/60">
                  Your dataset has been verified and has no structure or type errors. Click below to proceed to the analysis interface.
                </div>
              </div>
            )}

            {/* Actions / Sample trigger */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-white/40 font-mono text-center sm:text-left">
                {t('upload.try_sample_hint', language)}
              </div>
              <button
                onClick={onTrySample}
                className="px-4 py-2 rounded-lg bg-[#22D3EE] text-[#050816] hover:scale-[1.02] shadow-[0_0_15px_rgba(34,211,238,0.25)] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 duration-200"
              >
                <Play className="w-3.5 h-3.5 text-[#050816] fill-[#050816]" />
                <span>{t('upload.try_sample', language)}</span>
              </button>
            </div>

            {/* Recent Uploads List */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-xs font-mono tracking-wider uppercase text-white/30 mb-3">{t('upload.recent_history', language)}</h4>
              <div className="space-y-2">
                {recentFiles.map((f, i) => (
                  <div
                    key={i}
                    onClick={onTrySample} // Clicking recent files acts as preloading sample
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 rounded-xl bg-[#0B1220] hover:bg-[#0B1220]/70 border border-white/10 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileSpreadsheet className="w-4 h-4 text-[#A78BFA] shrink-0" />
                      <span className="text-xs text-white/80 font-sans font-medium truncate">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono shrink-0 justify-start sm:justify-end">
                      <span>{f.size}</span>
                      <span className="text-white/20">•</span>
                      <span>{f.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Animated Multi-Step Processing Sequence */
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative shadow-lg shadow-[#A78BFA]/10">
              <RefreshCw className="w-7 h-7 text-[#A78BFA] animate-spin" />
            </div>

            <h3 className="text-white font-display font-semibold text-lg mb-6 tracking-wide text-center">
              {t('upload.analyzing', language)}
            </h3>

            {/* Steps Log */}
            <div className="w-full max-w-md space-y-3">
              {loadingSteps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                        : isActive
                          ? 'bg-white/5 border-white/20 text-white shadow-[0_0_15px_rgba(167,139,250,0.05)]'
                          : 'bg-transparent border-transparent text-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/30">0{idx + 1}</span>
                      <span className="text-xs font-sans font-medium">{step}</span>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981]" />
                      ) : isActive ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#A78BFA] border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
