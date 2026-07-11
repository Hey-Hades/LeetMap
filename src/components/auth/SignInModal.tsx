import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendText, setResendText] = useState('Resend email');
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen) onClose();
  }, [user, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSignUp(false);
        setShowConfirm(false);
        setIsForgotPassword(false);
        setErrorMsg('');
        setFullName('');
        setEmail('');
        setPassword('');
        setResendText('Resend email');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOAuth = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setErrorMsg(error.message);
    setIsLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (isSignUp && !fullName) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    let authError;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { full_name: fullName } }
      });
      
      if (error) {
        authError = error;
      } else if (data?.user?.identities?.length === 0) {
        setErrorMsg('An account with this email already exists. Please sign in.');
        setIsLoading(false);
        return;
      } else if (!data.session) {
        setShowConfirm(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
    }

    setIsLoading(false);
    if (authError) setErrorMsg(authError.message);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, 
    });

    setIsLoading(false);
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      setShowConfirm(true); 
    }
  };

  const handleResendEmail = async () => {
    setResendText('Sending...');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      setErrorMsg(error.message);
      setResendText('Resend email');
    } else {
      setResendText('Sent ✓');
      setTimeout(() => setResendText('Resend email'), 2000);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg/90 backdrop-blur-sm p-4 sm:p-5 animate-in fade-in duration-200">
      
      <button 
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-5 sm:right-7 w-[30px] h-[30px] rounded-lg flex items-center justify-center text-text-faint text-[20px] cursor-pointer hover:text-text hover:bg-surface transition-colors border-none bg-transparent z-[101]"
      >
        ×
      </button>

      <div className="w-[92vw] max-w-[360px] sm:max-w-[370px] max-h-[95vh] overflow-y-auto bg-surface border border-border rounded-[16px] py-6 px-5 sm:px-7 text-center shadow-2xl relative transition-all duration-300 custom-scrollbar">
        
        {!showConfirm ? (
          !isForgotPassword ? (
            /* STANDARD LOGIN / SIGNUP VIEW */
            <>
              <div>
                <div className="w-10 h-10 rounded-[11px] bg-gold/10 border border-gold/35 flex items-center justify-center mx-auto mb-3">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <circle cx="12" cy="9" r="4.2" stroke="#c9a86a" strokeWidth="1.4"/>
                    <path d="M12 13.2C8.5 16.5 4.5 17.3 3 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
                    <path d="M12 13.2C15.5 16.5 19.5 17.3 21 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
                  </svg>
                </div>
                <div className="font-mono text-[9.5px] text-gold tracking-[2px] uppercase flex justify-center items-center gap-2 mb-0 before:content-[''] before:w-[12px] before:h-[1px] before:bg-gold/35 before:inline-block">
                  {isSignUp ? 'join the grind' : 'welcome back'}
                </div>
                <div className="font-serif text-[20px] font-medium text-text mt-1.5 tracking-[-0.2px]">
                  {isSignUp ? 'Create your account' : 'Sign in to LeetMap'}
                </div>
              </div>

              {/* UPDATED CLEAN ERROR MESSAGE */}
              {errorMsg && (
                <div className="mt-3.5 text-red text-[11.5px] font-sans text-center font-medium animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="mt-5">
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => handleOAuth('google')} className="flex-1 flex items-center justify-center gap-2 bg-surface-2 border border-border rounded-[9px] text-text font-sans text-[12px] font-medium py-2.5 cursor-pointer hover:border-border-hi hover:bg-surface transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.84-.08-1.65-.22-2.43H12v4.6h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.89c2.28-2.1 3.56-5.2 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3.02c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.27v3.11C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4.01-3.11z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77z"/></svg>
                    Google
                  </button>
                  <button type="button" onClick={() => handleOAuth('github')} className="flex-1 flex items-center justify-center gap-2 bg-surface-2 border border-border rounded-[9px] text-text font-sans text-[12px] font-medium py-2.5 cursor-pointer hover:border-border-hi hover:bg-surface transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58l-.01-2.23c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z"/></svg>
                    GitHub
                  </button>
                </div>

                <div className="flex items-center gap-2.5 my-4 before:content-[''] before:flex-1 before:h-[1px] before:bg-border after:content-[''] after:flex-1 after:h-[1px] after:bg-border">
                  <span className="font-mono text-[9px] text-text-faint tracking-[1px] uppercase">or email</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {isSignUp && (
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Username" 
                      className="w-full bg-bg border border-border rounded-[9px] text-text font-sans text-[12.5px] py-[11px] px-[13px] outline-none focus:border-gold/40 transition-colors placeholder:text-text-faint" 
                    />
                  )}
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full bg-bg border border-border rounded-[9px] text-text font-sans text-[12.5px] py-[11px] px-[13px] outline-none focus:border-gold/40 transition-colors placeholder:text-text-faint" 
                  />
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" 
                      className="w-full bg-bg border border-border rounded-[9px] text-text font-sans text-[12.5px] py-[11px] px-[13px] outline-none focus:border-gold/40 transition-colors placeholder:text-text-faint" 
                    />
                    
                    {/* HIDING THE FORGOT PASSWORD LINK FOR NOW */}
                    {/* {!isSignUp && (
                      <button 
                        type="button" 
                        onClick={() => setIsForgotPassword(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-dim hover:text-gold transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        Forgot?
                      </button>
                    )} 
                    */}
                    
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold border-none rounded-[9px] text-[#12100a] font-mono text-[11.5px] font-semibold tracking-[0.3px] py-3 cursor-pointer mt-4 transition-opacity hover:opacity-90 disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : (isSignUp ? 'Create account' : 'Sign in')}
                </button>
              </form>

              <div className="font-sans text-[11.5px] text-text-dim mt-4">
                {isSignUp ? 'Already have an account? ' : 'New here? '}
                <button 
                  type="button"
                  onClick={toggleMode} 
                  className="text-gold cursor-pointer font-medium hover:underline bg-transparent border-none p-0"
                >
                  {isSignUp ? 'Sign in' : 'Create an account'}
                </button>
              </div>
            </>
          ) : (
            /* FORGOT PASSWORD VIEW (Kept around but unreachable for now) */
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="w-10 h-10 rounded-[11px] bg-gold/10 border border-gold/35 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#c9a86a" strokeWidth="1.4"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="font-mono text-[9.5px] text-gold tracking-[2px] uppercase flex justify-center items-center gap-2 mb-0 before:content-[''] before:w-[12px] before:h-[1px] before:bg-gold/35 before:inline-block">
                recovery
              </div>
              <div className="font-serif text-[20px] font-medium text-text mt-1.5 tracking-[-0.2px]">
                Reset your password
              </div>
              <div className="font-sans text-[11.5px] text-text-dim leading-[1.6] mt-2 px-1 mb-5">
                Enter your email address and we will send you a link to reset your password.
              </div>

              {/* UPDATED CLEAN ERROR MESSAGE */}
              {errorMsg && (
                <div className="mb-4 text-red text-[11.5px] font-sans text-center font-medium animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="flex flex-col gap-2.5">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="w-full bg-bg border border-border rounded-[9px] text-text font-sans text-[12.5px] py-[11px] px-[13px] outline-none focus:border-gold/40 transition-colors placeholder:text-text-faint" 
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold border-none rounded-[9px] text-[#12100a] font-mono text-[11.5px] font-semibold tracking-[0.3px] py-3 cursor-pointer mt-1.5 transition-opacity hover:opacity-90 disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="font-sans text-[11.5px] text-text-dim mt-5">
                Remember your password?{' '}
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(false)} 
                  className="text-gold cursor-pointer font-medium hover:underline bg-transparent border-none p-0"
                >
                  Sign in
                </button>
              </div>
            </div>
          )
        ) : (
          /* CONFIRMATION SCREEN */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 py-2">
            <div className="w-11 h-11 rounded-[12px] bg-gold/10 border border-gold/35 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#c9a86a" strokeWidth="1.4"/>
                <path d="M4 7l8 6 8-6" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="font-mono text-[10px] text-gold tracking-[2px] uppercase flex justify-center items-center gap-2 mb-0 before:content-[''] before:w-[14px] before:h-[1px] before:bg-gold/35 before:inline-block">
              one more step
            </div>
            <div className="font-serif text-[18px] font-medium text-text mt-2 tracking-[-0.2px]">
              Check your email
            </div>
            <div className="font-sans text-[11.5px] text-text-dim leading-[1.6] mt-2 px-1">
              We sent a {isForgotPassword ? 'password reset link' : 'confirmation link'} to<br/>
              <b className="text-text font-medium break-all">{email}</b>. 
              Click it to {isForgotPassword ? 'set a new password.' : 'verify your account.'}
            </div>
            
            {/* UPDATED CLEAN ERROR MESSAGE */}
            {errorMsg && (
              <div className="mt-4 text-red text-[11.5px] font-sans text-center font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {!isForgotPassword && (
              <button 
                type="button"
                onClick={handleResendEmail}
                className="w-full bg-gold border-none rounded-[9px] text-[#12100a] font-mono text-[11.5px] font-semibold tracking-[0.3px] py-3 cursor-pointer mt-5 transition-opacity hover:opacity-90"
              >
                {resendText}
              </button>
            )}
            
            <div className="font-sans text-[11.5px] text-text-dim mt-4">
              Wrong address?{' '}
              <button 
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  if (isForgotPassword) setIsForgotPassword(true);
                }} 
                className="text-gold cursor-pointer font-medium hover:underline bg-transparent border-none p-0"
              >
                Go back
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="font-sans text-[10px] text-text-faint mt-4 text-center max-w-[280px] leading-[1.6]">
        By continuing you agree to LeetMap's <span className="text-text-dim cursor-pointer hover:text-gold transition-colors">Terms</span> and <span className="text-text-dim cursor-pointer hover:text-gold transition-colors">Privacy Policy</span>.
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(134, 141, 150, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(201, 168, 106, 0.4); }
      `}} />

    </div>
  );
}