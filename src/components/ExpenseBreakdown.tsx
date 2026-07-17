import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

export interface ExpenseCategory {
  label: string;
  value: number;
}

export interface ExpenseBreakdownProps {
  categories?: ExpenseCategory[];
  isLoading?: boolean;
  isError?: boolean;
  language?: string;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    const mVal = value / 1000000;
    return `$${mVal % 1 === 0 ? mVal.toFixed(0) : mVal.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const kVal = value / 1000;
    return `$${kVal % 1 === 0 ? kVal.toFixed(0) : kVal.toFixed(1)}K`;
  }
  return `$${Math.round(value)}`;
};

export default function ExpenseBreakdown({
  categories = [],
  isLoading = false,
  isError = false,
  language = 'en'
}: ExpenseBreakdownProps) {
  
  // Sort descending automatically
  const sortedCategories = [...categories].sort((a, b) => b.value - a.value);
  
  // Find max value to compute proportions relative to the highest value
  const maxValue = sortedCategories.length > 0 ? Math.max(...sortedCategories.map(c => c.value)) : 1;

  // Header and UI Labels translations/fallbacks
  const title = language === 'hi' ? 'व्यय विवरण' : language === 'te' ? 'ఖర్చుల వివరాలు' : 'Expense Breakdown';
  const subtitle = language === 'hi' ? 'श्रेणी के अनुसार खर्च' : language === 'te' ? 'విభాగాల వారీగా ఖర్చులు' : 'Spending by category';

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between min-h-[220px] min-w-0 overflow-hidden">
      {/* Title block */}
      <div className="mb-4 shrink-0">
        <h3 className="text-sm font-bold text-white font-sans tracking-tight">{title}</h3>
        <span className="text-[10px] text-white/40 block mt-0.5">{subtitle}</span>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          /* Loading skeleton state */
          <div className="space-y-4 py-2 animate-pulse">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-3 w-12 bg-white/10 rounded" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-6 text-center text-rose-400">
            <AlertCircle className="w-8 h-8 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">Failed to load expense data</p>
            <p className="text-[10px] text-white/30 mt-1">Please try refreshing or uploading your file again.</p>
          </div>
        ) : sortedCategories.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-6 text-center text-white/40">
            <HelpCircle className="w-8 h-8 mb-2 stroke-[1.5] text-white/20" />
            <p className="text-xs font-medium">No expense data available</p>
            <p className="text-[10px] text-white/25 mt-1">Upload a dataset containing categorical metrics to see the distribution.</p>
          </div>
        ) : (
          /* Dynamic rows */
          <div className="space-y-3.5">
            {sortedCategories.map((cat, idx) => {
              const proportionPct = maxValue > 0 ? (cat.value / maxValue) * 100 : 0;
              
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                    <span 
                      className="text-white/40 group-hover:text-white/60 text-[10px] font-sans font-bold uppercase tracking-wider truncate max-w-[200px] transition-colors"
                      title={cat.label}
                    >
                      {cat.label}
                    </span>
                    <span className="text-white font-bold text-[11px]">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#A78BFA] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(167,139,250,0.3)]" 
                      style={{ width: `${Math.max(3, proportionPct)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
