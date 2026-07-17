import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Zap, 
  BarChart3, 
  MessageSquareCode 
} from 'lucide-react';
import { Language, t } from '../utils/translations';

interface LandingPageProps {
  onStart: () => void;
  onLoadDemo: () => void;
  language: Language;
}

export default function LandingPage({ onStart, onLoadDemo, language }: LandingPageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#050816] relative">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* COOL BACKGROUND ANIMATED CHARTS (pointer-events-none to prevent interception) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        
        {/* Full-Screen Tech Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        {/* --- SECTION A: IMMERSIVE FULL-WIDTH FLOWING TREND LINES --- */}
        {/* Layered Flowing Wave 1 (Upper & Mid Left-to-Right Sweep) */}
        <div className="absolute inset-x-0 top-[10%] h-[35%] opacity-40">
          <svg className="w-full h-full text-violet-400" viewBox="0 0 1440 250" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="stroke-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="30%" stopColor="#EC4899" />
                <stop offset="70%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, ease: 'easeInOut' }}
              d="M 0 120 Q 180 40, 360 160 T 720 80 T 1080 190 T 1440 60"
              fill="none"
              stroke="url(#stroke-grad-1)"
              strokeWidth="2.5"
            />
            <path
              d="M 0 120 Q 180 40, 360 160 T 720 80 T 1080 190 T 1440 60 L 1440 250 L 0 250 Z"
              fill="url(#wave-grad-1)"
            />
          </svg>
          {/* Glowing particle tracing Wave 1 */}
          <motion.div
            animate={{
              left: ['0%', '100%'],
              top: ['48%', '16%', '64%', '32%', '76%', '24%']
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute w-3.5 h-3.5 rounded-full bg-pink-400 shadow-[0_0_15px_#F472B6,0_0_5px_#fff] -ml-1.5 -mt-1.5"
          />
        </div>

        {/* Layered Flowing Wave 2 (Lower Mid Sweep with High-Contrast Cyan/Emerald) */}
        <div className="absolute inset-x-0 bottom-[15%] h-[30%] opacity-35">
          <svg className="w-full h-full text-cyan-400" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="stroke-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="40%" stopColor="#34D399" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 6, delay: 0.5, ease: 'easeInOut' }}
              d="M 0 150 Q 240 60, 480 120 T 960 50 T 1440 130"
              fill="none"
              stroke="url(#stroke-grad-2)"
              strokeWidth="2"
            />
            <path
              d="M 0 150 Q 240 60, 480 120 T 960 50 T 1440 130 L 1440 200 L 0 200 Z"
              fill="url(#wave-grad-2)"
            />
          </svg>
          {/* Tracing spark particle on Wave 2 */}
          <motion.div
            animate={{
              left: ['100%', '0%'],
              top: ['65%', '25%', '60%', '25%', '65%']
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22D3EE,0_0_4px_#fff] -ml-1.5 -mt-1.5"
          />
        </div>

        {/* --- SECTION B: FLOATING BENTO-CHART ELEMENTS COVERING THE CONTAINER --- */}
        
        {/* TOP-LEFT: Floating Line Chart & Stats Bubble */}
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[4%] top-[12%] w-[260px] md:w-[320px] bg-[#0B1220]/45 border border-white/5 p-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-[2px] opacity-40 sm:block hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono tracking-wider text-pink-400 uppercase font-bold">Dynamic Revenue Peak</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">+28.4%</span>
          </div>
          <div className="h-[60px] w-full flex items-end gap-1.5">
            {[40, 55, 48, 70, 62, 85, 90, 75, 95, 110].map((h, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-t-sm h-full flex items-end">
                <motion.div 
                  animate={{ height: [`${h * 0.4}%`, `${h * 0.9}%`, `${h * 0.5}%`, `${h * 0.4}%`] }}
                  transition={{ duration: 4 + (i % 2), repeat: Infinity }}
                  className="w-full bg-gradient-to-t from-violet-600/30 to-pink-500/50 rounded-t-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* TOP-RIGHT: Dynamic Donut/Gauge Hub */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[5%] top-[14%] w-[160px] bg-[#0B1220]/40 border border-white/5 p-3.5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-[2px] opacity-45 lg:block hidden"
        >
          <div className="relative w-[90px] h-[90px] mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="6" />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="38" 
                fill="none" 
                stroke="url(#donut-grad)" 
                strokeWidth="7" 
                strokeDasharray="238.6" 
                animate={{ strokeDashoffset: [200, 40, 140, 200] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono tracking-widest text-pink-400 uppercase font-bold">Accuracy</span>
              <span className="text-xs font-extrabold text-white font-display">98.2%</span>
            </div>
          </div>
          <div className="mt-2 text-center text-[9px] font-mono text-gray-400">Autonomous Core active</div>
        </motion.div>

        {/* MID-RIGHT: High-Contrast Realtime Bar pillars */}
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[4%] top-[45%] w-[220px] bg-[#0B1220]/45 border border-white/5 p-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-[2px] opacity-40 md:block hidden"
        >
          <div className="text-[9px] font-mono tracking-wider text-cyan-400 uppercase font-bold mb-2">Realtime Query Load</div>
          <div className="space-y-2">
            {[75, 45, 90].map((w, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[8px] font-mono text-gray-400">
                  <span>Thread #{idx+1}</span>
                  <span>{w}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: [`20%`, `${w}%`, `35%`, `20%`] }}
                    transition={{ duration: 5 + idx, repeat: Infinity, ease: 'easeInOut' }}
                    className={`h-full bg-gradient-to-r ${idx === 0 ? 'from-cyan-500 to-emerald-400' : idx === 1 ? 'from-pink-500 to-violet-500' : 'from-amber-400 to-rose-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM-LEFT: High-Performance Network Constellation with halos */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 8, 0],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          className="absolute left-[4%] bottom-[12%] bg-[#0B1220]/40 border border-white/5 p-4 rounded-3xl backdrop-blur-[1px] opacity-45 hidden lg:block"
        >
          <div className="text-[9px] font-mono tracking-wider text-violet-400 uppercase font-bold mb-1">Decentralized Nodes</div>
          <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
            {/* Connection Lines */}
            <line x1="30" y1="30" x2="100" y2="80" stroke="#F472B6" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="100" y1="80" x2="170" y2="40" stroke="#22D3EE" strokeWidth="1.2" />
            <line x1="100" y1="80" x2="130" y2="120" stroke="#A78BFA" strokeWidth="1.2" />
            <line x1="30" y1="30" x2="130" y2="120" stroke="#818CF8" strokeWidth="0.8" />

            {/* Nodes */}
            <circle cx="30" cy="30" r="5" fill="#F472B6" className="animate-pulse" />
            <circle cx="100" cy="80" r="6" fill="#A78BFA" />
            <circle cx="170" cy="40" r="4.5" fill="#22D3EE" />
            <circle cx="130" cy="120" r="5.5" fill="#818CF8" />

            {/* Glowing halos */}
            <circle cx="100" cy="80" r="14" stroke="#A78BFA" strokeOpacity="0.4" strokeWidth="1" />
            <circle cx="30" cy="30" r="11" stroke="#F472B6" strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="170" cy="40" r="9" stroke="#22D3EE" strokeOpacity="0.3" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* BOTTOM-RIGHT: Massive Immersive Stacked Area/Bar Chart */}
        <motion.div
          animate={{ 
            opacity: [0.35, 0.55, 0.35],
            y: [15, 0, 15],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            repeatType: 'reverse', 
            ease: 'easeInOut' 
          }}
          className="absolute right-[4%] bottom-[8%] w-[260px] md:w-[350px] h-[160px] bg-[#0B1220]/45 border border-white/5 p-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-[2px] hidden md:block"
        >
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-mono tracking-wider text-amber-400 uppercase font-bold">Predictive Projections</span>
            <span className="text-[9px] font-mono text-gray-400">Q3 - Q4 Trend</span>
          </div>
          <div className="flex items-end justify-between h-[100px] w-full gap-2.5 px-1">
            {[45, 80, 55, 95, 68, 88, 50, 100, 75, 110].map((maxHeight, index) => {
              const barGradientClass = index % 3 === 0 
                ? 'from-cyan-500/40 to-emerald-400/50 border-cyan-300/60 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                : index % 3 === 1
                ? 'from-pink-500/40 to-violet-500/50 border-pink-300/60 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
                : 'from-amber-400/40 to-rose-500/50 border-amber-300/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]';

              return (
                <div key={index} className="flex-1 rounded-t-md relative h-full flex items-end">
                  <motion.div 
                    animate={{ height: [`${maxHeight * 0.35}%`, `${maxHeight}%`, `${maxHeight * 0.65}%`, `${maxHeight * 0.35}%`] }}
                    transition={{
                      duration: 3 + (index % 3),
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`w-full bg-gradient-to-t ${barGradientClass} border-t rounded-t-md`}
                  />
                </div>
              );
            })}
          </div>
          {/* Base Axis Line */}
          <div className="w-full h-[1.5px] bg-cyan-400/30 mt-2 shadow-[0_1px_5px_rgba(34,211,238,0.2)]" />
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center justify-center min-h-[90vh]">
        


        {/* Hero Headlines */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            {t('landing.title_1', language)}{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-purple-300 to-[#22D3EE] bg-clip-text text-transparent">
              {t('landing.title_2', language)}
            </span>{' '}
            {t('landing.title_3', language)}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed mb-10">
            {t('landing.subtitle', language)}
          </p>
        </motion.div>

        {/* CTA Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-20 z-20"
        >
          <button
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-[#22D3EE] text-[#050816] font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] flex items-center gap-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <span>{t('landing.start_analysis', language)}</span>
            <ArrowRight className="w-5 h-5 text-[#050816]" />
          </button>

          <button
            onClick={onLoadDemo}
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-base transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <span>{t('landing.view_demo', language)}</span>
          </button>
        </motion.div>

        {/* Interactive Dashboard Preview Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-5xl rounded-2xl glass-panel-accent glow-cyan border border-cyan-500/20 p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          
          {/* Header Row Mock */}
          <div className="flex items-center justify-between border-b border-violet-950/40 pb-5 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-gray-500 font-mono ml-3">analytixai_core_vm_live.config</span>
            </div>
            <div className="px-3 py-1 rounded bg-violet-500/10 border border-violet-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-violet-300 font-mono tracking-wide">SYSTEM READY</span>
            </div>
          </div>

          {/* Grid Preview Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-85">
            
            {/* Left Mock Panel */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B1220] border border-violet-950/50">
                <div className="text-[10px] text-gray-500 font-mono">TOTAL REVENUE</div>
                <div className="text-2xl font-bold font-display text-white mt-1">$3,184,200</div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                  <span>+14.2% Growth</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B1220] border border-violet-950/50">
                <div className="text-[10px] text-gray-500 font-mono">ACTIVE USERS</div>
                <div className="text-2xl font-bold font-display text-white mt-1">84.2k</div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                  <span>+5.8% Growth</span>
                </div>
              </div>
            </div>

            {/* Center Trend Mock */}
            <div className="p-4 rounded-xl bg-[#0B1220] border border-violet-950/50 flex flex-col justify-between md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">REVENUE TRENDS</div>
                  <div className="text-sm text-gray-300 font-sans font-medium mt-0.5">Forecasted vs Actual</div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-300 font-mono">ACTUAL</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-300 font-mono">FORECAST</span>
                </div>
              </div>
              
              {/* Dummy stylized trend line SVG */}
              <div className="h-28 w-full flex items-end">
                <svg className="w-full h-full text-violet-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path 
                    d="M 0 25 C 20 18, 40 30, 60 10 C 80 -10, 100 15, 100 5 L 100 30 L 0 30 Z" 
                    fill="url(#grad)" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 w-full">
          {[
            {
              icon: Zap,
              title: t('landing.feature_dash_title', language),
              desc: t('landing.feature_dash_desc', language)
            },
            {
              icon: MessageSquareCode,
              title: t('landing.feature_chat_title', language),
              desc: t('landing.feature_chat_desc', language)
            },
            {
              icon: Cpu,
              title: t('landing.feature_root_title_highlight', language),
              desc: t('landing.feature_root_desc_highlight', language)
            },
            {
              icon: Shield,
              title: t('landing.feature_anomaly_title', language),
              desc: t('landing.feature_anomaly_desc', language)
            }
          ].map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-5 rounded-2xl bg-[#0B1220]/50 border border-white/5 hover:border-white/10 transition-all text-center md:text-left hover:bg-[#0B1220] duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <Icon className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h3 className="text-white font-medium text-base mb-2 font-display">{feat.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed font-sans">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
