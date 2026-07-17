import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Percent, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  Search,
  ChevronRight,
  Shield,
  FileText,
  Copy,
  Trash2,
  Edit2,
  Download,
  Info,
  Layers,
  Award,
  Users,
  Package,
  Clock,
  Briefcase,
  Sliders,
  Send,
  Eye,
  Plus,
  Star,
  Activity,
  Compass,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { DatasetSchema, KPIOverview } from '../types';
import { Language, t } from '../utils/translations';
import jsPDF from 'jspdf';

interface AILabViewProps {
  kpis: KPIOverview | null;
  schema: DatasetSchema | null;
  language: Language;
  onLoadDemo: () => void;
  onGoToUpload: () => void;
}

interface BusinessDecisions {
  marketingSpendChange: number;
  priceChange: number;
  employeeChange: number;
  deliveryTimeChange: number;
  inventoryChange: number;
  launchCampaign: boolean;
  reduceOperationalCosts: number;
  increaseCapacity: number;
  addSupplier: boolean;
}

interface SimulatedMetrics {
  revenue: number;
  profit: number;
  expenses: number;
  cashFlow: number;
  roi: number;
  customerGrowth: number;
  churn: number;
  inventoryHealth: number;
  operatingMargin: number;
  businessHealthScore: number;
}

interface RiskItem {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

interface AIAdvisor {
  summary: string;
  benefits: string[];
  risks: string[];
  recommendedAction: string;
  confidenceScore: number;
}

interface RiskAnalysis {
  overallRiskScore: number;
  risks: RiskItem[];
}

interface SavedScenario {
  id: string;
  name: string;
  timestamp: string;
  decisions: BusinessDecisions;
  metrics: SimulatedMetrics;
  advisor: AIAdvisor;
  riskAnalysis: RiskAnalysis;
}

interface AIFeature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'Available' | 'Beta' | 'Coming Soon';
  category: 'Analytics' | 'Prediction' | 'Optimization' | 'Automation' | 'Reports';
  tagline: string;
  description: string;
  capabilities: string[];
  useCases: string[];
  sampleOutputId: string;
}

// Translations record preserved concisely
const LAB_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'lab.title': 'AI Labs',
    'lab.subtitle': 'Explore specialized AI tools to analyze, predict, optimize, and automate your business.',
    'lab.load_demo': 'Load Enterprise Demo',
    'lab.upload_data': 'Ingest New CSV',
    'lab.reset': 'Reset Simulator',
    'lab.export_report': 'Export Strategic Report',
    'lab.compare_scenarios': 'Scenario Comparison Mode',
    'lab.best_scenario': 'TOP PERFORMER'
  },
  hi: {
    'lab.title': 'एआई लैब्स',
    'lab.subtitle': 'अपने व्यवसाय का विश्लेषण, पूर्वानुमान, अनुकूलन और स्वचालन करने के लिए विशेष एआई उपकरणों का पता लगाएं।',
    'lab.load_demo': 'एंटरप्राइज डेमो लोड करें',
    'lab.upload_data': 'नया सीएसवी अपलोड करें',
    'lab.reset': 'रीसेट सिम्युलेटर',
    'lab.export_report': 'रणनीतिक रिपोर्ट निर्यात करें',
    'lab.compare_scenarios': 'परिदृश्य तुलना मोड',
    'lab.best_scenario': 'सर्वश्रेष्ठ प्रदर्शनकर्ता'
  },
  te: {
    'lab.title': 'AI ల్యాబ్స్',
    'lab.subtitle': 'మీ వ్యాపారాన్ని విశ్లేషించడానికి, అంచనా వేయడానికి, ఆప్టిమైజ్ చేయడానికి మరియు ఆటోమేట్ చేయడానికి ప్రత్యేకమైన AI సాధనాలను అన్వేషించండి.',
    'lab.load_demo': 'డెమో డేటాన్ని లోడ్ చేయి',
    'lab.upload_data': 'కొత్త CSV అప్‌లోడ్ చేయి',
    'lab.reset': 'రీసెట్ సిమ్యులేటర్',
    'lab.export_report': 'రిపోర్ట్‌ను డౌన్‌లోడ్ చేయి',
    'lab.compare_scenarios': 'సినారియో పోలిక మోడ్',
    'lab.best_scenario': 'ఉత్తమ ప్రదర్శన'
  }
};

const FEATURES: AIFeature[] = [
  {
    id: 'scenario-simulator',
    name: 'Scenario Simulator',
    icon: Sliders,
    status: 'Available',
    category: 'Prediction',
    tagline: 'Model Business Outcomes',
    description: 'Models "what-if" business adjustments by processing your custom variables, such as price hikes or budget shifts. It calculates predictive outcomes to project immediate and long-term impacts on revenue, margins, and cash runway before any real-world changes are committed.',
    capabilities: [
      'Compare current vs predicted KPIs',
      'AI-generated recommendations',
      'Risk analysis',
      'Revenue forecasting',
      'Scenario comparison',
      'Executive summary'
    ],
    useCases: [
      'Simulate price changes and marketing budget shifts',
      'Estimate the impact of workforce adjustments',
      'Forecast logistics optimization results'
    ],
    sampleOutputId: 'simulator'
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    icon: FileText,
    status: 'Available',
    category: 'Reports',
    tagline: 'Generate Business Reports',
    description: 'Compiles key business performance indicators, dynamic trends, and deep AI narrative summaries into shareable executive reports. It processes selected historical and predictive parameters to produce downloadable PDF digests on-demand or on automated schedules.',
    capabilities: [
      'Instant PDF compilation',
      'Board-ready aesthetic formatting',
      'Auto-generated executive summaries',
      'KPI tables & trajectory forecasts'
    ],
    useCases: [
      'Prepare monthly performance reports for stakeholders',
      'Create pitch decks for strategic planning',
      'Archive scenario comparisons'
    ],
    sampleOutputId: 'reports'
  },
  {
    id: 'decision-engine',
    name: 'Decision Engine',
    icon: Zap,
    status: 'Available',
    category: 'Prediction',
    tagline: 'Support Smart Decisions',
    description: 'Synthesizes multidimensional metrics, market trends, and risk analyses into clear recommended next-best-actions for your enterprise. It utilizes cross-functional operations data to output automated tactical playbooks complete with predicted payback periods.',
    capabilities: [
      'Strategic Scenario Branching',
      'ROI Payback Period Estimations',
      'Multi-Variable Action Rationale',
      'Confidence Variance Sizing'
    ],
    useCases: [
      'Evaluate warehouse expansion costs',
      'Calculate brand campaigns payback',
      'Assess supplier diversification ROI'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'inventory-optimizer',
    name: 'Inventory Optimizer',
    icon: Package,
    status: 'Beta',
    category: 'Optimization',
    tagline: 'Optimize Stock Levels',
    description: 'Analyzes current stock counts, historical sales velocities, and lead times to protect against supply disruptions. It processes SKU levels and demand patterns to output automated safety stock calculations, reorder alerts, and capital allocation suggestions.',
    capabilities: [
      'Safety stock auto-calculations',
      'Stockout probability forecasting',
      'Replenishment calendar schedule',
      'Capital re-allocation scoring'
    ],
    useCases: [
      'Determine optimal safety stock for key products',
      'Prevent warehouse storage fee overruns',
      'Calculate precise re-order thresholds'
    ],
    sampleOutputId: 'inventory'
  },
  {
    id: 'cost-optimizer',
    name: 'Cost Optimizer',
    icon: DollarSign,
    status: 'Beta',
    category: 'Optimization',
    tagline: 'Reduce Business Costs',
    description: 'Scans fixed and variable expenditures to identify areas of inefficient capital deployment. It processes transactional ledger items and SaaS seat allocations to pinpoint duplicate vendors, cloud waste, and redundant overhead expenses.',
    capabilities: [
      'Vendor contract scanning',
      'Fixed cost pruning suggestions',
      'Logistics route efficiency analyzer',
      'Carbon footprint offsets'
    ],
    useCases: [
      'Isolate software SaaS seat redundancies',
      'Minimize freight consolidation times',
      'Identify duplicate raw material suppliers'
    ],
    sampleOutputId: 'costs'
  },
  {
    id: 'customer-intelligence',
    name: 'Customer Intelligence',
    icon: Users,
    status: 'Beta',
    category: 'Analytics',
    tagline: 'Understand Customer Behavior',
    description: 'Segments your active user base by engagement levels, transactional frequency, and total lifetime value. It maps historical customer journeys to output precise retention actions, churn-risk flags, and high-value customer expansion tactics.',
    capabilities: [
      'RFM clustering & predictive CLV',
      'Micro-segment campaign targeting',
      'Churn risk alerting',
      'Purchasing frequency patterns'
    ],
    useCases: [
      'Identify dormant high-value customers',
      'Run automatic email triggers for moderate-risk cohorts',
      'Target brand advocates for referrals'
    ],
    sampleOutputId: 'customers'
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Monitor',
    icon: Activity,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Track Cash Flow',
    description: 'Maps cash inflows against outgoing operating expenditures over a continuous rolling timeline. It processes receivable aging buckets and vendor payment schedules to project future cash runways and flag periods with liquidity risk.',
    capabilities: [
      'Net Liquid Position Forecasts',
      'Rolling Reserves Modeling',
      'Collections Age DSO Alerts',
      'Vendor AP Terms Optimizer'
    ],
    useCases: [
      'Identify seasonal cash drags',
      'Negotiate extended AP durations',
      'Maximize treasury yield returns'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Monitor',
    icon: Package,
    status: 'Available',
    category: 'Optimization',
    tagline: 'Track Supply Operations',
    description: 'Tracks supplier delivery times, fulfillment accuracy, and logistics lead velocities in real-time. It processes shipment logs and vendor performance histories to calculate disruption risk levels and identify dependable backup supply pathways.',
    capabilities: [
      'Turnover Velocity Metrics',
      'Lead-Time Congestion Scans',
      'Supplier Risk Redundancies',
      'Stockout Probability Maps'
    ],
    useCases: [
      'Optimize warehouse storage footprints',
      'Contract backup supplier channels',
      'Prevent seasonal stockouts'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'goal-tracker',
    name: 'Goal Tracker',
    icon: Compass,
    status: 'Available',
    category: 'Prediction',
    tagline: 'Track Business Goals',
    description: 'Aligns daily sales and operational performance against your pre-set strategic quarterly and annual business targets. It processes actual output metrics against benchmark goals to produce real-time gap evaluations and estimated completion dates.',
    capabilities: [
      'Objective Alignment Scoreboard',
      'Remaining Gap Sizing',
      'Peak Season Accelerators',
      'Fulfillment Velocity Mapping'
    ],
    useCases: [
      'Track Q4 sales quota completion',
      'Calibrate marketing incentive pushes',
      'Bridge regional revenue gaps'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'invoice-intelligence',
    name: 'Invoice Intelligence',
    icon: FileText,
    status: 'Available',
    category: 'Automation',
    tagline: 'Automate Invoice Analysis',
    description: 'Extracts billing, tax, and timing parameters from enterprise vendor invoices using advanced parsing. It processes invoice transaction details to catch accounting discrepancies, overpayments, duplicate billings, or unusual vendor charging habits.',
    capabilities: [
      'AR Aging Bucket Modeling',
      'Collection Speed Analytics',
      'Late Fee Policy Simulators',
      'DSO Reduction Triggers'
    ],
    useCases: [
      'Minimize enterprise payment drag',
      'Set up automatic follow-up reminders',
      'Isolate high-tier late payers'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'competitor-intelligence',
    name: 'Competitor Intelligence',
    icon: Shield,
    status: 'Available',
    category: 'Automation',
    tagline: 'Analyze Competitor Strategies',
    description: 'Aggregates external marketplace price indices, product offerings, and customer sentiment signals. It processes external market footprints to benchmark your brand and output defensive pricing rules and value positioning strategies.',
    capabilities: [
      'Competitive Price Elasticity',
      'Peer Group Index Benchmarking',
      'Defensive Loyalty Triggers',
      'Product Value Scoring'
    ],
    useCases: [
      'Defend against local competitor promos',
      'Benchmark margins with peer index',
      'Design brand advocate rebates'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'market-intelligence',
    name: 'Market Intelligence',
    icon: Compass,
    status: 'Available',
    category: 'Automation',
    tagline: 'Understand Market Trends',
    description: 'Monitors regional consumer demographics, spending behaviors, and macro-level industry growth shifts. It processes external sector datasets to output regional expansion feasibility grades and uncover high-demand subcategory opportunities.',
    capabilities: [
      'Macro Expansion Appraisals',
      'Demographic Shift Alerts',
      'Untapped Market Size Sizing',
      'Seasonality Adjustments'
    ],
    useCases: [
      'Evaluate European expansion margins',
      'Identify high-demand retail subcategories',
      'Optimize holiday seasonal stock'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'compliance-checker',
    name: 'Compliance Checker',
    icon: Shield,
    status: 'Available',
    category: 'Reports',
    tagline: 'Ensure Regulatory Compliance',
    description: 'Reviews active financial transactions and operational databases against standard reporting and corporate governance protocols. It processes secure data logs to output risk heatmaps and comprehensive compliance reports for seamless boardroom auditing.',
    capabilities: [
      'GDPR & HIPAA Compliance Audits',
      'Governance Risk Matrix Scorecard',
      'Data Column Encryption Check',
      'Automatic Audit Exporters'
    ],
    useCases: [
      'Review personal database policies',
      'Assess GDPR transfer compliance',
      'Generate boardroom audit reports'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'forecasting',
    name: 'Forecasting',
    icon: TrendingUp,
    status: 'Available',
    category: 'Prediction',
    tagline: 'Predict Future Trends',
    description: "Extends the dashboard's standard revenue projection into highly customizable forecasting scenarios. It processes historical sales datasets to let you adjust confidence intervals, modify momentum parameters, and compare rolling twelve-month outlooks.",
    capabilities: [
      '12-month rolling projections',
      'Confidence interval bands',
      'Adjustable growth momentum',
      'Seasonality correction'
    ],
    useCases: [
      'Determine next quarter budget allocations',
      'Estimate year-end cash reserves',
      'Forecast inventory stock requirements'
    ],
    sampleOutputId: 'forecast'
  },
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    icon: AlertTriangle,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Detect Data Anomalies',
    description: 'Expands the core dashboard alerts into a fully configurable, historical outlier exploration workspace. It processes transactional records and metric volume dips to let you fine-tune detection thresholds and investigate past operational irregularities.',
    capabilities: [
      'Outlier isolation algorithms',
      'Real-time spike and dip alerts',
      'Noise-filtering thresholds',
      'Severity scoring'
    ],
    useCases: [
      'Isolate fraudulent billing activity',
      'Flag sudden customer churn anomalies',
      'Identify supply chain price spikes'
    ],
    sampleOutputId: 'anomaly'
  },
  {
    id: 'root-cause-analysis',
    name: 'Root Cause Analysis',
    icon: Layers,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Identify Core Causes',
    description: "Deepens the primary dashboard's bottleneck cards into high-fidelity multi-dimensional causal chains. It correlates cross-functional data across product, geography, and timeframe simultaneously to isolate exact drivers behind any margin contraction.",
    capabilities: [
      'Multi-layered dependency mapping',
      'Primary driver contribution weights',
      'AI causality narrative',
      'Drill-down impact matrices'
    ],
    useCases: [
      'Pinpoint exact causes of recent profit margin drops',
      'Trace delivery delays back to vendor issues',
      'Identify why customer retention fell'
    ],
    sampleOutputId: 'root-cause'
  },
  {
    id: 'ai-insights',
    name: 'AI Insights',
    icon: Sparkles,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Discover Smart Insights',
    description: 'Transforms standard dashboard observations into an interactive, filterable intelligence hub. It organizes corporate findings by priority or category, allowing on-demand generation of tailored recommendations for highly targeted strategic queries.',
    capabilities: [
      'Correlate multi-variable metrics',
      'Identify hidden margin opportunities',
      'Automate strategic write-ups',
      'Growth velocity projections'
    ],
    useCases: [
      'Uncover why segment growth is slowing',
      'Determine advertising channel efficiency',
      'Synthesize general business state'
    ],
    sampleOutputId: 'insights'
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard',
    icon: Sliders,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Monitor Key Metrics',
    description: "Enhances the primary dashboard's executive cards with a fully customizable metric workspace. It processes all financial and customer databases to let you define custom tracking ranges, toggle visibility parameters, and blend performance dimensions.",
    capabilities: [
      'Executive Metric Blending',
      'Target vs Actual Trajectories',
      'Automated Email Digests',
      'Deviation Warnings'
    ],
    useCases: [
      'Prepare monthly stakeholder metrics',
      'Conduct operational alignment reviews',
      'Alert on margin drop levels'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'health-score',
    name: 'Business Health Score',
    icon: Award,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Measure Business Health',
    description: 'Decomposes the singular dashboard score into its detailed constituent components. It computes separate sub-scores for financial performance, customer retention, growth velocity, and operational efficiency while mapping historic health trends.',
    capabilities: [
      'Unified Health Synthesis',
      'Noise Margin Adjustments',
      'Multivariable Weight Settings',
      'Trend Velocity Projections'
    ],
    useCases: [
      'Audit general business viability',
      'Compare regional operations health',
      'Identify high risk data gaps'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'sales-analytics',
    name: 'Sales Analytics',
    icon: ShoppingCart,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Analyze Sales Performance',
    description: 'Drills into the core dashboard revenue trends with deep sales team and channel segmentation. It processes individual transaction records to analyze regional peak velocities, representative performance metrics, and average order values.',
    capabilities: [
      'Revenue Velocity Tracking',
      'Regional Demand Sizing',
      'AOV Optimization Pathway',
      'Category Performance Shift'
    ],
    useCases: [
      'Analyze geographical sales peaks',
      'Evaluate top margin drivers',
      'Optimize regional distribution speed'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'profitability',
    name: 'Profitability Analyzer',
    icon: DollarSign,
    status: 'Available',
    category: 'Analytics',
    tagline: 'Measure Business Profitability',
    description: 'Expands the aggregate dashboard profit margin lines into granular product-level contribution analysis. It processes individual cost-of-goods-sold and revenue vectors to isolate top-margin items and pinpoint specific margin leakage.',
    capabilities: [
      'Operating Margin Preservation',
      'OPEX Overrun Alerts',
      'Fixed Cost Redundancy Pruning',
      'Contribution Analysis'
    ],
    useCases: [
      'Identify why margin is compressing',
      'Prune high SaaS license count',
      'Detect supplier billing excess'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'expense-analyzer',
    name: 'Expense Analyzer',
    icon: DollarSign,
    status: 'Available',
    category: 'Optimization',
    tagline: 'Analyze Business Expenses',
    description: "Dives deep beneath the dashboard's categorical expense summaries to audit individual supplier transactions. It maps outbound ledger data to verify payroll ratios, isolate cost-saving opportunities, and identify micro-level spending outliers.",
    capabilities: [
      'SaaS Subscription Audits',
      'Logistics Outbox Scans',
      'Payroll Margin Ratios',
      'Fixed Redundancy Pruning'
    ],
    useCases: [
      'Prune redundant SaaS licenses',
      'Reduce cross-border freight fees',
      'Align staffing count to revenue'
    ],
    sampleOutputId: 'module-analysis'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: MessageSquare,
    status: 'Available',
    category: 'Automation',
    tagline: 'Ask Data Questions',
    description: 'Consolidates the copilot chat into an expansive, dedicated chat experience featuring complete conversation logs. It analyzes your integrated database parameters to solve advanced mathematical scenarios and answer high-level corporate queries.',
    capabilities: [
      'Context-aware chat',
      'Dynamic formula translation',
      'Immediate data summaries',
      'Actionable decision feedback'
    ],
    useCases: [
      'Compare this month revenue with last month',
      'Summarize our biggest cost centers',
      'Identify margins optimization opportunities'
    ],
    sampleOutputId: 'assistant'
  }
];

export default function AILabView({ kpis, schema, language, onLoadDemo, onGoToUpload }: AILabViewProps) {
  const tL = (key: string): string => {
    return LAB_TRANSLATIONS[language]?.[key] || LAB_TRANSLATIONS['en'][key] || key;
  };

  // Directory UI States
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('scenario-simulator');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // --- NEW BUSINESS ANALYSIS MODULES STATES & HANDLERS ---
  const BUSINESS_MODULE_IDS = [
    'sales-analytics',
    'profitability',
    'cash-flow',
    'kpi-dashboard',
    'supply-chain',
    'health-score',
    'expense-analyzer',
    'invoice-intelligence',
    'competitor-intelligence',
    'decision-engine',
    'market-intelligence',
    'compliance-checker'
  ];

  const [moduleAnalysisData, setModuleAnalysisData] = useState<any | null>(null);
  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [selectedChartStyle, setSelectedChartStyle] = useState<'area' | 'bar' | 'line'>('area');

  // Conversational AI Assistant state for individual workspaces
  const [moduleChatInput, setModuleChatInput] = useState('');
  const [moduleChatMessages, setModuleChatMessages] = useState<any[]>([]);
  const [isModuleChatTyping, setIsModuleChatTyping] = useState(false);

  // Fetch McKinsey-style custom analytics when activeToolId is launched
  const fetchModuleAnalysis = async (mId: string) => {
    if (!kpis || !schema) {
      setModuleAnalysisData(null);
      return;
    }
    setIsModuleLoading(true);
    setModuleError(null);
    try {
      const response = await fetch('/api/ai-lab/module-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: mId, kpis, schema, language })
      });
      if (!response.ok) {
        throw new Error('Analysis server returned a non-ok status code.');
      }
      const data = await response.json();
      setModuleAnalysisData(data);
    } catch (err: any) {
      console.error('Failed to fetch module analysis:', err);
      setModuleError(err.message || 'Operational analytics engine compilation failed.');
    } finally {
      setIsModuleLoading(false);
    }
  };

  // Trigger loading and reset chat for workspace
  useEffect(() => {
    if (activeToolId && BUSINESS_MODULE_IDS.includes(activeToolId)) {
      fetchModuleAnalysis(activeToolId);
      setModuleChatMessages([
        {
          sender: 'assistant',
          text: `Hello! I am your AI Business Advisor. I have completed the strategic analysis of our dataset indicators for this module. Ask me anything about our findings, opportunity hotspots, or recommended actions!`
        }
      ]);
    }
  }, [activeToolId, language]);

  // Handle Conversational Chat in module workspace
  const handleSendModuleChat = async () => {
    if (!moduleChatInput.trim() || !moduleAnalysisData) return;
    const query = moduleChatInput;
    setModuleChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setModuleChatInput('');
    setIsModuleChatTyping(true);

    try {
      const contextualMessage = `CONTEXT: You are the AI Analyst in the "${moduleAnalysisData.title}" analysis workspace. 
Strategic Summary: "${moduleAnalysisData.summary}"
Key Insights: ${JSON.stringify(moduleAnalysisData.insights)}
Recommended Actions: ${JSON.stringify(moduleAnalysisData.recommendedActions)}

The user asks this specific question in the context of this module: "${query}"`;

      const formattedHistory = moduleChatMessages.slice(1).map((msg: any) => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextualMessage,
          history: formattedHistory,
          schema,
          kpis
        })
      });

      if (!response.ok) {
        throw new Error('Chat assistant returned non-ok status.');
      }

      const resJson = await response.json();
      setModuleChatMessages(prev => [...prev, { sender: 'assistant', text: resJson.text }]);
    } catch (chatErr) {
      console.error('Module chat assistance failed, using dynamic local fallback:', chatErr);
      setTimeout(() => {
        let fallbackReply = `I have processed your inquiry about "${query}". Based on the indicators for "${moduleAnalysisData.title}": `;
        if (query.toLowerCase().includes('recommend') || query.toLowerCase().includes('action') || query.toLowerCase().includes('do')) {
          const actionText = moduleAnalysisData.recommendedActions?.[0]?.action || 'Optimize core distribution speed';
          fallbackReply += `our chief recommended strategy is: "${actionText}".`;
        } else if (query.toLowerCase().includes('value') || query.toLowerCase().includes('number') || query.toLowerCase().includes('data')) {
          const firstInsVal = moduleAnalysisData.insights?.[0]?.value || `$${kpis?.totalRevenue.toLocaleString()}`;
          fallbackReply += `the highest performing metric registers at: ${firstInsVal}.`;
        } else {
          fallbackReply += `we observe positive performance dynamics across all tracked attributes. Please feel free to export these findings to PDF or CSV for further planning.`;
        }
        setModuleChatMessages(prev => [...prev, { sender: 'assistant', text: fallbackReply }]);
      }, 750);
    } finally {
      setIsModuleChatTyping(false);
    }
  };

  // Export module findings to high-fidelity PDF report
  const handleExportModulePDF = (data: any) => {
    if (!data) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 18;

    // Elegant header banner
    doc.setFillColor(5, 8, 22);
    doc.rect(0, 0, 220, 42, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ANALYTIXAI ENTERPRISE INSIGHTS', margin, 18);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 200);
    doc.text(`${data.title.toUpperCase()} | STRATEGIC PERFORMANCE REPORT`, margin, 26);
    doc.text(`GENERATED ON: ${new Date().toLocaleDateString()} | ANALYSIS TYPE: McKinsey-Style Turnaround AI`, margin, 32);

    y = 54;
    // Section I: Summary
    doc.setTextColor(20, 24, 35);
    doc.setFontSize(13);
    doc.setFont('Helvetica', 'bold');
    doc.text('I. Executive Summary & Strategy Overview', margin, y);
    
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(data.summary, 180);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 5) + 12;

    // Section II: Key Findings (Insights)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 24, 35);
    doc.text('II. Core Analytical Findings', margin, y);

    y += 8;
    data.insights.forEach((ins: any, idx: number) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(16, 120, 80);
      doc.text(`Finding ${idx + 1}: ${ins.title} [Status: ${ins.badge || 'Active'}]`, margin, y);
      
      y += 5;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      const descLines = doc.splitTextToSize(`Performance Indicator: ${ins.value || 'N/A'} - ${ins.desc}`, 175);
      doc.text(descLines, margin + 4, y);
      y += (descLines.length * 4.5) + 7;
    });

    y += 6;
    // Section III: Recommended Actions
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 24, 35);
    doc.text('III. Recommended Turnaround Actions', margin, y);

    y += 8;
    data.recommendedActions.forEach((act: any, idx: number) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 24, 35);
      doc.text(`Action ${idx + 1}: ${act.action}`, margin, y);
      
      y += 5;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(`Target Department: ${act.target} | Impact Priority: ${act.impact}`, margin + 4, y);
      y += 4.5;
      const rationaleLines = doc.splitTextToSize(`Strategic Rationale: ${act.rationale}`, 175);
      doc.text(rationaleLines, margin + 4, y);
      y += (rationaleLines.length * 4.5) + 7;
    });

    doc.save(`AnalytixAI_Analysis_${activeToolId}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export module metrics and insights to fully detailed CSV
  const handleExportModuleCSV = (data: any) => {
    if (!data) return;
    const rows: any[] = [];
    
    // Header section
    rows.push(['ANALYTIXAI ENTERPRISE ANALYSIS REPORT']);
    rows.push(['MODULE ID:', activeToolId]);
    rows.push(['MODULE:', data.title]);
    rows.push(['SUBTITLE:', data.subtitle]);
    rows.push(['DESCRIPTION:', data.description]);
    rows.push(['EXECUTIVE SUMMARY:', data.summary]);
    rows.push([]);
    
    // Insights Section
    rows.push(['SECTION:', 'AI INSIGHTS & FINDINGS']);
    rows.push(['Title', 'Description', 'Performance Value', 'Badge Status']);
    data.insights.forEach((ins: any) => {
      rows.push([ins.title, ins.desc, ins.value, ins.badge]);
    });
    rows.push([]);

    // Recommended Actions Section
    rows.push(['SECTION:', 'RECOMMENDED STRATEGIC ACTIONS']);
    rows.push(['Action Name', 'Target Segment', 'Impact Priority', 'Rationale']);
    data.recommendedActions.forEach((act: any) => {
      rows.push([act.action, act.target, act.impact, act.rationale]);
    });
    rows.push([]);

    // Charts Data Section
    if (data.chartsData && data.chartsData.length > 0) {
      rows.push(['SECTION:', 'CHART SERIES METRICS']);
      const keys = Object.keys(data.chartsData[0]);
      rows.push(keys);
      data.chartsData.forEach((row: any) => {
        rows.push(keys.map(k => row[k]));
      });
    }

    // Convert rows into a standard safe CSV string
    const csvContent = rows.map(r => r.map(v => {
      if (v === null || v === undefined) return '';
      const str = String(v);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AnalytixAI_${activeToolId}_metrics.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Interactive Tools Internal States
  const [insightQuery, setInsightQuery] = useState('');
  const [insightList, setInsightList] = useState<string[]>([
    "★ Revenue Acceleration: Product category 'Enterprise Suite' shows a 12.4% increase in sales velocity over the past 30 days.",
    "⚠ Margin Alert: Logistics fees for cross-border shipping have spiked by 8.5%, eating into gross profit parameters.",
    "⚡ Customer Insight: Churn rate is highly correlated with delivery delay metrics exceeding 5 days."
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Forecasting Tool State
  const [forecastGrowth, setForecastGrowth] = useState<number>(15);
  const [includeConfidence, setIncludeConfidence] = useState<boolean>(true);

  // Anomaly Detection State
  const [anomalyThreshold, setAnomalyThreshold] = useState<number>(2.0);
  const [isScanningAnomalies, setIsScanningAnomalies] = useState(false);
  const [anomalyResults, setAnomalyResults] = useState<any[]>([
    { id: 1, title: 'Revenue Spike on Day 14', severity: 'medium', desc: 'Total daily transaction value exceeded moving average by +2.4σ. Correlated with a marketing promotional push.', code: 'REV_SPIKE' },
    { id: 2, title: 'Operational Costs Surge on Day 28', severity: 'high', desc: 'Overhead fees spiked by +3.1σ. Driven by localized supply disruption penalties.', code: 'OPS_SURGE' }
  ]);

  // Root Cause Analyzer State
  const [selectedIssue, setSelectedIssue] = useState<string>('margin');

  // AI Assistant Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'assistant', text: 'Hello! I am your AI Business Assistant. Ask me anything about your loaded dataset, conversion rates, or operational risks.' }
  ]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  // --- GOAL TRACKER STATES & TYPES ---
  interface Goal {
    id: string;
    name: string;
    metricType: 'Revenue' | 'Users' | 'Margin %' | 'Custom';
    targetValue: number;
    targetDate: string;
    startDate: string;
  }

  const [goals, setGoals] = useState<Goal[]>(() => {
    return [
      {
        id: 'g1',
        name: 'Q3 Growth Expansion Target',
        metricType: 'Revenue',
        targetValue: 1500000,
        targetDate: '2026-10-31',
        startDate: '2026-06-01'
      },
      {
        id: 'g2',
        name: 'Active Platform User Milestone',
        metricType: 'Users',
        targetValue: 1100,
        targetDate: '2026-11-30',
        startDate: '2026-06-15'
      },
      {
        id: 'g3',
        name: 'SaaS Margin Optimization',
        metricType: 'Margin %',
        targetValue: 68.0,
        targetDate: '2026-09-30',
        startDate: '2026-07-01'
      }
    ];
  });

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalMetricType, setNewGoalMetricType] = useState<'Revenue' | 'Users' | 'Margin %' | 'Custom'>('Revenue');
  const [newGoalTargetValue, setNewGoalTargetValue] = useState<number>(1000000);
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('2026-12-31');

  // Edit Goal states
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalName, setEditingGoalName] = useState('');
  const [editingGoalMetricType, setEditingGoalMetricType] = useState<'Revenue' | 'Users' | 'Margin %' | 'Custom'>('Revenue');
  const [editingGoalTargetValue, setEditingGoalTargetValue] = useState<number>(0);
  const [editingGoalTargetDate, setEditingGoalTargetDate] = useState('');

  // Cross-linking Sights state
  const [crossLinkGoal, setCrossLinkGoal] = useState<Goal | null>(null);

  // Goal handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || newGoalTargetValue <= 0 || !newGoalTargetDate) return;
    const newGoal: Goal = {
      id: 'g_' + Date.now(),
      name: newGoalName,
      metricType: newGoalMetricType,
      targetValue: Number(newGoalTargetValue),
      targetDate: newGoalTargetDate,
      startDate: new Date().toISOString().slice(0, 10)
    };
    setGoals(prev => [...prev, newGoal]);
    setNewGoalName('');
    setNewGoalTargetValue(1000000);
    setNewGoalTargetDate('2026-12-31');
    setIsAddGoalOpen(false);
  };

  const handleStartEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingGoalName(goal.name);
    setEditingGoalMetricType(goal.metricType);
    setEditingGoalTargetValue(goal.targetValue);
    setEditingGoalTargetDate(goal.targetDate);
  };

  const handleSaveEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoalName.trim() || editingGoalTargetValue <= 0 || !editingGoalTargetDate) return;
    setGoals(prev => prev.map(g => {
      if (g.id === editingGoalId) {
        return {
          ...g,
          name: editingGoalName,
          metricType: editingGoalMetricType,
          targetValue: Number(editingGoalTargetValue),
          targetDate: editingGoalTargetDate
        };
      }
      return g;
    }));
    setEditingGoalId(null);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (crossLinkGoal?.id === id) {
      setCrossLinkGoal(null);
    }
  };

  // Linear Regression Helper for Goal Tracker
  const calculateGoalProjection = (goal: Goal) => {
    if (!kpis) {
      return {
        projectedDate: 'N/A',
        projectedValueAtTargetDate: 0,
        shortfall: 0,
        status: 'behind' as const,
        progressPct: 0,
        currentVal: 0,
        onPace: false
      };
    }

    let currentVal = 0;
    if (goal.metricType === 'Revenue') {
      currentVal = kpis.totalRevenue;
    } else if (goal.metricType === 'Users') {
      currentVal = Math.round(kpis.totalOrders * 0.82);
    } else if (goal.metricType === 'Margin %') {
      currentVal = baselineMetrics ? baselineMetrics.operatingMargin : 64.0;
    } else {
      currentVal = 100;
    }

    const progressPct = Math.min(100, Math.round((currentVal / goal.targetValue) * 100));
    const trend = kpis.revenueTrend || [];
    
    if (trend.length < 2) {
      return {
        projectedDate: 'Insufficient data points',
        projectedValueAtTargetDate: currentVal,
        shortfall: Math.max(0, goal.targetValue - currentVal),
        status: 'behind' as const,
        progressPct,
        currentVal,
        onPace: false
      };
    }

    const points = trend.map((t, idx) => {
      let y = t.revenue;
      if (goal.metricType === 'Users') {
        y = Math.round(t.revenue * (kpis.totalOrders / kpis.totalRevenue) * 0.82) || 0;
      } else if (goal.metricType === 'Margin %') {
        const profit = t.profit !== undefined ? t.profit : t.revenue * 0.64;
        y = (profit / t.revenue) * 100;
      } else {
        y = t.revenue * 0.001;
      }
      return { x: idx, y };
    });

    let regressionPoints: { x: number; y: number }[] = [];
    if (goal.metricType === 'Revenue' || goal.metricType === 'Users') {
      let cumSum = 0;
      regressionPoints = points.map((p) => {
        cumSum += p.y;
        return { x: p.x, y: cumSum };
      });
    } else {
      regressionPoints = points;
    }

    const n = regressionPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (const p of regressionPoints) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    }
    const denom = n * sumXX - sumX * sumX;
    const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    let projectedStep = slope <= 0 ? 999 : (goal.targetValue - intercept) / slope;
    if (currentVal >= goal.targetValue) {
      projectedStep = n - 1;
    }

    const firstDateStr = trend[0].date;
    const lastDateStr = trend[trend.length - 1].date;
    const firstDate = new Date(firstDateStr);
    const lastDate = new Date(lastDateStr);
    const totalDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
    const daysPerStep = totalDays / (trend.length - 1 || 1);

    const projectedTime = firstDate.getTime() + projectedStep * daysPerStep * (1000 * 3600 * 24);
    const projectedDateObj = new Date(projectedTime);
    
    let projectedDateStr = '';
    if (slope <= 0 && currentVal < goal.targetValue) {
      projectedDateStr = 'Never';
    } else if (projectedDateObj.getTime() > new Date('2035-12-31').getTime()) {
      projectedDateStr = 'Exceeds threshold (> 10 yrs)';
    } else {
      projectedDateStr = projectedDateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    }

    const targetDateObj = new Date(goal.targetDate);
    const daysToTargetDate = (targetDateObj.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
    const targetStep = daysToTargetDate / (daysPerStep || 1);
    const projectedValueAtTargetDate = slope * targetStep + intercept;
    const shortfall = Math.max(0, goal.targetValue - projectedValueAtTargetDate);

    const isCompleted = currentVal >= goal.targetValue;
    const onPace = isCompleted || (slope > 0 && projectedTime <= targetDateObj.getTime());
    
    const startDateObj = new Date(goal.startDate);
    const totalDuration = targetDateObj.getTime() - startDateObj.getTime();
    const elapsed = Date.now() - startDateObj.getTime();
    const elapsedRatio = totalDuration <= 0 ? 1 : Math.max(0, Math.min(1, elapsed / totalDuration));
    const expectedValueNow = goal.targetValue * elapsedRatio;

    let paceStatus: 'on-track' | 'warning' | 'behind' = 'on-track';
    if (isCompleted) {
      paceStatus = 'on-track';
    } else if (onPace) {
      paceStatus = 'on-track';
    } else if (currentVal >= expectedValueNow * 0.9) {
      paceStatus = 'warning';
    } else {
      paceStatus = 'behind';
    }

    return {
      projectedDate: projectedDateStr,
      projectedValueAtTargetDate: Math.round(projectedValueAtTargetDate * 10) / 10,
      shortfall: Math.round(shortfall * 10) / 10,
      status: paceStatus,
      progressPct,
      currentVal: Math.round(currentVal * 10) / 10,
      onPace
    };
  };

  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  // Scenario Simulator Decisions State
  const defaultDecisions: BusinessDecisions = {
    marketingSpendChange: 0,
    priceChange: 0,
    employeeChange: 0,
    deliveryTimeChange: 0,
    inventoryChange: 0,
    launchCampaign: false,
    reduceOperationalCosts: 0,
    increaseCapacity: 0,
    addSupplier: false
  };

  const [decisions, setDecisions] = useState<BusinessDecisions>(defaultDecisions);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'advisor' | 'risks'>('charts');

  // Baseline metrics calculated from kpis or fallback values if null
  const [baselineMetrics, setBaselineMetrics] = useState<SimulatedMetrics | null>(null);
  const [predictedMetrics, setPredictedMetrics] = useState<SimulatedMetrics | null>(null);
  
  // AI Advisor & Risks
  const [advisor, setAdvisor] = useState<AIAdvisor | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);

  // Saved scenarios registry
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [selectedScenariosForCompare, setSelectedScenariosForCompare] = useState<string[]>([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');

  // Sync / calculate baseline metrics
  useEffect(() => {
    // Generate simulated baseline metrics even if KPIs are null, so page can be explored in "demo mode"
    const r0 = kpis ? kpis.totalRevenue : 1250000;
    const p0 = kpis ? (kpis.revenueTrend && kpis.revenueTrend.some(pt => pt.profit !== undefined)
      ? kpis.revenueTrend.reduce((sum, pt) => sum + (pt.profit || 0), 0)
      : r0 * 0.65) : 812500;

    const e0 = r0 - p0;
    const baseline: SimulatedMetrics = {
      revenue: r0,
      profit: p0,
      expenses: e0,
      cashFlow: Math.round(p0 * 0.96),
      roi: Math.round((p0 / Math.max(1, e0)) * 100),
      customerGrowth: 0,
      churn: 2.4,
      inventoryHealth: 85,
      operatingMargin: Math.round((p0 / r0) * 1000) / 10,
      businessHealthScore: 70
    };

    setBaselineMetrics(baseline);
    setPredictedMetrics(baseline);

    setAdvisor({
      summary: 'Adjust the decision sliders or enter a prompt to simulate executive-level strategic forecasts.',
      benefits: [],
      risks: [],
      recommendedAction: 'Begin your digital business twin exploration by testing price, staffing, and budget changes.',
      confidenceScore: 100
    });

    setRiskAnalysis({
      overallRiskScore: 30,
      risks: [
        {
          id: 'cash_flow',
          name: 'Working Capital Buffer',
          level: 'low',
          description: 'Current operational cash flows remain highly stable under baseline parameters.',
          mitigation: 'Regularly monitor regional conversion vectors to preserve working reserves.'
        }
      ]
    });
  }, [kpis, language]);

  // Client-Side Math Simulation Core
  const runLocalSimulation = (updatedDecisions: BusinessDecisions) => {
    if (!baselineMetrics) return;

    const r0 = baselineMetrics.revenue;
    const p0 = baselineMetrics.profit;
    const e0 = baselineMetrics.expenses;
    const ch0 = 2.4;

    const {
      marketingSpendChange,
      priceChange,
      employeeChange,
      reduceOperationalCosts
    } = updatedDecisions;

    // Use user-provided simulation multiplier logic
    const marketingSpendPct = marketingSpendChange;
    const pricingPct = priceChange;
    const operatingCostsPct = -reduceOperationalCosts;
    const headcountChange = employeeChange;

    const revenueMultiplier = 1 + (marketingSpendPct * 0.4 / 100) + (pricingPct * 0.6 / 100);
    const r1 = Math.max(10000, Math.round(r0 * revenueMultiplier));

    const avgSalaryCost = 66000;
    const costMultiplier = 1 + (operatingCostsPct / 100) + (headcountChange * (avgSalaryCost / r0));
    const e1 = Math.max(5000, Math.round(e0 * costMultiplier));

    const p1 = r1 - e1;
    const operatingMargin1 = r1 > 0 ? ((r1 - e1) / r1) * 100 : 0;
    
    // Derived secondary indicators
    const cashFlow1 = Math.round(p1 * 0.96);
    const roi1 = Math.round((p1 / Math.max(1, e1)) * 100);
    const customerGrowth1 = Math.round(((r1 - r0) / r0) * 100 * 0.8 * 10) / 10;
    const churn1 = Math.max(0.2, Math.min(15, ch0 + (pricingPct * 0.15) - (marketingSpendPct * 0.05)));

    let businessHealthScore1 = 70;
    const marginChange = (operatingMargin1 / 100) - (p0 / r0);
    businessHealthScore1 += marginChange * 100;
    businessHealthScore1 += customerGrowth1 * 0.5;
    businessHealthScore1 = Math.max(10, Math.min(100, Math.round(businessHealthScore1)));

    setPredictedMetrics({
      revenue: r1,
      profit: p1,
      expenses: Math.round(e1),
      cashFlow: cashFlow1,
      roi: roi1,
      customerGrowth: customerGrowth1,
      churn: Math.round(churn1 * 10) / 10,
      inventoryHealth: Math.max(10, Math.min(100, Math.round(85 + (operatingCostsPct * 0.2)))),
      operatingMargin: Math.round(operatingMargin1 * 10) / 10,
      businessHealthScore: businessHealthScore1
    });
  };

  const runServerSimulation = async (updatedDecisions = decisions, customPrompt = '') => {
    setLoading(true);
    // Mimic the remote Twin simulation
    await new Promise(resolve => setTimeout(resolve, 1400));
    setLoading(false);

    setAdvisor({
      summary: customPrompt 
        ? `Strategic recommendation following proposal: "${customPrompt}". Expanding ad vectors is predicted to increase demand.`
        : 'Based on your simulated decisions, we project significant margin expansion if pricing adjustments are carefully targeted.',
      benefits: [
        'Marketing amplification secures larger high-value customer cohort',
        'Staff expansion matches customer service requirements under load'
      ],
      risks: [
        'Raw operating overhead rises to accommodate expanded product capacity',
        'Customer satisfaction depends on delivery logistics maintaining speed'
      ],
      recommendedAction: 'Approve the simulated marketing budget, paired with a 5% supplier capacity buff.',
      confidenceScore: 92
    });

    setRiskAnalysis({
      overallRiskScore: 45,
      risks: [
        {
          id: 'market_saturation',
          name: 'Market Penetration Resistance',
          level: 'medium',
          description: 'Diminishing marginal returns on marketing spend exceeding +50% budget levels.',
          mitigation: 'Pivot campaign creatives to high-affinity sub-cohorts identified in customer intel.'
        }
      ]
    });
  };

  const handleRunSimulation = async () => {
    setIsSimulatingRun(true);
    await runServerSimulation(decisions);
    setIsSimulatingRun(false);
  };

  const handleCancelEditGoal = () => {
    setEditingGoalId(null);
  };

  const handleSaveScenario = () => {
    if (!predictedMetrics || !advisor || !riskAnalysis) return;
    const name = newScenarioName.trim() || `Scenario ${savedScenarios.length + 1}`;
    const newSc: SavedScenario = {
      id: Date.now().toString(),
      name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisions,
      metrics: predictedMetrics,
      advisor,
      riskAnalysis
    };
    setSavedScenarios([...savedScenarios, newSc]);
    setNewScenarioName('');
  };

  const handleDeleteScenario = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
    setSelectedScenariosForCompare(selectedScenariosForCompare.filter(sid => sid !== id));
  };

  const handleToggleCompare = (id: string) => {
    if (selectedScenariosForCompare.includes(id)) {
      setSelectedScenariosForCompare(selectedScenariosForCompare.filter(sid => sid !== id));
    } else {
      if (selectedScenariosForCompare.length >= 3) {
        setSelectedScenariosForCompare([...selectedScenariosForCompare.slice(1), id]);
      } else {
        setSelectedScenariosForCompare([...selectedScenariosForCompare, id]);
      }
    }
  };

  // PDF Export Core
  const handleExportPDF = (scenario: SavedScenario | null) => {
    const sc = scenario || {
      name: 'Active Live Simulator',
      decisions,
      metrics: predictedMetrics,
      advisor,
      riskAnalysis
    };

    if (!sc.metrics || !sc.advisor || !sc.riskAnalysis) return;

    const doc = new jsPDF();
    const margin = 15;
    let y = 18;

    doc.setFillColor(5, 8, 22);
    doc.rect(0, 0, 220, 42, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ANALYTIXAI DIGITAL TWIN', margin, 18);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 200);
    doc.text(`EXECUTIVE STRATEGIC SCENARIO REPORT | ${sc.name.toUpperCase()}`, margin, 26);
    doc.text(`GENERATED ON: ${new Date().toLocaleDateString()} | CONFIDENCE LEVEL: ${sc.advisor.confidenceScore}%`, margin, 32);

    y = 52;
    doc.setTextColor(20, 24, 35);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('I. Strategic Decisions Enacted', margin, y);
    
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    const formatPct = (val: number) => (val >= 0 ? `+${val}%` : `${val}%`);
    const decList = [
      `• Marketing Spend Adjustment: ${formatPct(sc.decisions.marketingSpendChange)} (Campaign: ${sc.decisions.launchCampaign ? 'YES' : 'NO'})`,
      `• Product Pricing Shift: ${formatPct(sc.decisions.priceChange)}`,
      `• Team Capacity Modifier: ${sc.decisions.employeeChange >= 0 ? `+${sc.decisions.employeeChange}` : sc.decisions.employeeChange} Staff`,
      `• Logistics & Delivery Speedup: ${formatPct(sc.decisions.deliveryTimeChange)}`,
      `• Raw Inventory Buffer: ${formatPct(sc.decisions.inventoryChange)}`,
      `• Fixed Operational Cost Trim: ${formatPct(-sc.decisions.reduceOperationalCosts)}`,
      `• Supply Chain Diversification: ${sc.decisions.addSupplier ? 'YES' : 'NO'}`
    ];

    decList.forEach(line => {
      doc.text(line, margin + 4, y);
      y += 6;
    });

    y += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 24, 35);
    doc.text('II. Projected Twin Outcomes', margin, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('METRIC', margin + 4, y);
    doc.text('BASELINE VALUE', 80, y);
    doc.text('SIMULATED VALUE', 130, y);

    y += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const b = baselineMetrics || sc.metrics;
    const m = sc.metrics;
    const rows = [
      ['Total Revenue', `$${b.revenue.toLocaleString()}`, `$${m.revenue.toLocaleString()}`],
      ['Operating profit', `$${b.profit.toLocaleString()}`, `$${m.profit.toLocaleString()}`],
      ['Operational Expenses', `$${b.expenses.toLocaleString()}`, `$${m.expenses.toLocaleString()}`],
      ['Operating Margin', `${b.operatingMargin}%`, `${m.operatingMargin}%`],
      ['Twin Health Score', `${b.businessHealthScore}/100`, `${m.businessHealthScore}/100`]
    ];

    rows.forEach(r => {
      doc.text(r[0], margin + 4, y);
      doc.text(r[1], 80, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(16, 120, 80);
      doc.text(r[2], 130, y);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      y += 7;
    });

    y += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 24, 35);
    doc.text('III. AI Business Twin Strategic Advisory', margin, y);

    y += 8;
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    const summaryLines = doc.splitTextToSize(sc.advisor.summary, 180);
    doc.text(summaryLines, margin + 4, y);
    y += (summaryLines.length * 5) + 6;

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(180, 30, 30);
    doc.text('Recommended Execution Strategy:', margin + 4, y);
    y += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const recLines = doc.splitTextToSize(sc.advisor.recommendedAction, 175);
    doc.text(recLines, margin + 4, y);

    doc.save(`AnalytixAI_DigitalTwin_${sc.name.replace(/\s+/g, '_')}.pdf`);
  };

  // Chat Interactive Simulator Action
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const query = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsAssistantTyping(true);

    setTimeout(() => {
      setIsAssistantTyping(false);
      const rev = baselineMetrics?.revenue || 1250000;
      const margin = baselineMetrics?.operatingMargin || 65;
      let reply = "I've processed that parameter. Based on our loaded dataset models, ";
      
      if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('sale')) {
        reply += `your total baseline revenue registers at $${rev.toLocaleString()}. We project stable trajectory if your customer retention curves maintain momentum.`;
      } else if (query.toLowerCase().includes('margin') || query.toLowerCase().includes('profit') || query.toLowerCase().includes('cost')) {
        reply += `your digital twin maintains a ${margin}% operating margin. To buff this further, I recommend exploring our automated Cost Optimizer tool under the Optimization tab.`;
      } else if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('anomaly')) {
        reply += `overall operational risk indexes around 30% (Low). A micro-anomaly in delivery fulfillment speed represents your primary bottleneck vector right now.`;
      } else {
        reply += `we are sustaining an overall Twin Health Index of ${baselineMetrics?.businessHealthScore || 70}/100. Would you like me to simulate a Pricing Shift (+5%) to assess margin reactions?`;
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    }, 850);
  };

  // Forecasting Interactive Math Adjustments
  const getForecastData = () => {
    const monthlyBaseline = (baselineMetrics?.revenue || 1250000) / 12;
    const rate = forecastGrowth / 100;

    return Array.from({ length: 12 }, (_, i) => {
      const monthLabel = `M${i + 1}`;
      const actual = Math.round(monthlyBaseline * (1 + (Math.sin(i / 1.5) * 0.08)));
      const projection = Math.round(actual * (1 + (rate * (i / 11))));
      return {
        month: monthLabel,
        Baseline: actual,
        Projected: projection,
        Upper: includeConfidence ? Math.round(projection * 1.08) : projection,
        Lower: includeConfidence ? Math.round(projection * 0.92) : projection,
      };
    });
  };

  // Root Cause Cascade Data
  const getRootCauseFlow = () => {
    if (selectedIssue === 'margin') {
      return {
        title: 'Operating Margin Compression (-4.2% overall shift)',
        narrative: 'A systematic drill-down reveals raw materials inflation coupled with high logistics overhead is causing this contraction.',
        nodes: [
          { name: 'Raw Material Surcharges', weight: 58, level: 'high' },
          { name: 'Air Freight Congestion', weight: 27, level: 'medium' },
          { name: 'Localized Storage Penalties', weight: 15, level: 'low' }
        ]
      };
    } else if (selectedIssue === 'churn') {
      return {
        title: 'Customer Churn Spike (+1.2% seasonal anomaly)',
        narrative: 'AI correlates this churn vector with support ticket resolution bottlenecks in Region A during week 3.',
        nodes: [
          { name: 'Support Response Delay', weight: 64, level: 'high' },
          { name: 'Competitor Promotion Push', weight: 22, level: 'medium' },
          { name: 'Fulfillment Delivery Speed', weight: 14, level: 'low' }
        ]
      };
    } else {
      return {
        title: 'Average Delivery Time Lag (+18% freight drag)',
        narrative: 'Customs bottlenecks at terminal hub B accounted for almost two-thirds of transit delays.',
        nodes: [
          { name: 'Terminal Hub Congestion', weight: 70, level: 'high' },
          { name: 'Truck Dispatch Scheduling', weight: 18, level: 'low' },
          { name: 'Last-Mile Carrier Friction', weight: 12, level: 'low' }
        ]
      };
    }
  };

  // Filter Features (keeping perfect static relevance ordering)
  const filteredFeatures = FEATURES.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const STATUS_ORDER: Record<'Available' | 'Beta' | 'Coming Soon', number> = {
    'Available': 0,
    'Beta': 1,
    'Coming Soon': 2
  };

  const sortedFilteredFeatures = [...filteredFeatures].sort((a, b) => {
    return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  });

  const DUPLICATE_FEATURE_IDS = [
    'forecasting',
    'anomaly-detection',
    'root-cause-analysis',
    'ai-insights',
    'kpi-dashboard',
    'health-score',
    'sales-analytics',
    'profitability',
    'expense-analyzer',
    'ai-assistant',
    'smart-alerts'
  ];

  const uniqueFeatures = sortedFilteredFeatures.filter(f => !DUPLICATE_FEATURE_IDS.includes(f.id));
  const duplicateFeatures = sortedFilteredFeatures.filter(f => DUPLICATE_FEATURE_IDS.includes(f.id));

  const selectedFeature = FEATURES.find(f => f.id === selectedFeatureId) || FEATURES[0];

  return (
    <div className="flex-1 flex flex-col bg-[#050816] text-white min-h-[calc(100vh-64px)] overflow-y-auto font-sans relative">
      
      {/* 1. Main Directory Explorer View */}
      {activeToolId === null && (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Block */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-800/40 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-wider uppercase font-bold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>AnalytixAI Neural Suite</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {tL('lab.title')}
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl font-sans">
                {tL('lab.subtitle')}
              </p>
            </div>

            {/* Seamless load indicators for non-loaded states */}
            {!kpis && (
              <div className="px-4 py-3 bg-[#10b981]/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <Info className="w-4 h-4 text-emerald-400" />
                <div className="text-xs">
                  <span className="text-gray-400 block">Currently in Sandbox mode</span>
                  <button onClick={onLoadDemo} className="text-emerald-400 font-bold hover:underline">Load Demo Data</button> to unlock live twin models.
                </div>
              </div>
            )}
          </div>

          {/* Search bar & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#070b1e]/60 border border-gray-800/40 p-4 rounded-2xl backdrop-blur-md">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI Tools..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0f26]/80 border border-gray-800/80 rounded-xl focus:border-emerald-500/50 focus:outline-none transition font-sans text-sm text-gray-200"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Analytics', 'Prediction', 'Optimization', 'Automation', 'Reports'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-gray-900/30 text-gray-400 hover:text-white border border-gray-800/60 hover:border-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Core Dual Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Grid of Compact square cards */}
            <div className="lg:col-span-7 space-y-6">
              {uniqueFeatures.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  {uniqueFeatures.map((feat) => {
                    const IconComponent = feat.icon;
                    const isSelected = selectedFeatureId === feat.id;
                    
                    return (
                      <motion.div
                        key={feat.id}
                        onClick={() => {
                          setSelectedFeatureId(feat.id);
                          detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative aspect-[1.15] sm:aspect-square p-2.5 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col justify-between cursor-pointer border backdrop-blur-md transition-all duration-300 select-none ${
                          isSelected 
                            ? 'bg-[#10b981]/5 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.12)]' 
                            : 'bg-[#070b1e]/40 border-gray-800/40 hover:border-gray-700/60 hover:bg-[#0a0f26]/30'
                        }`}
                      >
                        {/* Selection glow marker */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-xl sm:rounded-t-2xl shadow-[0_0_12px_#10b981]" />
                        )}

                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-900/60 border border-gray-800/50 flex items-center justify-center shadow-inner">
                          <IconComponent className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                        </div>

                        <div className="space-y-0.5 sm:space-y-1.5">
                          <h3 className="font-bold text-[10px] sm:text-sm tracking-tight text-white leading-tight">{feat.name}</h3>
                          <p className="text-[8.5px] sm:text-[11px] text-gray-400 line-clamp-2 leading-tight font-sans">{feat.tagline}</p>
                          
                          <div className="flex items-center pt-0.5 sm:pt-0">
                            <span className={`px-1 py-0.5 sm:px-2 rounded text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider ${
                              feat.status === 'Available' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : feat.status === 'Beta' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-gray-800/50 text-gray-500 border border-gray-800'
                            }`}>
                              {feat.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {uniqueFeatures.length > 0 && duplicateFeatures.length > 0 && (
                <div className="relative py-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/[0.06]"></div>
                  </div>
                  <div className="relative px-4 bg-[#050816] text-[10px] font-mono tracking-wider text-white/40 uppercase font-bold text-center">
                    Deep-dive views of your Dashboard metrics
                  </div>
                </div>
              )}

              {duplicateFeatures.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  {duplicateFeatures.map((feat) => {
                    const IconComponent = feat.icon;
                    const isSelected = selectedFeatureId === feat.id;
                    
                    return (
                      <motion.div
                        key={feat.id}
                        onClick={() => {
                          setSelectedFeatureId(feat.id);
                          detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative aspect-[1.15] sm:aspect-square p-2.5 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col justify-between cursor-pointer border backdrop-blur-md transition-all duration-300 select-none ${
                          isSelected 
                            ? 'bg-[#10b981]/5 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.12)]' 
                            : 'bg-[#070b1e]/40 border-gray-800/40 hover:border-gray-700/60 hover:bg-[#0a0f26]/30'
                        }`}
                      >
                        {/* Selection glow marker */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-xl sm:rounded-t-2xl shadow-[0_0_12px_#10b981]" />
                        )}

                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-900/60 border border-gray-800/50 flex items-center justify-center shadow-inner">
                          <IconComponent className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                        </div>

                        <div className="space-y-0.5 sm:space-y-1.5">
                          <h3 className="font-bold text-[10px] sm:text-sm tracking-tight text-white leading-tight">{feat.name}</h3>
                          <p className="text-[8.5px] sm:text-[11px] text-gray-400 line-clamp-2 leading-tight font-sans">{feat.tagline}</p>
                          
                          <div className="flex items-center pt-0.5 sm:pt-0">
                            <span className={`px-1 py-0.5 sm:px-2 rounded text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider ${
                              feat.status === 'Available' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : feat.status === 'Beta' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-gray-800/50 text-gray-500 border border-gray-800'
                            }`}>
                              {feat.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Detailed Panel with Framer Motion */}
            <div ref={detailPanelRef} className="lg:col-span-5 scroll-mt-6 md:scroll-mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6 relative overflow-hidden"
                >
                  {/* Aura Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full" />

                  <div className="flex items-start justify-between gap-4 border-b border-gray-800/40 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        {React.createElement(selectedFeature.icon, { className: "w-6 h-6 text-emerald-400" })}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">{selectedFeature.name}</h2>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{selectedFeature.category}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      selectedFeature.status === 'Available' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : selectedFeature.status === 'Beta' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-gray-800/50 text-gray-500 border border-gray-800'
                    }`}>
                      {selectedFeature.status}
                    </span>
                  </div>

                  <div className="text-emerald-400 font-semibold text-sm tracking-wide font-sans border-l-2 border-emerald-500 pl-3">
                    {selectedFeature.tagline}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed font-sans">{selectedFeature.description}</p>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Main Capabilities</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                      {selectedFeature.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Example Use Cases</h3>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      {selectedFeature.useCases.map((uc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Aesthetic AI Generated Output Preview */}
                  <div className="bg-[#0a0f26]/80 border border-gray-800/60 rounded-2xl p-4 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-gray-800/40 pb-2">
                      <span className="text-[9px] font-bold font-mono text-emerald-400 tracking-wider">AI SYSTEM OUT PREVIEW</span>
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 animate-pulse"></span>
                      </span>
                    </div>

                    {selectedFeature.sampleOutputId === 'simulator' && (
                      <div className="text-xs space-y-1.5 text-gray-300 font-mono">
                        <div className="flex justify-between"><span>Revenue impact projection:</span><span className="text-emerald-400 font-bold">+14.2%</span></div>
                        <div className="flex justify-between"><span>Operating margin:</span><span className="text-white">68.2% (vs 65%)</span></div>
                        <div className="flex justify-between"><span>Simulated Health Score:</span><span className="text-emerald-400">84/100</span></div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'insights' && (
                      <div className="text-xs space-y-1.5 text-gray-300 leading-relaxed italic font-sans">
                        "Increasing corporate conversion budgets in Region B yields +3.2x multiplier correlation with average order ticket values."
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'forecast' && (
                      <div className="text-xs space-y-1 text-gray-300 font-mono">
                        <div>Projected 12-Month Revenue: $1.43M</div>
                        <div>Target Growth: 15% (Confidence: 94.2%)</div>
                        <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-400 w-[94%]" /></div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'anomaly' && (
                      <div className="text-xs space-y-1 text-rose-400 font-mono">
                        <div>🚨 Outlier flagged (Day 28): +3.1σ Cost surge</div>
                        <div className="text-gray-400 text-[10px]">Causal vector: Local supplier logistics surcharges</div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'root-cause' && (
                      <div className="text-xs space-y-1 text-gray-300 font-sans">
                        <div className="font-bold text-amber-400">Primary margin driver detected:</div>
                        <div>• Raw Materials cost spikes (60% contribution factor)</div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'reports' && (
                      <div className="text-xs text-gray-400 flex items-center justify-between font-mono">
                        <span>PDF Template v2.4</span>
                        <span className="text-emerald-400">Ready to download</span>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'assistant' && (
                      <div className="text-xs text-gray-300 leading-relaxed font-sans italic">
                        "Your current operating margin is 65%. To push this to 68%, consider trimming secondary marketing overheads."
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'inventory' && (
                      <div className="text-xs text-gray-300 font-mono">
                        <div>SKU-904 Safety Stock recommendations:</div>
                        <div className="text-emerald-400">Release buffer from 12 days to 8 days (Frees $14K)</div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'costs' && (
                      <div className="text-xs text-emerald-400 font-mono">
                        ✓ SaaS audit: 12 idle licenses detected. Trim saves $1,400/mo.
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'customers' && (
                      <div className="text-xs text-gray-300 font-sans">
                        <div>Cohort: <span className="font-bold text-indigo-400">'Loyal Advocates'</span> comprise 18% of user base and drive 42% revenue volume.</div>
                      </div>
                    )}

                    {selectedFeature.sampleOutputId === 'coming-soon' && (
                      <div className="text-xs text-gray-500 text-center py-2 italic font-sans">
                        Module is currently under active model compilation.
                      </div>
                    )}
                  </div>

                  {/* Launch trigger button */}
                  <button
                    disabled={selectedFeature.status === 'Coming Soon'}
                    onClick={() => {
                      if (!kpis && selectedFeature.status === 'Available') {
                        onLoadDemo();
                        setActiveToolId(selectedFeature.id);
                      } else {
                        setActiveToolId(selectedFeature.id);
                      }
                    }}
                    className={`w-full py-4 text-center font-bold rounded-2xl transition duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 cursor-pointer ${
                      selectedFeature.status === 'Coming Soon' 
                        ? 'bg-gray-800/40 text-gray-500 border border-gray-800 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#020617]'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch {selectedFeature.name}</span>
                    {!kpis && selectedFeature.status === 'Available' && <span className="text-[10px] font-normal opacity-80">(Auto Loads Demo)</span>}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ACTIVE TOOLS RUNNING (Launched Sandbox Interfaces) */}
      {/* ======================================================== */}
      
      {activeToolId !== null && (
        <div className="flex-1 flex flex-col h-full bg-[#050816]">
          
          {/* Active Tool Sub-header with Return anchor */}
          <div className="p-5 border-b border-gray-800/40 bg-[#070b1e]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setActiveToolId(null);
                  setDecisions(defaultDecisions);
                }}
                className="px-4 py-2 text-xs font-semibold bg-gray-900/60 hover:bg-gray-900 border border-gray-800 hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                ← Back to AI Labs
              </button>
              <div className="h-6 w-[1px] bg-gray-800" />
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {React.createElement(FEATURES.find(f => f.id === activeToolId)?.icon || Sliders, { className: "w-4 h-4" })}
                </span>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">{FEATURES.find(f => f.id === activeToolId)?.name} Workspace</h2>
                  <p className="text-[10px] text-gray-400">Active simulated digital twin environment</p>
                </div>
              </div>
            </div>

            {activeToolId === 'scenario-simulator' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExportPDF(null)}
                  className="px-4 py-2 bg-[#0a1128] hover:bg-[#101b44] border border-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-semibold rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  {tL('lab.export_report')}
                </button>
                <button
                  onClick={() => {
                    setDecisions(defaultDecisions);
                    runLocalSimulation(defaultDecisions);
                  }}
                  className="px-4 py-2 bg-gray-900/40 hover:bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white font-medium rounded-xl transition duration-200 cursor-pointer text-xs"
                >
                  {tL('lab.reset')}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            
            {/* ======================================================== */}
            {/* TOOL 1: WHAT-IF SCENARIO SIMULATOR (Custom high-fidelity 3-column view) */}
            {/* ======================================================== */}
            {activeToolId === 'scenario-simulator' && (
              <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 w-full">
                
                {/* Simulation calculating overlay */}
                {isSimulatingRun && (
                  <div className="fixed inset-0 bg-[#02040d]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-purple-400 absolute animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide">Running Digital Twin Simulation...</h3>
                    <p className="text-xs text-gray-400 mt-1">Recalculating multidimensional corporate outcome parameters</p>
                  </div>
                )}

                {/* Sights banner if goal is selected for simulation */}
                {crossLinkGoal && (
                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Simulation Target Matching Sights: {crossLinkGoal.name}</h4>
                        <p className="text-xs text-gray-400">Aiming for <span className="text-purple-400 font-bold">{crossLinkGoal.metricType === 'Revenue' ? `$${crossLinkGoal.targetValue.toLocaleString()}` : crossLinkGoal.metricType === 'Margin %' ? `${crossLinkGoal.targetValue}%` : crossLinkGoal.targetValue.toLocaleString()}</span> by {new Date(crossLinkGoal.targetDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setCrossLinkGoal(null)}
                      className="px-3 py-1.5 bg-gray-950 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition"
                    >
                      Clear Target Sights
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Column 1: Decision Adjustments Slider Panel (xl:col-span-4) */}
                  <div className="lg:col-span-4 bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-purple-400" />
                        Enterprise Inputs
                      </h3>
                      <p className="text-xs text-gray-400">Adjust the operational levers below to model strategic business changes</p>
                    </div>

                    <div className="space-y-5">
                      {/* Loops critical slider controls */}
                      {[
                        { key: 'marketingSpendChange', label: 'Marketing Budget Adjust', min: -50, max: 150, unit: '%' },
                        { key: 'priceChange', label: 'Product Pricing Shift', min: -30, max: 50, unit: '%' },
                        { key: 'employeeChange', label: 'Workforce Capacity Shift', min: -10, max: 20, unit: ' staff' },
                        { key: 'reduceOperationalCosts', label: 'Ops Waste Pruning', min: 0, max: 30, unit: '%' },
                      ].map((sld) => (
                        <div key={sld.key} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">{sld.label}</span>
                            <span className="font-mono text-purple-400 font-bold">
                              {decisions[sld.key as keyof BusinessDecisions] >= 0 ? '+' : ''}
                              {decisions[sld.key as keyof BusinessDecisions]}
                              {sld.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={sld.min}
                            max={sld.max}
                            value={decisions[sld.key as keyof BusinessDecisions] as number}
                            onChange={(e) => {
                              const updated = { ...decisions, [sld.key]: Number(e.target.value) };
                              setDecisions(updated);
                              runLocalSimulation(updated);
                            }}
                            className="w-full h-1.5 bg-[#030712] rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Run Simulation button */}
                    <div className="pt-4 border-t border-gray-800/40">
                      <button
                        onClick={handleRunSimulation}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer transition shadow-[0_4px_15px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Run Digital Simulation
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Target Sights & Baseline Snapshot (xl:col-span-4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Goal Sights Checker */}
                    <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Simulation Sights vs. Goal</h4>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[9px] font-mono">
                          BENCHMARK SIGHTS
                        </span>
                      </div>

                      {/* Dropdown selector for choosing other targets */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 block">Select active goal target to compare:</label>
                        <select
                          value={crossLinkGoal?.id || 'none'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'none') setCrossLinkGoal(null);
                            else setCrossLinkGoal(goals.find(g => g.id === val) || null);
                          }}
                          className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                        >
                          <option value="none">None (Free-form Simulation)</option>
                          {goals.map(g => (
                            <option key={g.id} value={g.id}>{g.name} ({g.metricType})</option>
                          ))}
                        </select>
                      </div>

                      {crossLinkGoal ? {
                        ...(() => {
                          let isMet = false;
                          let currentSimVal = 0;
                          let diffStr = '';
                          
                          if (crossLinkGoal.metricType === 'Revenue') {
                            currentSimVal = predictedMetrics?.revenue || 0;
                            isMet = currentSimVal >= crossLinkGoal.targetValue;
                            const diff = currentSimVal - crossLinkGoal.targetValue;
                            diffStr = diff >= 0 ? `+$${diff.toLocaleString()} surplus` : `-$${Math.abs(diff).toLocaleString()} shortfall`;
                          } else if (crossLinkGoal.metricType === 'Users') {
                            currentSimVal = predictedMetrics ? Math.round((kpis?.totalOrders || 1000) * 0.82 * (1 + predictedMetrics.customerGrowth/100)) : 820;
                            isMet = currentSimVal >= crossLinkGoal.targetValue;
                            const diff = currentSimVal - crossLinkGoal.targetValue;
                            diffStr = diff >= 0 ? `+${diff.toLocaleString()} users surplus` : `-${Math.abs(diff).toLocaleString()} users shortfall`;
                          } else if (crossLinkGoal.metricType === 'Margin %') {
                            currentSimVal = predictedMetrics?.operatingMargin || 0;
                            isMet = currentSimVal >= crossLinkGoal.targetValue;
                            const diff = currentSimVal - crossLinkGoal.targetValue;
                            diffStr = diff >= 0 ? `+${diff.toFixed(1)}% pts surplus` : `-${Math.abs(diff).toFixed(1)}% pts shortfall`;
                          }

                          const progressPct = Math.min(100, Math.round((currentSimVal / crossLinkGoal.targetValue) * 100));

                          return (
                            <div className="pt-3 border-t border-gray-800/40 space-y-3.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Predicted Metric Value:</span>
                                <span className="font-mono text-white font-bold">
                                  {crossLinkGoal.metricType === 'Revenue' ? `$${currentSimVal.toLocaleString()}` : crossLinkGoal.metricType === 'Margin %' ? `${currentSimVal}%` : currentSimVal.toLocaleString()}
                                </span>
                              </div>
                              
                              {/* Progress bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-gray-400">Target Match Rate</span>
                                  <span className="font-mono text-white">{progressPct}%</span>
                                </div>
                                <div className="w-full bg-[#050917] rounded-full h-1.5 overflow-hidden border border-gray-800">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${isMet ? 'bg-emerald-400' : 'bg-rose-500'}`}
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                              </div>

                              <div className={`p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 ${isMet ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                <span className={`w-2 h-2 rounded-full ${isMet ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                                <span>{isMet ? 'Target Achieved! 🎉' : `Behind: ${diffStr}`}</span>
                              </div>
                            </div>
                          );
                        })()
                      } : (
                        <div className="pt-2 text-center text-xs text-gray-500 py-3 italic font-sans border-t border-gray-800/40">
                          Configure a benchmark goal to unlock real-time target matching outcomes.
                        </div>
                      )}
                    </div>

                    {/* Baseline Snapshot Card */}
                    <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                          <Info className="w-4 h-4 text-purple-400" />
                          Baseline Parameters
                        </h3>
                        <p className="text-[10px] text-gray-400">Extracts from current system actuals</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {[
                          { label: 'Revenue', value: `$${baselineMetrics?.revenue.toLocaleString()}` },
                          { label: 'Profit', value: `$${baselineMetrics?.profit.toLocaleString()}` },
                          { label: 'Expenses', value: `$${baselineMetrics?.expenses.toLocaleString()}` },
                          { label: 'Margin', value: `${baselineMetrics?.operatingMargin}%` }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 bg-[#0a0f26] border border-gray-800/40 rounded-xl">
                            <span className="text-[10px] text-gray-500 block mb-0.5">{item.label}</span>
                            <span className="text-xs font-bold font-mono text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Column 3: Outcomes and Side-by-Side Comparison (xl:col-span-4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Simulated Outcomes</h3>
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[9px] font-extrabold tracking-widest font-mono">
                          92% CONFIDENCE
                        </span>
                      </div>

                      {/* Side-by-Side Delta Comparison Table */}
                      <div className="space-y-3 pt-1">
                        {[
                          { 
                            label: 'Revenue', 
                            baseVal: baselineMetrics?.revenue || 0, 
                            predVal: predictedMetrics?.revenue || 0,
                            isCurrency: true,
                            lowerIsBetter: false
                          },
                          { 
                            label: 'Opex Costs', 
                            baseVal: baselineMetrics?.expenses || 0, 
                            predVal: predictedMetrics?.expenses || 0,
                            isCurrency: true,
                            lowerIsBetter: true
                          },
                          { 
                            label: 'Op Profit', 
                            baseVal: baselineMetrics?.profit || 0, 
                            predVal: predictedMetrics?.profit || 0,
                            isCurrency: true,
                            lowerIsBetter: false
                          },
                          { 
                            label: 'Op Margin', 
                            baseVal: baselineMetrics?.operatingMargin || 0, 
                            predVal: predictedMetrics?.operatingMargin || 0,
                            isCurrency: false,
                            isPct: true,
                            lowerIsBetter: false
                          }
                        ].map((item, idx) => {
                          const delta = item.predVal - item.baseVal;
                          const deltaPct = item.baseVal > 0 ? (delta / item.baseVal) * 100 : 0;
                          
                          let isPositiveImpact = delta > 0;
                          if (item.lowerIsBetter) isPositiveImpact = delta < 0;
                          const isZero = delta === 0;

                          return (
                            <div key={idx} className="p-3 bg-[#0a0f26]/80 border border-gray-800/50 rounded-2xl space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-medium">{item.label}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold font-mono ${isZero ? 'bg-gray-800 text-gray-400' : isPositiveImpact ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                  {isZero ? '' : isPositiveImpact ? '▲ ' : '▼ '}
                                  {isZero ? '0.0%' : `${Math.abs(item.isPct ? delta : deltaPct).toFixed(1)}%`}
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline pt-0.5">
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {item.isCurrency ? `$${Math.round(item.baseVal).toLocaleString()}` : `${item.baseVal.toFixed(1)}%`}
                                </span>
                                <span className="text-xs text-gray-300 font-mono">→</span>
                                <span className="text-sm font-bold text-white font-mono">
                                  {item.isCurrency ? `$${Math.round(item.predVal).toLocaleString()}` : `${item.predVal.toFixed(1)}%`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Twin Health score */}
                      <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase">Twin Health Index</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Aggregate metric efficiency vector</p>
                        </div>
                        <div className="text-2xl font-extrabold font-mono text-purple-400">
                          {predictedMetrics?.businessHealthScore}/100
                        </div>
                      </div>

                      {/* Save Registry Input */}
                      <div className="pt-2 border-t border-gray-800/40 space-y-2">
                        <input
                          type="text"
                          placeholder="Name this scenario configuration..."
                          value={newScenarioName}
                          onChange={(e) => setNewScenarioName(e.target.value)}
                          className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50"
                        />
                        <button
                          onClick={handleSaveScenario}
                          className="w-full py-2.5 bg-[#101b44] hover:bg-[#16255d] border border-gray-700/50 text-white font-semibold rounded-xl text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-purple-400" />
                          Save to Registry
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* TOOL: BRAND NEW BUSINESS GOAL TRACKER (Custom Full View Workspace) */}
            {/* ======================================================== */}
            {activeToolId === 'goal-tracker' && (
              <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 w-full">
                
                {/* Header Actions row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
                  <div>
                    <h1 className="text-xl font-extrabold font-display text-white">Business Goal Tracker</h1>
                    <p className="text-xs text-gray-400">Track key corporate targets against live metrics with trend dates compiled via linear regression models.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddGoalOpen(true)}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-[0_4px_15px_rgba(147,51,234,0.3)] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Goal Objective
                  </button>
                </div>

                {/* Goals display grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => {
                    const proj = calculateGoalProjection(goal);
                    return (
                      <div 
                        key={goal.id} 
                        className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-gray-700/80 transition"
                      >
                        {/* Title details header */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold font-mono uppercase ${
                              goal.metricType === 'Revenue' 
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                : goal.metricType === 'Users' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                : goal.metricType === 'Margin %' 
                                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                                : 'bg-gray-800/50 text-gray-400 border border-gray-800'
                            }`}>
                              {goal.metricType}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => handleStartEditGoal(goal)}
                                className="p-1 hover:text-white text-gray-400 transition cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="p-1 hover:text-rose-400 text-gray-400 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-white font-display line-clamp-1">{goal.name}</h3>
                          <p className="text-[10px] text-gray-400">Targeting <span className="text-white font-bold">{goal.metricType === 'Revenue' ? `$${goal.targetValue.toLocaleString()}` : goal.metricType === 'Margin %' ? `${goal.targetValue}%` : goal.targetValue.toLocaleString()}</span> by {new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>

                        {/* Circular progress SVG */}
                        <div className="flex justify-center items-center py-2">
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="36"
                                className={`${
                                  proj.status === 'on-track' 
                                    ? 'stroke-emerald-500/10' 
                                    : proj.status === 'warning' 
                                    ? 'stroke-amber-500/10' 
                                    : 'stroke-rose-500/10'
                                }`}
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="36"
                                className={`${
                                  proj.status === 'on-track' 
                                    ? 'stroke-emerald-400' 
                                    : proj.status === 'warning' 
                                    ? 'stroke-amber-400' 
                                    : 'stroke-rose-500'
                                } transition-all duration-500`}
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={226.2}
                                strokeDashoffset={226.2 - (226.2 * proj.progressPct) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-sm font-extrabold font-mono text-white leading-none">{proj.progressPct}%</span>
                              <span className="text-[8px] font-medium uppercase tracking-wider text-gray-400 mt-0.5">Complete</span>
                            </div>
                          </div>
                        </div>

                        {/* Current vs Target status footer */}
                        <div className="p-3 bg-[#0a0f26]/80 border border-gray-800/40 rounded-2xl space-y-1 text-center">
                          <span className="text-[10px] text-gray-500 font-medium">LATEST LIVE SYSTEM ACTUALS</span>
                          <div className="text-xs font-bold text-white font-mono">
                            {goal.metricType === 'Revenue' ? `$${proj.currentVal.toLocaleString()}` : goal.metricType === 'Margin %' ? `${proj.currentVal}%` : proj.currentVal.toLocaleString()} 
                            <span className="text-gray-500 font-normal"> / </span> 
                            {goal.metricType === 'Revenue' ? `$${goal.targetValue.toLocaleString()}` : goal.metricType === 'Margin %' ? `${goal.targetValue}%` : goal.targetValue.toLocaleString()}
                          </div>
                        </div>

                        {/* Pacing linear regression block */}
                        <div className="space-y-2">
                          <div className={`p-3 rounded-2xl border flex items-start gap-2 text-[11px] font-medium leading-relaxed ${
                            proj.status === 'on-track'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : proj.status === 'warning'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                            <div>
                              {proj.status === 'on-track' ? (
                                <span>On pace — projected to reach target by <span className="font-bold underline">{proj.projectedDate}</span></span>
                              ) : (
                                <span>Behind pace — projected shortfall of <span className="font-bold underline">{goal.metricType === 'Revenue' ? `$${proj.shortfall.toLocaleString()}` : goal.metricType === 'Margin %' ? `${proj.shortfall}%` : proj.shortfall.toLocaleString()}</span> by deadline</span>
                              )}
                            </div>
                          </div>

                          {/* Cross-linking to Simulator button if goal is warning or behind */}
                          {proj.status !== 'on-track' && (
                            <button
                              onClick={() => {
                                setCrossLinkGoal(goal);
                                setActiveToolId('scenario-simulator');
                              }}
                              className="w-full py-2 bg-[#121028] hover:bg-[#1a173d] border border-purple-500/20 hover:border-purple-500/50 text-purple-400 font-bold text-[10px] tracking-wide uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              Simulate a path to this goal
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* ADD GOAL OVERLAY MODAL */}
                {isAddGoalOpen && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#070b1e] border border-gray-800/80 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
                      <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Compass className="w-5 h-5 text-purple-400" /> Add Strategic Goal
                        </h3>
                        <button onClick={() => setIsAddGoalOpen(false)} className="text-gray-400 hover:text-white text-sm cursor-pointer">✕</button>
                      </div>
                      <form onSubmit={handleAddGoal} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Goal Objective Name</label>
                          <input
                            type="text"
                            required
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            placeholder="e.g. Q3 Growth Targets"
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Metric Type</label>
                          <select
                            value={newGoalMetricType}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setNewGoalMetricType(val);
                              if (val === 'Revenue') setNewGoalTargetValue(1500000);
                              else if (val === 'Users') setNewGoalTargetValue(1200);
                              else if (val === 'Margin %') setNewGoalTargetValue(65.0);
                              else setNewGoalTargetValue(500);
                            }}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          >
                            <option value="Revenue">Revenue ($)</option>
                            <option value="Users">Users (Platform Customers)</option>
                            <option value="Margin %">Margin (Operating %)</option>
                            <option value="Custom">Custom Indicator</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Target value</label>
                          <input
                            type="number"
                            step="any"
                            required
                            value={newGoalTargetValue}
                            onChange={(e) => setNewGoalTargetValue(Number(e.target.value))}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Deadline Date</label>
                          <input
                            type="date"
                            required
                            value={newGoalTargetDate}
                            onChange={(e) => setNewGoalTargetDate(e.target.value)}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="flex gap-2 pt-2 justify-end">
                          <button type="button" onClick={() => setIsAddGoalOpen(false)} className="px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                          <button type="submit" className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Create Goal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* EDIT GOAL OVERLAY MODAL */}
                {editingGoalId !== null && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#070b1e] border border-gray-800/80 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
                      <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Edit2 className="w-5 h-5 text-purple-400" /> Edit Strategic Goal
                        </h3>
                        <button onClick={handleCancelEditGoal} className="text-gray-400 hover:text-white text-sm cursor-pointer">✕</button>
                      </div>
                      <form onSubmit={handleSaveEditGoal} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Goal Objective Name</label>
                          <input
                            type="text"
                            required
                            value={editingGoalName}
                            onChange={(e) => setEditingGoalName(e.target.value)}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Metric Type</label>
                          <select
                            value={editingGoalMetricType}
                            onChange={(e) => setEditingGoalMetricType(e.target.value as any)}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          >
                            <option value="Revenue">Revenue ($)</option>
                            <option value="Users">Users (Platform Customers)</option>
                            <option value="Margin %">Margin (Operating %)</option>
                            <option value="Custom">Custom Indicator</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Target value</label>
                          <input
                            type="number"
                            step="any"
                            required
                            value={editingGoalTargetValue}
                            onChange={(e) => setEditingGoalTargetValue(Number(e.target.value))}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-medium">Deadline Date</label>
                          <input
                            type="date"
                            required
                            value={editingGoalTargetDate}
                            onChange={(e) => setEditingGoalTargetDate(e.target.value)}
                            className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="flex gap-2 pt-2 justify-end">
                          <button type="button" onClick={handleCancelEditGoal} className="px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                          <button type="submit" className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Save Changes</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TOOL 2: AI INSIGHTS INTERACTIVE */}
            {activeToolId === 'ai-insights' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Dynamic KPI Deep-Dive
                    </h3>
                    <p className="text-xs text-gray-400">Extract real-time micro-insights and neural correlations directly from baseline database vectors</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={insightQuery}
                      onChange={(e) => setInsightQuery(e.target.value)}
                      placeholder='Ask insights, e.g., "Suggest conversions improvement roadmap"'
                      className="flex-1 bg-[#050917] border border-gray-800/80 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition"
                    />
                    <button
                      onClick={() => {
                        if (!insightQuery.trim()) return;
                        setIsAnalyzing(true);
                        setTimeout(() => {
                          setIsAnalyzing(false);
                          setInsightList(prev => [
                            `★ Custom analysis vector for: "${insightQuery}" - Correlating high average order values confirms premium customers convert 1.4x faster under optimized logistics rates.`,
                            ...prev
                          ]);
                          setInsightQuery('');
                        }, 900);
                      }}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#020617] font-bold rounded-xl text-sm hover:opacity-90 cursor-pointer transition"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Query'}
                    </button>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Insight Stream</h4>
                    {insightList.map((ins, idx) => (
                      <div key={idx} className="p-4 bg-[#0a0f26] border border-gray-800/40 rounded-2xl space-y-1">
                        <p className="text-sm text-gray-200 leading-relaxed font-sans">{ins}</p>
                        <span className="text-[10px] text-gray-500 font-mono">Confidence index: 94.2% | Source: Baseline dataset</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 3: FORECASTING INTERACTIVE */}
            {activeToolId === 'forecasting' && (
              <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Rolling 12-Month Projections
                      </h3>
                      <p className="text-xs text-gray-400">Adjust the simulated target rate to see the predictive trajectories adapt dynamically</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeConfidence}
                          onChange={(e) => setIncludeConfidence(e.target.checked)}
                          className="rounded border-gray-800 accent-emerald-500"
                        />
                        Confidence Interval
                      </label>
                    </div>
                  </div>

                  {/* Growth adjust */}
                  <div className="p-4 bg-[#0a0f26]/80 border border-gray-800/50 rounded-2xl flex items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Target Growth Rate Baseline Modifier:</span>
                        <span className="text-emerald-400 font-bold font-mono text-sm">{forecastGrowth}%</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="40"
                        value={forecastGrowth}
                        onChange={(e) => setForecastGrowth(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* High Quality Chart */}
                  <div className="h-[320px] w-full bg-[#030712]/50 p-4 border border-gray-800/40 rounded-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getForecastData()}>
                        <defs>
                          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} />
                        <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#070b1e', borderColor: '#1f2937', color: '#fff' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                        <Area type="monotone" dataKey="Baseline" stroke="#818cf8" fillOpacity={1} fill="url(#colorBaseline)" strokeWidth={2} />
                        <Area type="monotone" dataKey="Projected" stroke="#34d399" fillOpacity={1} fill="url(#colorProjected)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 4: ANOMALY DETECTION INTERACTIVE */}
            {activeToolId === 'anomaly-detection' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-800/40 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-emerald-400" />
                        Observability Outlier Scanning
                      </h3>
                      <p className="text-xs text-gray-400">Adjust the variance thresholds to isolate anomalies from natural business noise</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsScanningAnomalies(true);
                        setTimeout(() => {
                          setIsScanningAnomalies(false);
                        }, 1200);
                      }}
                      className="px-4 py-2 text-xs font-bold bg-[#101b44] border border-gray-800 hover:border-emerald-500/40 text-emerald-400 rounded-xl cursor-pointer hover:bg-[#16255d] transition"
                    >
                      {isScanningAnomalies ? 'Scanning metrics...' : 'Trigger Scan'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Anomaly Outlier Threshold Sensitivity (σ value):</span>
                      <span className="font-mono font-bold text-emerald-400">{anomalyThreshold.toFixed(1)} sigma</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="3.5"
                      step="0.1"
                      value={anomalyThreshold}
                      onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detected Anomalies ({anomalyResults.length})</h4>
                    {anomalyResults.map((item) => (
                      <div key={item.id} className="p-4 bg-[#0a0f26]/80 border border-gray-800/50 rounded-2xl flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                              item.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>{item.severity} Severity</span>
                            <span className="font-mono text-[10px] text-gray-500">{item.code}</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-200">{item.title}</h4>
                          <p className="text-xs text-gray-400 font-sans leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 5: ROOT CAUSE ANALYSIS INTERACTIVE */}
            {activeToolId === 'root-cause-analysis' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-400" />
                      Causality Tree & Root Cause Analysis
                    </h3>
                    <p className="text-xs text-gray-400">Select an observed corporate bottleneck vector to trace its causal chain of events</p>
                  </div>

                  <div className="flex gap-2">
                    {[
                      { id: 'margin', label: 'Margin Compression' },
                      { id: 'churn', label: 'Churn Spike' },
                      { id: 'delivery', label: 'Delivery Time Lag' }
                    ].map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue.id)}
                        className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer flex-1 ${
                          selectedIssue === issue.id 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-[#0a0f26]/60 border border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {issue.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 bg-[#0a0f26] border border-gray-800/40 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{getRootCauseFlow().title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{getRootCauseFlow().narrative}</p>
                    </div>

                    <div className="space-y-3.5 pt-3 border-t border-gray-800/40">
                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Causal Contributor Weights</h5>
                      
                      {getRootCauseFlow().nodes.map((node, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-gray-300 font-sans">{node.name}</span>
                            <span className="font-bold text-emerald-400">{node.weight}% contribution</span>
                          </div>
                          <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${node.weight}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 6: REPORT GENERATOR INTERACTIVE */}
            {activeToolId === 'report-generator' && (
              <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Executive Report Compiler
                    </h3>
                    <p className="text-xs text-gray-400">Instantly package current baselines and AI findings into a PDF report</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400">Report Template Model:</label>
                        <select className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300">
                          <option>Executive Performance Overview</option>
                          <option>Operational Bottleneck Audit</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400">Report Language:</label>
                        <select className="w-full bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300">
                          <option>English</option>
                          <option>Hindi</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExportPDF(null)}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#020617] font-bold text-sm rounded-xl cursor-pointer hover:opacity-95 transition flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                    >
                      <Download className="w-4 h-4" />
                      Compile & Download Strategic PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 7: AI ASSISTANT INTERACTIVE CHAT */}
            {activeToolId === 'ai-assistant' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto flex flex-col h-[500px]">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md flex flex-col h-full overflow-hidden">
                  
                  {/* Messages container scrolling */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none mb-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 text-xs font-sans leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-gray-900/80 border border-gray-800 text-gray-200'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAssistantTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3 text-xs text-gray-400 flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Typing metrics overview...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input container footer */}
                  <div className="flex gap-2 pt-4 border-t border-gray-800/40">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask co-pilot, e.g. 'What is our operating margin?'"
                      className="flex-1 bg-[#050917] border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      onClick={handleSendChat}
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#020617] font-bold rounded-xl text-xs flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* TOOL 8+: NEW 13 BUSINESS ANALYSIS MODULES WORKSPACE */}
            {activeToolId && BUSINESS_MODULE_IDS.includes(activeToolId) && (
              <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
                
                {/* 1. Missing Data Handover */}
                {!kpis ? (
                  <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-8 backdrop-blur-md text-center max-w-2xl mx-auto space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">No Active Business Dataset Detected</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        To activate the <span className="text-emerald-400 font-bold">"{FEATURES.find(f => f.id === activeToolId)?.name}"</span> module, AnalytixAI requires transactional, financial, or operational datasets. You can either load our Enterprise Demo portfolio or navigate to the uploader to import your custom CSV dataset.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                      <button
                        onClick={onLoadDemo}
                        className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#020617] font-bold text-xs rounded-xl cursor-pointer hover:opacity-90 transition"
                      >
                        Load Enterprise Demo Data
                      </button>
                      <button
                        onClick={onGoToUpload}
                        className="px-5 py-3 bg-[#0a1128] border border-gray-800 hover:border-emerald-500/30 text-gray-300 font-bold text-xs rounded-xl cursor-pointer transition"
                      >
                        Upload Custom CSV Dataset
                      </button>
                    </div>
                  </div>
                ) : isModuleLoading ? (
                  /* Loading Shimmer State */
                  <div className="bg-[#070b1e]/40 border border-gray-800/40 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Operational Analytics Engine Computing</h4>
                      <p className="text-xs text-gray-400">Synthesizing multidimensional indicators & generating McKinsey-style strategy report...</p>
                    </div>
                  </div>
                ) : moduleError ? (
                  /* Error Alert State */
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
                    <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Compilation of Module Analysis Failed</h4>
                      <p className="text-xs text-gray-400">{moduleError}</p>
                    </div>
                    <button
                      onClick={() => fetchModuleAnalysis(activeToolId)}
                      className="px-4 py-2 bg-gray-900 text-gray-200 border border-gray-800 rounded-xl hover:border-emerald-500/50 text-xs cursor-pointer transition"
                    >
                      Retry Analysis
                    </button>
                  </div>
                ) : moduleAnalysisData ? (
                  /* Active High-Fidelity Dashboard */
                  <div className="space-y-8">
                    
                    {/* Header Banner & Global Action Controls */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#070b1e]/40 border border-gray-800/40 p-6 rounded-3xl backdrop-blur-md">
                      <div className="space-y-1">
                        <div className="text-emerald-400 font-mono text-xs tracking-wider uppercase font-bold flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                          <span>Autonomous Business Advisor Mode</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white">
                          {moduleAnalysisData.title}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400 max-w-2xl font-sans">
                          {moduleAnalysisData.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleExportModulePDF(moduleAnalysisData)}
                          className="px-4 py-2.5 bg-[#0a1128] hover:bg-[#101b44] border border-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-semibold rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export PDF</span>
                        </button>
                        <button
                          onClick={() => handleExportModuleCSV(moduleAnalysisData)}
                          className="px-4 py-2.5 bg-[#0a1128] hover:bg-[#101b44] border border-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-semibold rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Master Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* LEFT SECTIONS COLUMN */}
                      <div className="lg:col-span-7 space-y-8">
                        
                        {/* Interactive Chart Container */}
                        <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Performance Series</h3>
                              <p className="text-[10px] text-gray-400">Interact with different chart types to visualize current operational variables</p>
                            </div>

                            {/* Chart style select pills */}
                            <div className="flex items-center gap-1.5 bg-gray-950/80 p-1 border border-gray-800 rounded-xl">
                              {(['area', 'bar', 'line'] as const).map((style) => (
                                <button
                                  key={style}
                                  onClick={() => setSelectedChartStyle(style)}
                                  className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                                    selectedChartStyle === style
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner'
                                      : 'text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Chart Render Canvas */}
                          <div className="h-[280px] w-full bg-[#030712]/40 p-4 border border-gray-800/40 rounded-2xl relative">
                            {(() => {
                              const chartData = moduleAnalysisData?.chartsData || [];
                              if (chartData.length === 0) {
                                return (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-500 italic">
                                    No numerical series data available for plotting.
                                  </div>
                                );
                              }

                              const keys = Object.keys(chartData[0]);
                              const xKey = keys.find(k => k === 'name' || k === 'label' || k === 'period' || k === 'month' || k === 'date') || keys[0];
                              const numericKeys = keys.filter(k => k !== xKey && typeof chartData[0][k] === 'number');

                              if (numericKeys.length === 0) {
                                return (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-500 italic">
                                    No numeric metrics found in series data.
                                  </div>
                                );
                              }

                              const colors = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#06b6d4'];
                              const chartProps = {
                                data: chartData,
                                margin: { top: 10, right: 10, left: 10, bottom: 10 }
                              };

                              const renderGrid = <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />;
                              const renderXAxis = <XAxis dataKey={xKey} stroke="#4b5563" fontSize={11} tickLine={false} />;
                              const renderYAxis = <YAxis stroke="#4b5563" fontSize={11} tickLine={false} tickFormatter={(v) => typeof v === 'number' ? `$${v.toLocaleString()}` : v} />;
                              const CustomTooltip = ({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#070b1e]/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col gap-2.5 select-none min-w-[180px]">
                                      <p className="text-xs font-bold text-gray-200 tracking-wide border-b border-white/5 pb-1.5">{label}</p>
                                      <div className="space-y-2">
                                        {payload.map((entry: any, index: number) => {
                                          const displayName = entry.name.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                                          const color = entry.color || entry.fill || '#fff';
                                          return (
                                            <div key={index} className="flex items-center justify-between gap-6">
                                              <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: color }} />
                                                <span className="text-xs font-medium text-gray-300 capitalize">{displayName}</span>
                                              </div>
                                              <span className="text-xs font-mono font-bold" style={{ color: color }}>
                                                {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              };

                              const renderTooltip = <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 1 }} />;

                              if (selectedChartStyle === 'bar') {
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart {...chartProps}>
                                      {renderGrid}
                                      {renderXAxis}
                                      {renderYAxis}
                                      {renderTooltip}
                                      <Legend formatter={(value) => <span className="text-xs font-semibold text-gray-300 capitalize">{value.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</span>} iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '10px' }} />
                                      {numericKeys.map((key, idx) => (
                                        <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
                                      ))}
                                    </BarChart>
                                  </ResponsiveContainer>
                                );
                              }

                              if (selectedChartStyle === 'line') {
                                return (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart {...chartProps}>
                                      {renderGrid}
                                      {renderXAxis}
                                      {renderYAxis}
                                      {renderTooltip}
                                      <Legend formatter={(value) => <span className="text-xs font-semibold text-gray-300 capitalize">{value.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</span>} iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '10px' }} />
                                      {numericKeys.map((key, idx) => (
                                        <Line key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} strokeWidth={2.5} activeDot={{ r: 6 }} />
                                      ))}
                                    </LineChart>
                                  </ResponsiveContainer>
                                );
                              }

                              return (
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart {...chartProps}>
                                    <defs>
                                      {numericKeys.map((key, idx) => (
                                        <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0}/>
                                        </linearGradient>
                                      ))}
                                    </defs>
                                    {renderGrid}
                                    {renderXAxis}
                                    {renderYAxis}
                                    {renderTooltip}
                                    <Legend formatter={(value) => <span className="text-xs font-semibold text-gray-300 capitalize">{value.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}</span>} iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '10px' }} />
                                    {numericKeys.map((key, idx) => (
                                      <Area key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} fillOpacity={1} fill={`url(#grad-${key})`} strokeWidth={2.5} />
                                    ))}
                                  </AreaChart>
                                </ResponsiveContainer>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Structured Turnaround Actions */}
                        <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended Strategic Actions</h3>
                            <p className="text-[10px] text-gray-400">Structured tactical recommendations tailored specifically to your active metrics</p>
                          </div>

                          <div className="space-y-4">
                            {moduleAnalysisData.recommendedActions?.map((act: any, idx: number) => (
                              <div key={idx} className="p-4 bg-[#0a0f26]/80 border border-gray-800/50 rounded-2xl space-y-2.5">
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="font-bold text-sm text-gray-200">
                                    {act.action}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                                    act.impact === 'High Impact'
                                      ? 'bg-[#10b981]/10 text-emerald-400 border-emerald-500/20'
                                      : act.impact === 'Medium Impact'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                  }`}>
                                    {act.impact}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-400 bg-gray-950/20 p-2 rounded-lg">
                                  <div><span className="text-gray-500">Target Segment:</span> {act.target}</div>
                                  <div><span className="text-gray-500">Execution Timeline:</span> Real-time dynamic</div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed pl-1">
                                  <span className="text-emerald-400/80 font-bold font-mono">Strategic Rationale:</span> {act.rationale}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* RIGHT COLUMN */}
                      <div className="lg:col-span-5 space-y-8">
                        
                        {/* Executive Summary Card (McKinsey Style) */}
                        <div className="bg-gradient-to-b from-[#0a1128] to-[#070b1e] border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden space-y-4 shadow-[0_4px_30px_rgba(16,185,129,0.03)]">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                          <div className="flex items-center justify-between border-b border-gray-800/40 pb-2">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Executive Diagnostic Summary</span>
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                            "{moduleAnalysisData.summary}"
                          </p>
                        </div>

                        {/* AI-Generated Findings List */}
                        <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6">
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Core Analytical Findings</h3>
                            <p className="text-[10px] text-gray-400">Automated micro-insights extracted by analyzing the dataset schema values</p>
                          </div>

                          <div className="space-y-3">
                            {moduleAnalysisData.insights?.map((ins: any, idx: number) => {
                              const isNegative = ins.badge?.toLowerCase().includes('risk') || 
                                                 ins.badge?.toLowerCase().includes('caution') || 
                                                 ins.badge?.toLowerCase().includes('dip') || 
                                                 ins.badge?.toLowerCase().includes('drop') || 
                                                 ins.badge?.toLowerCase().includes('overrun');
                              return (
                                <div key={idx} className="p-4 bg-[#0a0f26]/80 border border-gray-800/50 rounded-2xl flex items-start gap-4">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${
                                        isNegative 
                                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      }`}>
                                        {ins.badge || 'KPI Segment'}
                                      </span>
                                      {ins.value && (
                                        <span className="font-mono text-xs font-bold text-white">{ins.value}</span>
                                      )}
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-200">{ins.title}</h4>
                                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{ins.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dedicated Conversational Chat Assistant Widget */}
                        <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md flex flex-col h-[380px] overflow-hidden space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-800/40 shrink-0">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Module Co-Pilot Advisor</h4>
                              <p className="text-[9px] text-gray-500">Ask questions about these findings to unlock strategic solutions</p>
                            </div>
                          </div>

                          {/* Chat history stream */}
                          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                            {moduleChatMessages.map((msg, idx) => (
                              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-[11px] font-sans leading-relaxed ${
                                  msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-gray-900/80 border border-gray-800 text-gray-200'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                            {isModuleChatTyping && (
                              <div className="flex justify-start">
                                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-2.5 text-[11px] text-gray-400 flex items-center gap-1.5">
                                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                                  <span>Computing indicators...</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Message input container */}
                          <div className="flex gap-2 pt-2 border-t border-gray-800/40 shrink-0">
                            <input
                              type="text"
                              value={moduleChatInput}
                              onChange={(e) => setModuleChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendModuleChat()}
                              placeholder="Ask Advisor..."
                              className="flex-1 bg-[#050917] border border-gray-800 rounded-xl px-3 py-2 text-[11px] text-gray-200 focus:outline-none focus:border-emerald-500/50"
                            />
                            <button
                              onClick={handleSendModuleChat}
                              className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#020617] font-bold rounded-xl flex items-center justify-center hover:opacity-90 cursor-pointer transition shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                ) : null}

              </div>
            )}

            {/* BETA TOOLS PLAYGROUND */}
            {(activeToolId === 'inventory-optimizer' || activeToolId === 'cost-optimizer' || activeToolId === 'customer-intelligence') && (
              <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
                <div className="bg-[#070b1e]/60 border border-gray-800/60 rounded-3xl p-6 backdrop-blur-md space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Beta Workspace Explorer</h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      This Neural optimization module is currently running compilation metrics inside our Beta registry pipeline. Fully live endpoints will trigger on the next system updates!
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
