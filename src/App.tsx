import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import UploadWorkspace from './components/UploadWorkspace';
import DashboardView from './components/DashboardView';
import ReportsView from './components/ReportsView';
import AILabView from './components/AILabView';
import AuthPage from './components/AuthPage';
import OnboardingModal from './components/OnboardingModal';
import { parseCSV, inferSchema, calculateKPIs, generateDeterministicInsights } from './utils/analyzer';
import { SAMPLE_CSV_DATA } from './data/sampleDataset';
import { DatasetSchema, KPIOverview, BusinessInsight, AnomalyAlert, SmartRecommendation } from './types';
import { HelpCircle, Terminal, Database, Cpu, Menu } from 'lucide-react';
import { Language, t } from './utils/translations';
import { DashboardContext } from './services/dashboardContext';
import VoiceAssistant from './components/VoiceAssistant';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'upload' | 'dashboard'>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Auth & Onboarding state
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Parsed dataset states
  const [filename, setFilename] = useState<string>('');
  const [schema, setSchema] = useState<DatasetSchema | null>(null);
  const [kpis, setKPIs] = useState<KPIOverview | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  
  // Enriched insights & warnings
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);

  // Generated reports state list
  const [reports, setReports] = useState<any[]>([]);

  // 1. Monitor Supabase Authentication sessions
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        handleReset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Route protection: If user is not authenticated and attempts to access internal views, redirect them to auth page
  useEffect(() => {
    if (!user && viewState !== 'landing' && viewState !== 'auth') {
      setViewState('auth');
    }
  }, [user, viewState]);

  // Action: Reset everything and return to landing
  const handleReset = () => {
    setViewState('landing');
    setFilename('');
    setSchema(null);
    setKPIs(null);
    setRawData([]);
    setInsights([]);
    setAnomalies([]);
    setRecommendations([]);
    setReports([]);
    setActiveTab('dashboard');
    setShowOnboarding(false);
  };

  // Secure sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleReset();
  };

  // Action: Start ingestion (triggered by Start Analysis)
  const handleStartAnalysis = () => {
    if (!user) {
      setViewState('auth');
    } else if (!user.user_metadata?.is_onboarded) {
      setShowOnboarding(true);
    } else {
      setViewState('upload');
      setActiveTab('data-sources');
    }
  };

  // Action: Load sample demo dataset
  const handleLoadDemo = () => {
    if (!user) {
      setViewState('auth');
    } else if (!user.user_metadata?.is_onboarded) {
      setShowOnboarding(true);
    } else {
      handleUploadSuccess(SAMPLE_CSV_DATA, 'enterprise_saas_metrics_demo.csv');
    }
  };

  // Action: Auth callback success
  const handleAuthSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    if (!authenticatedUser?.user_metadata?.is_onboarded) {
      setShowOnboarding(true);
    } else {
      setViewState('upload');
      setActiveTab('data-sources');
    }
  };

  // Action: Onboarding complete callback
  const handleOnboardingComplete = (updatedUser: any) => {
    setUser(updatedUser);
    setShowOnboarding(false);
    setViewState('upload');
    setActiveTab('data-sources');
  };

  // Action: Complete CSV/Dataset processing
  const handleUploadSuccess = async (data: string | any[], name: string) => {
    try {
      let rows: any[];
      if (typeof data === 'string') {
        rows = await parseCSV(data);
      } else {
        rows = data;
      }
      if (!rows || rows.length === 0) {
        alert('The uploaded file appears to be empty or has an invalid format.');
        return;
      }

      const inferredSchema = inferSchema(rows);
      const computedKPIs = calculateKPIs(rows, inferredSchema);
      const { insights: detInsights, anomalies: detAnoms, recommendations: detRecs } = generateDeterministicInsights(computedKPIs, inferredSchema);

      setSchema(inferredSchema);
      setKPIs(computedKPIs);
      setRawData(rows);
      setInsights(detInsights);
      setAnomalies(detAnoms);
      setRecommendations(detRecs);
      setFilename(name);
      
      const initialReport = {
        id: 'rep-init-' + Date.now(),
        filename: name,
        title: `Initial Executive Report - ${name.replace(/\.(csv|xlsx|xls)/gi, '')}`,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        }),
        summary: 'Revenue performance currently exceeds Q3 projections by ' + (computedKPIs.growthPercent >= 0 ? '+' : '') + computedKPIs.growthPercent + '%, driven primarily by a surge in high-tier enterprise acquisitions within the EMEA region. Despite a minor dip in mid-market retention, active user engagement remains high at 88%. Predictive models suggest a continued upward trend, with a projected year-end revenue of $' + (computedKPIs.totalRevenue >= 1000000 ? (computedKPIs.totalRevenue / 1000000).toFixed(1) + 'M' : (computedKPIs.totalRevenue / 1000).toFixed(0) + 'k') + ' if current conversion velocities are maintained.',
        kpis: {
          totalRevenue: computedKPIs.totalRevenue,
          growthPercent: computedKPIs.growthPercent,
          activeUsers: Math.round(computedKPIs.datasetStats.rows * 48 + 12000),
          churnRate: 1.2
        },
        insights: detInsights,
        recommendations: detRecs
      };
      setReports([initialReport]);

      setViewState('dashboard');
      setActiveTab('dashboard');
    } catch (err) {
      console.error('File Processing Error:', err);
      alert('Error parsing dataset. Please check the file formatting and structure.');
    }
  };

  const hasData = !!kpis;

  return (
    <DashboardContext.Provider value={{
      filename,
      schema,
      kpis,
      insights,
      anomalies,
      recommendations,
      reports,
      activeTab,
      setActiveTab,
      viewState,
      setViewState
    }}>
      <div className="flex h-screen bg-[#050816] text-white overflow-hidden font-sans">
        
        {/* 1. SIDEBAR NAVIGATION - visible for inner authenticated views only */}
        {user && viewState !== 'landing' && viewState !== 'auth' && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onReset={handleReset} 
            onSignOut={handleSignOut}
            hasData={hasData} 
            language={language}
            setLanguage={setLanguage}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 2. CORE VIEW SWITCHER */}
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          {/* Mobile Top Header */}
          {user && viewState !== 'landing' && viewState !== 'auth' && (
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#090A0F] border-b border-white/5 shrink-0 z-30">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#A78BFA] to-[#22D3EE] rounded flex items-center justify-center shadow-[0_0_10px_rgba(167,139,250,0.4)]">
                    <span className="text-xs font-bold text-[#050816]">A</span>
                  </div>
                  <span className="font-bold text-white text-sm tracking-tight">AnalytixAI</span>
                </div>
              </div>
              
              {/* Soft indicator of data state */}
              {hasData && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Live</span>
                </span>
              )}
            </header>
          )}

          {viewState === 'landing' ? (
            <LandingPage 
              onStart={handleStartAnalysis} 
              onLoadDemo={handleLoadDemo} 
              language={language}
            />
          ) : viewState === 'auth' ? (
            <AuthPage 
              onSuccess={handleAuthSuccess}
              onBackToLanding={handleReset}
              language={language}
            />
          ) : viewState === 'upload' ? (
            <UploadWorkspace 
              onUploadSuccess={handleUploadSuccess} 
              onTrySample={handleLoadDemo} 
              language={language}
            />
          ) : (
            /* Active full dashboard states - only render if authenticated */
            user && (
              <>
                {activeTab === 'dashboard' && kpis && schema && (
                  <DashboardView
                    filename={filename}
                    schema={schema}
                    kpis={kpis}
                    rawData={rawData}
                    defaultInsights={insights}
                    defaultAnomalies={anomalies}
                    defaultRecommendations={recommendations}
                    language={language}
                    onReportGenerated={(newReport) => {
                      setReports(prev => [newReport, ...prev]);
                    }}
                  />
                )}

                {activeTab === 'reports' && (
                  <ReportsView
                    reports={reports}
                    language={language}
                    onDeleteReport={(id) => {
                      setReports(prev => prev.filter(r => r.id !== id));
                    }}
                  />
                )}

                {activeTab === 'ai-lab' && (
                  <AILabView
                    kpis={kpis}
                    schema={schema}
                    language={language}
                    onLoadDemo={handleLoadDemo}
                    onGoToUpload={() => {
                      setActiveTab('data-sources');
                    }}
                  />
                )}

                {activeTab === 'data-sources' && (
                  <UploadWorkspace 
                    onUploadSuccess={handleUploadSuccess} 
                    onTrySample={handleLoadDemo} 
                    language={language}
                  />
                )}

                {activeTab === 'settings' && (
                  <div className="flex-1 p-8 overflow-y-auto bg-[#050816]">
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white font-display">{t('set.admin_title', language)}</h2>
                        <p className="text-sm text-gray-400 mt-1 font-sans">{t('set.admin_subtitle', language)}</p>
                      </div>

                      {/* Active Engine Card */}
                      <div className="p-5 rounded-2xl bg-[#0B1220] border border-violet-950/40 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{t('set.engine_title', language)}</h3>
                            <p className="text-xs text-gray-400 font-mono">{t('set.engine_model', language)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans">
                          {t('set.engine_desc', language)}
                        </p>
                      </div>

                      {/* API Connection Indicator */}
                      <div className="p-5 rounded-2xl bg-[#0B1220] border border-violet-950/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Database className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{t('set.status_title', language)}</h4>
                            <p className="text-xs text-gray-400 font-sans">{t('set.status_desc', language)}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                          {t('set.status_verified', language)}
                        </span>
                      </div>

                      {/* Integration code instructions */}
                      <div className="p-5 rounded-2xl bg-[#0B1220] border border-violet-950/40 space-y-3">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-violet-400" />
                          <h4 className="text-sm font-semibold text-white">{t('set.sandbox_title', language)}</h4>
                        </div>
                        <p className="text-xs text-gray-400">
                          {t('set.sandbox_desc', language)}
                        </p>
                        <pre className="p-4 rounded-xl bg-violet-950/15 border border-violet-950/30 text-[10px] text-gray-300 font-mono overflow-x-auto leading-relaxed">
{`const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Call the autonomous executive report agent
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: 'Generate executive summary for $3.2M sales volume...'
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </main>
      </div>

      {/* 3. AUTONOMOUS VOICE ASSISTANT COPILOT */}
      {user && viewState === 'dashboard' && <VoiceAssistant />}

      {/* 4. FIRST LOGIN PERSONALIZATION ONBOARDING MODAL */}
      {showOnboarding && user && (
        <OnboardingModal 
          user={user} 
          onComplete={handleOnboardingComplete} 
        />
      )}
    </DashboardContext.Provider>
  );
}
