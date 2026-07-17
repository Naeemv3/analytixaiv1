import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  Compass, 
  Settings, 
  TrendingUp, 
  User, 
  HelpCircle, 
  LogOut,
  Globe,
  X
} from 'lucide-react';
import { Language, t } from '../utils/translations';
import ProfileModal from './ProfileModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReset: () => void;
  onSignOut?: () => void;
  hasData: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onReset, onSignOut, hasData, language, setLanguage, isOpen, onClose }: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const menuItems = [
    { id: 'data-sources', label: t('nav.data-sources', language), icon: Database, enabled: true },
    { id: 'dashboard', label: t('nav.dashboard', language), icon: LayoutDashboard, enabled: hasData },
    { id: 'reports', label: t('nav.reports', language), icon: FileText, enabled: hasData },
    { id: 'ai-lab', label: t('nav.ai-lab', language), icon: Compass, enabled: hasData },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity duration-300" 
        />
      )}

      {/* Main Sidebar (Responsive: Fixed Drawer on Mobile, Static Panel on Desktop) */}
      <aside 
        className={`bg-[#090A0F] border-r border-white/5 p-5 flex flex-col h-full shrink-0 select-none transition-transform duration-300 z-50
          fixed inset-y-0 left-0 w-64 md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close Button - Mobile Only */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/0 hover:border-white/5 text-gray-400 hover:text-white transition duration-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => { onReset(); if (onClose) onClose(); }}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#A78BFA] to-[#22D3EE] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(167,139,250,0.4)]">
            <TrendingUp className="w-4 h-4 text-[#050816]" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-white tracking-tight text-md leading-tight">AnalytixAI</h1>
            <p className="text-[9px] text-[#A78BFA] font-mono tracking-widest uppercase font-bold mt-0.5">{t('sidebar.intelligence_hub', language)}</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDisabled = !item.enabled;
            
            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] font-semibold'
                    : isDisabled
                      ? 'text-white/20 cursor-not-allowed opacity-40'
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'dashboard' && hasData && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Workspace Settings / User Section */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          {/* Language Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 text-white/40 text-[10px] font-mono tracking-wider uppercase font-bold">
              <Globe className="w-3.5 h-3.5 text-white/30" />
              <span>{t('sidebar.select_language', language)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              <button
                onClick={() => setLanguage('en')}
                className={`py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                  language === 'hi'
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                  language === 'te'
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="space-y-1">
            <button 
              onClick={() => {
                setIsProfileOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-white/40 hover:text-[#A78BFA] transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-white/30" />
              <span>Profile</span>
            </button>
            
            <button 
              onClick={() => {
                if (onSignOut) onSignOut();
                else onReset();
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-white/40 hover:text-[#F43F5E] transition-all"
            >
              <LogOut className="w-4 h-4 text-white/30" />
              <span>{t('sidebar.sign_out', language)}</span>
            </button>
          </div>
        </div>
        
      </aside>
      
      <ProfileModal isOpen={isProfileOpen} onClose={() => { setIsProfileOpen(false); if (onClose) onClose(); }} />
    </>
  );
}
