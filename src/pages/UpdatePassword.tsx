import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Container from '../components/layout/Container';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // On mount, check if Supabase established a secure session from an email link
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else {
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  // Show a blank screen for a split second while checking session
  if (hasSession === null) return null; 

  return (
    <Container className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-surface border border-border rounded-[16px] py-8 px-7 text-center shadow-2xl">
        
        {!hasSession ? (
          /* Error State: User navigated here manually or token expired */
          <>
            <div className="w-11 h-11 rounded-[12px] bg-red/10 border border-red/30 flex items-center justify-center mx-auto mb-4 text-red">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="font-serif text-[20px] font-medium text-text mb-2">
              Invalid or expired link
            </div>
            <div className="font-sans text-[12px] text-text-dim mb-6 leading-relaxed">
              For your security, password reset links expire after a short time and can only be used once.
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-surface-2 border border-border rounded-[9px] text-text font-mono text-[12px] font-semibold py-3 cursor-pointer hover:bg-border transition-colors"
            >
              Return Home
            </button>
          </>
        ) : (
          /* Success State: User arrived via secure email link */
          <>
            <div className="w-11 h-11 rounded-[12px] bg-gold/10 border border-gold/35 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#c9a86a" strokeWidth="1.4"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-serif text-[20px] font-medium text-text mb-2">
              Set new password
            </div>
            <div className="font-sans text-[12px] text-text-dim mb-6">
              Please enter your new password below.
            </div>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password" 
                required
                className="w-full bg-bg border border-border rounded-[9px] text-text font-sans text-[13px] py-3 px-4 outline-none focus:border-gold/40 transition-colors placeholder:text-text-faint" 
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold border-none rounded-[9px] text-[#12100a] font-mono text-[12px] font-semibold py-3 cursor-pointer hover:opacity-90 disabled:opacity-70 transition-opacity"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            {message && (
              <div className={`mt-4 text-[12px] font-sans ${message.includes('success') ? 'text-green' : 'text-red'}`}>
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}