import { Link, useRouteError } from 'react-router-dom';

export default function NotFound() {
  // This catches the routing error so it doesn't crash your console silently
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center selection:bg-gold/30">
      
      {/* Ghost Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/35 flex items-center justify-center mb-8 opacity-60">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="9" r="4.2" stroke="#c9a86a" strokeWidth="1.4"/>
          <path d="M12 13.2C12 13.2 6 19 6 22" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round" opacity="0"/>
          <path d="M12 13.2C8.5 16.5 4.5 17.3 3 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
          <path d="M12 13.2C15.5 16.5 19.5 17.3 21 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
        </svg>
      </div>

      {/* 404 Header */}
      <h1 className="font-serif text-[72px] md:text-[96px] font-medium text-text leading-none tracking-[-2px]">
        404
      </h1>
      
      <div className="font-mono text-[11px] text-gold tracking-[2.5px] uppercase mt-5 mb-2 flex items-center gap-2">
        <div className="w-3 h-[1px] bg-gold/35"></div>
        Page Not Found
        <div className="w-3 h-[1px] bg-gold/35"></div>
      </div>
      
      <p className="font-sans text-[13.5px] text-text-dim leading-[1.7] max-w-[340px] mt-2 mb-9">
        The route you are looking for doesn't exist, has been moved, or is temporarily out of bounds.
      </p>
      
      {/* Return Button */}
      <Link 
        to="/" 
        className="font-mono text-[11.5px] font-medium tracking-[0.5px] px-6 py-3.5 rounded-[10px] border border-border bg-surface text-text hover:border-border-hi hover:text-gold transition-all cursor-pointer no-underline flex items-center gap-2"
      >
        <span>‹</span> Return to Home
      </Link>
      
    </div>
  );
}