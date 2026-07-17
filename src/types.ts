export interface DatasetSchema {
  dateColumn: string | null;
  metrics: string[];
  dimensions: string[];
  allColumns: string[];
}

export interface KPIOverview {
  totalRevenue: number;
  totalOrders: number;
  growthPercent: number;
  averageOrderValue: number;
  revenueTrend: { date: string; revenue: number; profit?: number; cost?: number }[];
  topProducts: { name: string; value: number }[];
  regionPerformance: { name: string; value: number }[];
  categoryDistribution: { name: string; value: number }[];
  datasetStats: {
    rows: number;
    columns: number;
    missingValues: number;
  };
}

export interface BusinessInsight {
  id: string;
  type: 'growing' | 'region' | 'declining' | 'growth_opp' | 'segment';
  title: string;
  metric: string;
  description: string;
  badge: string;
  color: string; // Tailwind hex or class name
}

export interface AnomalyAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  metricName?: string;
  value?: number | string;
  timestamp?: string;
}

export interface SmartRecommendation {
  id: string;
  action: string;
  target: string;
  impact: string; // 'High Impact', 'Medium Impact' etc.
  rationale: string;
}

export interface RootCauseAnalysis {
  title: string;
  summary: string;
  primaryDriver: string;
  periodComparison: string;
  breakdown: {
    dimension: string;
    item: string;
    change: string;
    impact: 'positive' | 'negative';
  }[];
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  loading?: boolean;
}

export interface AnalyzedData {
  schemaName: string;
  schema: DatasetSchema;
  kpis: KPIOverview;
  insights: BusinessInsight[];
  anomalies: AnomalyAlert[];
  recommendations: SmartRecommendation[];
  summary: string;
}
