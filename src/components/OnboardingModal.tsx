import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Globe, DollarSign, Calendar, Landmark, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingModalProps {
  user: any;
  onComplete: (updatedUser: any) => void;
}

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
  const [businessName, setBusinessName] = useState(user?.user_metadata?.business_name || '');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('United States');
  const [currency, setCurrency] = useState('USD');
  const [fyStartMonth, setFyStartMonth] = useState('January');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !industry) {
      setError('Please provide your business name and industry vertical.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const onboardingData = {
      business_name: businessName,
      industry,
      country,
      currency,
      fy_start_month: fyStartMonth,
      is_onboarded: true,
    };

    try {
      const { data, error: updateErr } = await supabase.auth.updateUser({
        data: onboardingData,
      });

      if (updateErr) {
        setError(updateErr.message);
      } else {
        // Success
        const updatedUser = data?.user || {
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...onboardingData,
          }
        };
        onComplete(updatedUser);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to persist organization parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#02040a]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="w-full sm:max-w-lg bg-[#0B1220] border-t sm:border border-white/10 p-6 md:p-8 rounded-t-[2.5rem] sm:rounded-3xl space-y-6 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-y-auto max-h-[92vh] sm:max-h-none"
      >
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="text-center space-y-2 relative z-10">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white">Welcome to AnalytixAI</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Let's personalize your workspace settings to customize your financial algorithms.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
              Business Name *
            </label>
            <div className="relative">
              <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Industry Vertical */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
              Industry Vertical *
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. SaaS, Fintech, E-commerce"
                className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Country & Currency Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-3 text-xs text-white focus:outline-none transition cursor-pointer appearance-none"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                Currency
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-3 text-xs text-white focus:outline-none transition cursor-pointer appearance-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="SGD">SGD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* FY Start Month */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
              Financial Year Start Month
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={fyStartMonth}
                onChange={(e) => setFyStartMonth(e.target.value)}
                className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-3 text-xs text-white focus:outline-none transition cursor-pointer appearance-none"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Configuring Workspace...</span>
              </>
            ) : (
              <span>Save & Continue to Dashboard</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
