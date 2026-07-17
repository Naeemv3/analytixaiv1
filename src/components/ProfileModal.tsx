import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, User, Mail, Building, Briefcase, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  // Backup values to revert to on Cancel
  const [backupFields, setBackupFields] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch initial profile
  const fetchProfile = async () => {
    setIsLoadingUser(true);
    setErrorMsg(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      
      if (currentUser) {
        setUser(currentUser);
        
        // Try to fetch from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        let initialName = '';
        let initialCompany = '';
        let initialRole = 'Executive';
        let initialEmail = currentUser.email || '';

        if (profileData && !profileError) {
          initialName = profileData.full_name || currentUser.user_metadata?.full_name || '';
          initialCompany = profileData.company || currentUser.user_metadata?.business_name || '';
          initialRole = profileData.role || currentUser.user_metadata?.role || 'Executive';
        } else {
          initialName = currentUser.user_metadata?.full_name || '';
          initialCompany = currentUser.user_metadata?.business_name || '';
          initialRole = currentUser.user_metadata?.role || 'Executive';
        }

        const fields = {
          fullName: initialName,
          email: initialEmail,
          company: initialCompany,
          role: initialRole,
        };

        setFullName(fields.fullName);
        setEmail(fields.email);
        setCompany(fields.company);
        setRole(fields.role);
        setBackupFields(fields);
      }
    } catch (err: any) {
      console.error('Failed to load profile', err);
      setErrorMsg('Failed to load user profile information.');
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      setIsEditing(false);
    }
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Extract initials
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleCancel = () => {
    // Revert changes
    setFullName(backupFields.fullName);
    setEmail(backupFields.email);
    setCompany(backupFields.company);
    setRole(backupFields.role);
    setIsEditing(false);
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Full name and email address are required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      if (!user) throw new Error('No user session detected.');

      // 1. Update the Supabase profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          company: company,
          role: role,
          email: email
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // 2. Synchronize user metadata via auth so current application state automatically updates
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          business_name: company,
          role: role,
        }
      });

      if (authError) throw authError;

      // Update backup on success
      const updatedFields = { fullName, email, company, role };
      setBackupFields(updatedFields);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile save error:', err);
      setErrorMsg(err.message || 'An error occurred while saving your changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[8px] transition-all duration-300 animate-fade-in"
    >
      <div 
        ref={modalRef}
        className="w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-3xl overflow-y-auto max-h-[92vh] sm:max-h-none relative transition-all duration-300"
        style={{
          background: 'rgba(20, 20, 30, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), 0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Decorative Top Accent with subtle blur glow beneath it */}
        <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 relative shadow-[0_2px_12px_rgba(139,92,246,0.3)]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/0 hover:border-white/5 text-gray-400 hover:text-white transition duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          {/* Header section with initials avatar */}
          <div className="flex items-center gap-5 border-b border-white/[0.06] pb-6">
            <div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold uppercase select-none shrink-0"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.35)'
              }}
            >
              {isLoadingUser ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/75" />
              ) : (
                getInitials(fullName)
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white tracking-tight truncate">
                {fullName || 'Loading Profile...'}
              </h3>
              <p className="text-xs text-violet-300 font-mono tracking-widest uppercase mt-0.5">
                {role || 'Executive Member'}
              </p>
            </div>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-sans leading-relaxed">
              {errorMsg}
            </div>
          )}

          {isLoadingUser ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              <p className="text-xs text-gray-400 font-mono">Loading profile securely...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Full name input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2 pl-0.5 font-semibold">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/25 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none transition duration-200 outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                  />
                ) : (
                  <div 
                    title={fullName}
                    className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl py-3 px-4 text-xs text-white font-medium truncate shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                  >
                    {fullName || <span className="text-gray-500 italic">Not set</span>}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2 pl-0.5 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/25 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none transition duration-200 outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                  />
                ) : (
                  <div 
                    title={email}
                    className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl py-3 px-4 text-xs text-white font-medium truncate shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                  >
                    {email || <span className="text-gray-500 italic">Not set</span>}
                  </div>
                )}
              </div>

              {/* Company field */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2 pl-0.5 font-semibold">
                  <Building className="w-3.5 h-3.5 text-violet-400" />
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter business name"
                    className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/25 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none transition duration-200 outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                  />
                ) : (
                  <div 
                    title={company}
                    className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl py-3 px-4 text-xs text-white font-medium truncate shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                  >
                    {company || <span className="text-gray-500 italic">Not set</span>}
                  </div>
                )}
              </div>

              {/* Role field */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2 pl-0.5 font-semibold">
                  <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                  Role
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Chief Executive Officer"
                    className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/25 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none transition duration-200 outline-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                  />
                ) : (
                  <div 
                    title={role}
                    className="w-full bg-white/[0.03] border border-white/[0.04] rounded-xl py-3 px-4 text-xs text-white font-medium truncate shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                  >
                    {role || <span className="text-gray-500 italic">Executive</span>}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-6 flex items-center justify-end gap-3 border-t border-white/[0.06]">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl text-white transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="py-3 px-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:brightness-110 hover:scale-[1.02] text-xs font-bold uppercase tracking-widest rounded-xl text-white shadow-[0_4px_15px_rgba(139,92,246,0.35)] flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:scale-100"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="py-3 px-7 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:brightness-110 hover:scale-[1.02] text-xs font-bold uppercase tracking-widest rounded-xl text-white shadow-[0_4px_15px_rgba(139,92,246,0.35)] transition-all duration-200 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
