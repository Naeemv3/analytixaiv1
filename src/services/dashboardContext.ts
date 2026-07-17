import { createContext, useContext } from 'react';
import { DatasetSchema, KPIOverview, BusinessInsight, AnomalyAlert, SmartRecommendation } from '../types';

export interface DashboardContextProps {
  filename: string;
  schema: DatasetSchema | null;
  kpis: KPIOverview | null;
  insights: BusinessInsight[];
  anomalies: AnomalyAlert[];
  recommendations: SmartRecommendation[];
  reports: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewState: 'landing' | 'upload' | 'dashboard';
  setViewState: (state: 'landing' | 'upload' | 'dashboard') => void;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
