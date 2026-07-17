import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export interface ProfitMarginDataPoint {
  period: string;
  revenue: number;
  cost: number;
  forecastRevenue?: number;
  forecastCost?: number;
}

export interface ProfitMarginChartProps {
  data?: ProfitMarginDataPoint[];
  language?: string;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${Math.round(value)}`;
};

export default function ProfitMarginChart({ data = [], language = 'en' }: ProfitMarginChartProps) {
  
  // Calculate margins internally
  const chartData = data.map((item) => {
    const hasActual = item.revenue > 0 && item.cost !== undefined && item.cost !== null;
    const actualMargin = hasActual ? ((item.revenue - item.cost) / item.revenue) * 100 : null;

    const hasForecast = item.forecastRevenue !== undefined && item.forecastRevenue > 0 && item.forecastCost !== undefined && item.forecastCost !== null;
    const forecastMargin = hasForecast ? ((item.forecastRevenue! - item.forecastCost!) / item.forecastRevenue!) * 100 : null;

    return {
      name: item.period,
      ActualMargin: actualMargin !== null ? Math.round(actualMargin * 10) / 10 : null,
      ForecastMargin: forecastMargin !== null ? Math.round(forecastMargin * 10) / 10 : null,
      rawRevenue: item.revenue,
      rawCost: item.cost,
      rawForecastRevenue: item.forecastRevenue,
      rawForecastCost: item.forecastCost,
    };
  });

  // Verify if we have any valid data points to render
  const hasValidData = chartData.some(d => d.ActualMargin !== null || d.ForecastMargin !== null);

  // Localization
  const title = language === 'hi' ? 'लाभ मार्जिन ट्रेंड' : language === 'te' ? 'లాభ మార్జిన్ ట్రెండ్' : 'Profit Margin Trend';
  const subtitle = language === 'hi' ? 'समय के साथ सकल मार्जिन प्रदर्शन' : language === 'te' ? 'కాలక్రమేణా స్థూల మార్జిన్ ప్రదర్శన' : 'Gross margin performance over time';
  const actualLegend = language === 'hi' ? 'वास्तविक मार्जिन' : language === 'te' ? 'వాస్తవ మార్జిన్' : 'Actual Margin';
  const forecastLegend = language === 'hi' ? 'पूर्वानुमान' : language === 'te' ? 'అంచనా' : 'Forecast Margin';

  // Custom high-fidelity tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const actualVal = dataPoint.ActualMargin;
      const forecastVal = dataPoint.ForecastMargin;

      return (
        <div className="p-3 rounded-xl bg-[#090D1A] border border-white/[0.08] shadow-xl text-left space-y-2">
          <p className="text-[10px] font-mono font-bold text-white/40 tracking-wider uppercase mb-1">{label}</p>
          
          {actualVal !== null && (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-[#A78BFA] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                  {actualLegend}:
                </span>
                <span className="text-white font-bold font-mono">{actualVal}%</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono pl-2.5">
                Rev: {formatCurrency(dataPoint.rawRevenue)} | Cost: {formatCurrency(dataPoint.rawCost)}
              </div>
            </div>
          )}

          {forecastVal !== null && (
            <div className="space-y-0.5 pt-1 border-t border-white/[0.04]">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-violet-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full border border-dashed border-[#A78BFA]" />
                  {forecastLegend}:
                </span>
                <span className="text-white font-bold font-mono">{forecastVal}%</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono pl-2.5">
                Rev: {formatCurrency(dataPoint.rawForecastRevenue || 0)} | Cost: {formatCurrency(dataPoint.rawForecastCost || 0)}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col h-auto md:h-full min-h-[320px] min-w-0 overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-md font-bold text-white font-sans tracking-tight">{title}</h3>
          <span className="text-[10px] text-white/40 font-sans block mt-0.5">{subtitle}</span>
        </div>
        
        {hasValidData && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              <span className="text-[10px] font-sans text-white/60">{language === 'hi' ? 'वास्तविक' : language === 'te' ? 'వాస్తవ' : 'Actual'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-dashed border-[#A78BFA]" />
              <span className="text-[10px] font-sans text-white/60">{language === 'hi' ? 'पूर्वानुमान' : language === 'te' ? 'అంచనా' : 'Forecast'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart container / Empty state wrapper */}
      <div className="h-[250px] min-h-[250px] w-full flex flex-col justify-center min-w-0 overflow-hidden">
        {!hasValidData ? (
          <div className="flex flex-col items-center justify-center text-center text-white/30 p-4">
            <AlertTriangle className="w-8 h-8 mb-2 text-white/10 stroke-[1.5]" />
            <p className="text-xs font-semibold">No margin data available</p>
            <p className="text-[10px] text-white/20 mt-1 max-w-[200px]">
              Upload a dataset containing revenue and profit metrics to calculate the margin trend.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.15)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.15)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="ActualMargin" 
                stroke="#A78BFA" 
                strokeWidth={3} 
                dot={false}
                connectNulls={true}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#A78BFA' }} 
              />
              <Line 
                type="monotone" 
                dataKey="ForecastMargin" 
                stroke="#A78BFA" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
                connectNulls={true}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#A78BFA' }} 
                opacity={0.6}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
