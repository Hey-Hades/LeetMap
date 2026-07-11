import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenSignIn?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  userName?: string | null;
}

export default function Navbar({ onOpenSignIn, isAuthenticated, onSignOut, userName }: NavbarProps) {
  const location = useLocation();
  const isCompanyPage = location.pathname.includes('/company/');
  const [theme, setTheme] = useState<"light" | "dark">(() => {
  return (localStorage.getItem("theme") as "light" | "dark") || "light";
});
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}, [theme]);

  return (
    <div className="flex items-center justify-between px-7 py-4 border-b border-border relative z-50 bg-bg/80 backdrop-blur-md transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2.5 cursor-pointer no-underline group">
        <svg className="w-[22px] h-[22px] flex-shrink-0 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="4.2" stroke="#c9a86a" strokeWidth="1.4"/>
          <path d="M12 13.2C12 13.2 6 19 6 22" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round" opacity="0"/>
          <path d="M12 13.2C8.5 16.5 4.5 17.3 3 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
          <path d="M12 13.2C15.5 16.5 19.5 17.3 21 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
        </svg>
        <span className="font-serif italic font-medium text-[19px] text-text tracking-[0.2px]">LeetMap</span>
        <span className="font-mono text-[9.5px] text-text-faint tracking-[1.2px] uppercase ml-2 pl-2 border-l border-border hidden sm:inline-block">
          company-wise leetcode
        </span>
      </Link>

      <div className="flex items-center gap-2.5">
        {!isCompanyPage ? (
          <a href="https://github.com/liquidslr/leetcode-company-wise-problems" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-text-dim cursor-pointer tracking-[0.3px] hover:text-gold transition-colors duration-200 no-underline hidden sm:block mr-2">
            Source
          </a>
        ) : (
          <Link to="/" className="font-mono text-[11px] text-text-dim cursor-pointer tracking-[0.3px] hover:text-gold transition-colors duration-200 no-underline hidden sm:block mr-2">
            All companies
          </Link>
        )}
        
        {/* Heart Icon */}
        <div className="w-8 h-8 rounded-[9px] border border-border bg-surface text-text-dim flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-border-hi hover:text-gold">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        
        {/* Dynamic Auth Section */}
        {!isAuthenticated ? (
          <button 
            onClick={onOpenSignIn}
            className="font-mono text-[11px] font-medium tracking-[0.3px] py-2 px-4 rounded-[9px] border border-gold/35 text-gold bg-gold/10 cursor-pointer hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
          >
            Sign in
          </button>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className={`w-8 h-8 rounded-[9px] border bg-surface/50 text-text-dim flex items-center justify-center cursor-pointer transition-all duration-300 ${showUserMenu ? 'border-border-hi text-text shadow-sm' : 'border-border/60 hover:border-border-hi hover:text-text'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* Centered Dropdown Menu */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 top-full pt-2.5 z-50 transition-all duration-300 ease-out origin-top ${
                showUserMenu 
                  ? 'opacity-100 transform translate-y-0 scale-100 pointer-events-auto' 
                  : 'opacity-0 transform -translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-32 bg-surface/90 backdrop-blur-xl border border-border/40 rounded-[10px] shadow-lg py-1">
                <div className="px-3 py-2 border-b border-border/30">
                  <span className="block text-[11px] text-text font-medium truncate text-center capitalize tracking-[0.2px]">
                    {userName || 'User'}
                  </span>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut?.();
                    }}
                    className="w-full text-center px-2 py-1.5 text-[10px] text-text-dim hover:text-text hover:bg-bg/80 rounded-[6px] transition-all duration-200"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div
  onClick={() =>
    setTheme(theme === "light" ? "dark" : "light")
  }
  className="w-8 h-8 rounded-[9px] border border-border bg-surface text-text-dim flex items-center justify-center cursor-pointer text-[13px] transition-all duration-200 hover:border-border-hi hover:text-gold select-none"
>
  {theme === "light" ? "☀" : "☾"}
</div>
      </div>
    </div>
  );
}