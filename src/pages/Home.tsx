import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Company } from '../types';
import { getCompanies } from '../services/data'; 

const CompanyLogo = ({ company }: { company: Company }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const cleanDomain = company.name.toLowerCase().replace(/[^a-z0-9-]/g, '') + '.com';

  return (
    <div 
      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center font-mono text-[12px] font-semibold flex-shrink-0 overflow-hidden relative"
      style={{ backgroundColor: `${company.color}1f`, color: company.color }}
    >
      {!imgFailed ? (
        <img 
          src={`https://unavatar.io/${cleanDomain}?fallback=false`} 
          alt={company.name} 
          className="w-[62%] h-[62%] object-contain" 
          onError={() => setImgFailed(true)} 
        />
      ) : (
        <span>{company.init}</span>
      )}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      const data = await getCompanies();
      setCompanies(data);
      setIsLoading(false);
    };
    
    loadCompanies();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault(); 
        searchInputRef.current?.focus(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCompanies = companies
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.problemCount - a.problemCount); 

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mb-6 flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="4.2" stroke="#c9a86a" strokeWidth="1.4"/>
            <path d="M12 13.2C12 13.2 6 19 6 22" stroke="#c9a86a" strokeWidth="1.4" strokeLinecap="round" opacity="0"/>
            <path d="M12 13.2C8.5 16.5 4.5 17.3 3 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
            <path d="M12 13.2C15.5 16.5 19.5 17.3 21 16.4" stroke="#c9a86a" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
          </svg>
        </div>
        <div className="font-mono text-[9.5px] text-text-faint tracking-[2.5px] uppercase animate-pulse text-center">
          Loading 400+ companies
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* HERO SECTION */}
      <div className="pt-16 px-11 pb-2 relative overflow-hidden">
        <svg className="absolute -top-10 -right-[60px] w-[520px] h-[420px] opacity-50 pointer-events-none" viewBox="0 0 520 420" fill="none">
          <path d="M-20 80 C 80 40, 160 120, 260 70 S 460 30, 560 90" stroke="#c9a86a" strokeWidth="1" opacity="0.18"/>
          <path d="M-20 140 C 90 100, 170 180, 270 130 S 470 90, 560 150" stroke="#c9a86a" strokeWidth="1" opacity="0.14"/>
          <path d="M-20 200 C 100 160, 180 240, 280 190 S 480 150, 560 210" stroke="#6fa89c" strokeWidth="1" opacity="0.16"/>
          <path d="M-20 260 C 110 220, 190 300, 290 250 S 490 210, 560 270" stroke="#c9a86a" strokeWidth="1" opacity="0.1"/>
          <path d="M-20 320 C 120 280, 200 360, 300 310 S 500 270, 560 330" stroke="#6fa89c" strokeWidth="1" opacity="0.08"/>
          <circle cx="330" cy="150" r="2.5" fill="#c9a86a" opacity="0.6"/>
          <circle cx="420" cy="230" r="2.5" fill="#6fa89c" opacity="0.5"/>
          <circle cx="240" cy="90" r="2.5" fill="#c9a86a" opacity="0.5"/>
        </svg>

        {/* FIXED BADGES: Dropped 10px lower and resized */}
        <div className="hidden md:flex flex-col items-end gap-1 absolute bottom-[14px] right-11 z-20">
          <a 
            href="https://coderace-live.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center rounded-md px-3 py-2 bg-[#0a0b0d] shadow-[0_2px_8px_rgba(255,255,255,0.12)] hover:shadow-[0_4px_12px_rgba(255,255,255,0.18)] transition-all duration-200 hover:-translate-y-[2px]"
          >
            <span className="font-mono font-bold text-[11px] tracking-[-0.2px] text-white">Code</span>
            <span className="font-mono font-bold text-[11px] tracking-[-0.2px] text-[#e2703f]">Race..</span>
          </a>
          <a 
            href="https://stash-it-zen.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center rounded-md px-3 py-2 bg-[#f7f4ee] border border-black/10 hover:border-black/20 shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-[2px]"
          >
            <span className="font-mono text-[11px] tracking-[-0.2px] text-[#1a1a1a]">Stash-It</span>
            <span className="font-mono text-[11px] tracking-[-0.2px] text-[#9a9a9a]">..</span>
          </a>
        </div>

        <div className="font-mono text-[10.5px] text-gold tracking-[2px] uppercase mb-[18px] flex items-center gap-2 relative z-10 mt-2">
          <div className="w-[14px] h-[1px] bg-gold/35"></div>
          {companies.length} companies, mapped
        </div>
        
        <h1 className="font-serif font-medium text-[46px] leading-[1.08] text-text tracking-[-0.5px] max-w-[640px] relative z-10">
          Every question they've actually asked,<em className="italic text-gold font-medium">Charted.</em>
        </h1>
        
        <p className="font-sans text-[14px] text-text-dim leading-[1.85] max-w-[520px] mt-5 relative z-10">
          Precision-mapped interview questions from {companies.length} companies. Filtered by frequency and recency so you're always practicing what matters most.
        </p>

        <div className="flex mt-10 relative z-10">
          <div className="pr-8">
            <div className="font-serif text-[30px] font-medium text-text">{companies.length}</div>
            <div className="font-mono text-[9.5px] text-text-faint tracking-[1.5px] uppercase mt-1">Companies</div>
          </div>
          <div className="px-8 border-l border-border">
            <div className="font-serif text-[30px] font-medium text-text">32,922</div>
            <div className="font-mono text-[9.5px] text-text-faint tracking-[1.5px] uppercase mt-1">Problem entries</div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="pt-9 px-11 relative z-10">
        <div className="relative">
          <span className="absolute left-4 top-4 text-text-faint text-[14px]">⌕</span>
          <input 
            ref={searchInputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies.." 
            className="w-full bg-surface border border-border rounded-[11px] text-text font-sans text-[13.5px] py-[15px] pl-11 pr-11 outline-none focus:border-gold/35 transition-colors"
          />
          <span className="absolute right-3.5 top-[13px] font-mono text-[10px] text-text-faint border border-border py-[3px] px-[7px] rounded-[5px]">/</span>
        </div>
      </div>

      {/* COMPANY GRID */}
      <div className="font-mono text-[10px] text-text-faint tracking-[1.5px] uppercase mt-[26px] mx-11 mb-[14px]">
        {filteredCompanies.length} companies
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-11 pb-11">
        {filteredCompanies.map((c) => {
          return (
            <div 
              key={c.name}
              onClick={() => navigate(`/company/${c.slug}`)}
              className="flex items-center gap-[14px] p-[17px] border border-border rounded-xl cursor-pointer bg-surface hover:bg-surface-2 hover:-translate-y-[1px] hover:border-border-hi transition-all group"
            >
              <CompanyLogo company={c} />
              
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[13.5px] font-semibold text-text truncate">{c.name}</div>
                <div className="font-mono text-[10.5px] text-text-faint mt-1.5 flex items-center gap-[9px]">
                  <b className="text-text-dim font-medium">{c.problemCount}</b> problems
                  
                  <span className="flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full bg-[#6cb491]"></span>{c.easy || 0}</span>
                  <span className="flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full bg-[#cf9f58]"></span>{c.med || 0}</span>
                  <span className="flex items-center gap-1"><span className="w-[5px] h-[5px] rounded-full bg-[#bf6d64]"></span>{c.hard || 0}</span>
                </div>
              </div>
              
              <div className="text-text-faint font-serif text-[16px] group-hover:text-gold transition-colors">›</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}