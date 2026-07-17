import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export interface HealthMetrics {
  actualRevenue?: number;
  forecastRevenue?: number;
  churnRate?: number;
  criticalAnomaliesCount?: number;
  infoAnomaliesCount?: number;
  momGrowthRate?: number;
}

export interface HealthScoreCardProps {
  metrics: HealthMetrics;
  language?: string;
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export default function HealthScoreCard({ metrics, language = 'en' }: HealthScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // 1. Calculate sub-scores and redistribute weights proportionally if any are missing/undefined
  const subScores: { score: number; weight: number; name: string }[] = [];

  // Financial Sub-score (40% weight)
  if (
    metrics &&
    metrics.actualRevenue !== undefined && metrics.actualRevenue !== null && !isNaN(metrics.actualRevenue) &&
    metrics.forecastRevenue !== undefined && metrics.forecastRevenue !== null && !isNaN(metrics.forecastRevenue) &&
    metrics.forecastRevenue > 0
  ) {
    const financial = 100 * clamp(metrics.actualRevenue / metrics.forecastRevenue, 0, 1.2) / 1.2;
    subScores.push({ score: financial, weight: 0.40, name: 'financial' });
  }

  // Customer Sub-score (25% weight)
  if (
    metrics &&
    metrics.churnRate !== undefined && metrics.churnRate !== null && !isNaN(metrics.churnRate)
  ) {
    const acceptableChurnCeiling = 5; // percent
    const customer = 100 * (1 - clamp(metrics.churnRate / acceptableChurnCeiling, 0, 1));
    subScores.push({ score: customer, weight: 0.25, name: 'customer' });
  }

  // Operational Sub-score (20% weight)
  if (
    metrics &&
    metrics.criticalAnomaliesCount !== undefined && metrics.criticalAnomaliesCount !== null && !isNaN(metrics.criticalAnomaliesCount) &&
    metrics.infoAnomaliesCount !== undefined && metrics.infoAnomaliesCount !== null && !isNaN(metrics.infoAnomaliesCount)
  ) {
    const operational = Math.max(
      0,
      100 - (metrics.criticalAnomaliesCount * 15) - (metrics.infoAnomaliesCount * 3)
    );
    subScores.push({ score: operational, weight: 0.20, name: 'operational' });
  }

  // Growth Sub-score (15% weight)
  if (
    metrics &&
    metrics.momGrowthRate !== undefined && metrics.momGrowthRate !== null && !isNaN(metrics.momGrowthRate)
  ) {
    const growth = 100 * clamp((metrics.momGrowthRate + 5) / 15, 0, 1);
    subScores.push({ score: growth, weight: 0.15, name: 'growth' });
  }

  // Determine if we have at least 2 sub-scores to calculate a valid Health Score
  const hasSufficientData = subScores.length >= 2;

  // Calculate final score
  let calculatedScore = 0;
  if (hasSufficientData) {
    const totalWeight = subScores.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight > 0) {
      const weightedSum = subScores.reduce((sum, item) => sum + (item.score * item.weight), 0);
      calculatedScore = Math.round(clamp(weightedSum / totalWeight, 0, 100));
    }
  }

  // Smooth score transition effect
  useEffect(() => {
    if (hasSufficientData) {
      const timer = setTimeout(() => {
        setAnimatedScore(calculatedScore);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [calculatedScore, hasSufficientData]);

  // Determine status color, glow, and label purely from the score
  let statusColor = '#EF4444'; // critical red
  let statusBg = 'bg-red-500/10 border-red-500/20 text-red-400';
  let glowColor = 'rgba(239, 68, 68, 0.25)';
  let statusText = 'CRITICAL';

  if (animatedScore >= 80) {
    statusColor = '#10B981'; // green
    statusBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    glowColor = 'rgba(16, 185, 129, 0.25)';
    statusText = 'OPTIMAL';
  } else if (animatedScore >= 60) {
    statusColor = '#F59E0B'; // amber
    statusBg = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    glowColor = 'rgba(245, 158, 11, 0.25)';
    statusText = 'STABLE';
  } else if (animatedScore >= 40) {
    statusColor = '#F97316'; // orange
    statusBg = 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    glowColor = 'rgba(249, 115, 22, 0.25)';
    statusText = 'AT RISK';
  }

  // Translate status text if needed
  if (language === 'hi') {
    if (statusText === 'OPTIMAL') statusText = 'सर्वोत्तम';
    if (statusText === 'STABLE') statusText = 'स्थिर';
    if (statusText === 'AT RISK') statusText = 'जोखिम में';
    if (statusText === 'CRITICAL') statusText = 'गंभीर';
  } else if (language === 'te') {
    if (statusText === 'OPTIMAL') statusText = 'ఉత్తమం';
    if (statusText === 'STABLE') statusText = 'స్థిరంగా ఉంది';
    if (statusText === 'AT RISK') statusText = 'ప్రమాదంలో ఉంది';
    if (statusText === 'CRITICAL') statusText = 'ఆందోళనకరం';
  }

  // SVG Circular Gauge Dimensions
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="w-full md:w-[260px] p-5 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between shrink-0 relative overflow-hidden h-auto md:h-full min-h-[220px]">
      {/* Background radial soft light overlay matching the status */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full filter blur-3xl pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: glowColor, opacity: 0.15 }}
      />

      {/* Header */}
      <div className="shrink-0 mb-2">
        <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase font-bold">
          {language === 'hi' ? 'व्यापार स्वास्थ्य स्कोर' : language === 'te' ? 'వ్యాపార ఆరోగ్య స్కోర్' : 'BUSINESS HEALTH SCORE'}
        </span>
      </div>

      {/* Body content */}
      <div className="flex-1 flex flex-col items-center justify-center py-2.5 relative z-10">
        {!hasSufficientData ? (
          /* Fallback State */
          <div className="flex flex-col items-center justify-center text-center text-white/30 p-2">
            <AlertTriangle className="w-8 h-8 mb-2 text-white/20 stroke-[1.5]" />
            <span className="text-xs font-semibold text-white/50">
              {language === 'hi' ? 'अपूर्ण डेटा' : language === 'te' ? 'సరిపోని డేటా' : 'Insufficient data'}
            </span>
            <span className="text-[9px] mt-1 text-white/20">
              {language === 'hi' 
                ? 'स्कोर की गणना के लिए कम से कम 2 मेट्रिक्स की आवश्यकता है।' 
                : language === 'te' 
                ? 'స్కోర్ లెక్కించడానికి కనీసం 2 మెట్రిక్స్ అవసరం.' 
                : 'Need at least 2 sub-scores to compute overall health.'}
            </span>
          </div>
        ) : (
          /* Doughnut progress ring & score */
          <div className="flex flex-col items-center justify-center">
            {/* SVG Ring container */}
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Underlay grey track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  className="stroke-white/[0.04]"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Active progress ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={statusColor}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Bold numeric score centered in the ring */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold font-display text-white tracking-tight leading-none">
                  {animatedScore}
                </span>
                <span className="text-[9px] text-white/30 font-mono mt-0.5 uppercase tracking-widest">
                  {language === 'hi' ? 'अंक' : language === 'te' ? 'స్కోర్' : 'score'}
                </span>
              </div>
            </div>

            {/* Muted color-matched status label under the ring */}
            <div className="mt-4 flex flex-col items-center">
              <span 
                className="text-[10px] font-mono tracking-wider font-bold uppercase"
                style={{ color: statusColor }}
              >
                {statusText}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
