import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import type { Company, Problem } from '../types';
import { getCompanies, getProblemsForCompany } from '../services/data';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const TIME_FILES: Record<string, string> = {
  '30 days': '1. Thirty Days.csv',
  '3 months': '2. Three Months.csv',
  '6 months': '3. Six Months.csv',
  '6+ months': '4. More Than Six Months.csv',
  'All time': '5. All.csv'
};

const CompanyLogoLarge = ({ company }: { company: Company }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const cleanDomain = company.name.toLowerCase().replace(/[^a-z0-9-]/g, '') + '.com';

  const bgTint = company.color.includes('hsl') 
    ? company.color.replace(')', ', 0.12)').replace('hsl', 'hsla') 
    : `${company.color}1f`;

  return (
    <div 
      className="w-[58px] h-[58px] rounded-[14px] flex items-center justify-center font-mono text-[19px] font-semibold flex-shrink-0 overflow-hidden relative" 
      style={{ backgroundColor: bgTint, color: company.color }}
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

const TopicsCloud = ({ problems, onSelect, currentSearch }: { problems: Problem[], onSelect: (tag: string) => void, currentSearch: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tagCounts: Record<string, number> = {};
  
  problems.forEach(p => {
    p.topics?.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const visibleTags = isExpanded ? sortedTags : sortedTags.slice(0, 12);
  const remainingCount = Math.max(0, sortedTags.length - 12);

  if (sortedTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-[18px]">
      {visibleTags.map(([tag, count]) => {
        const isActive = currentSearch.toLowerCase() === tag.toLowerCase();
        return (
          <button 
            key={tag}
            onClick={() => onSelect(isActive ? '' : tag)}
            className={`font-mono text-[10.5px] px-3 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 border ${
              isActive 
                ? 'border-gold bg-gold/10 text-gold' 
                : 'border-border bg-surface text-text-dim hover:border-border-hi'
            }`}
          >
            {tag} <span className={isActive ? 'text-gold/70' : 'text-text-faint'}>{count}</span>
          </button>
        );
      })}
      
      {!isExpanded && remainingCount > 0 && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="font-mono text-[10.5px] text-gold border border-gold/35 bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-full flex items-center cursor-pointer transition-colors"
        >
          +{remainingCount} more
        </button>
      )}
      {isExpanded && remainingCount > 0 && (
        <button 
          onClick={() => setIsExpanded(false)}
          className="font-mono text-[10.5px] text-text-faint border border-border bg-surface hover:text-text hover:border-border-hi px-3 py-1.5 rounded-full flex items-center cursor-pointer transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
};

export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All time');
  const [showBanner, setShowBanner] = useState(true);

  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');

  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set()); 
  const [hideSolved, setHideSolved] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, diffFilter, hideSolved, activeTab]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const companies = await getCompanies();
      const found = companies.find(c => c.slug === slug);
      setCompany(found || null);

      if (found) {
        const fileToFetch = TIME_FILES[activeTab];
        const liveProblems = await getProblemsForCompany(found.name, fileToFetch);
        setProblems(liveProblems);
      }
      
      setIsLoading(false);
    };

    if (slug) loadData();
  }, [slug, activeTab]);

  useEffect(() => {
    const fetchSolvedStatus = async () => {
      if (!user || !company) return;

      const { data, error } = await supabase
        .from('solved_problems')
        .select('problem_id')
        .eq('user_id', user.id)
        .eq('company_slug', company.slug);

      if (!error && data) {
        const ids = new Set(data.map(row => Number(row.problem_id)));
        setSolvedIds(ids);
      }
    };

    fetchSolvedStatus();
  }, [user, company]);

  // Instantly scroll to the top whenever the company slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  if (isLoading) return (
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
        Loading dataset
      </div>
    </div>
  );

  if (!company) return <Container className="py-24 text-center text-text-dim">Company not found.</Container>;

  const toggleProblem = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!user || !company) return;

    const isCurrentlySolved = solvedIds.has(id);
    const problemIdStr = String(id); 

    // Optimistic Update
    const next = new Set(solvedIds);
    if (isCurrentlySolved) next.delete(id);
    else next.add(id);
    setSolvedIds(next);

    // Network Request
    if (isCurrentlySolved) {
      await supabase
        .from('solved_problems')
        .delete()
        .eq('user_id', user.id)
        .eq('problem_id', problemIdStr)
        .eq('company_slug', company.slug);
    } else {
      await supabase
        .from('solved_problems')
        .insert({
          user_id: user.id,
          problem_id: problemIdStr,
          company_slug: company.slug
        });
    }
  };

  let displayedProblems = problems;
  
  if (search.trim()) {
    displayedProblems = displayedProblems.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      (p.topics && p.topics.some(t => t.toLowerCase().includes(search.toLowerCase())))
    );
  }
  if (diffFilter !== 'All') {
    displayedProblems = displayedProblems.filter(p => p.difficulty.toLowerCase() === diffFilter.toLowerCase());
  }
  if (isAuthenticated && hideSolved) {
    displayedProblems = displayedProblems.filter(p => !solvedIds.has(p.id));
  }
  
  const totalCount = displayedProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedProblems = displayedProblems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const rawTotalCount = problems.length;
  const progressPct = rawTotalCount === 0 ? 0 : Math.min(100, (solvedIds.size / rawTotalCount) * 100);

  // UPDATED: Removed the final column width to match the removed Acceptance column
  const gridTemplate = isAuthenticated 
    ? "grid-cols-[26px_40px_1fr_110px_160px]" 
    : "grid-cols-[40px_1fr_110px_160px]";

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <Container className="pt-10 pb-12">
      <div className="font-mono text-[10.5px] text-text-faint mb-6 flex items-center gap-2 uppercase tracking-wide">
        <Link to="/" className="hover:text-gold transition-colors cursor-pointer">Companies</Link>
        <span className="text-text-faint">→</span>
        <span className="text-gold">{company.name}</span>
      </div>

      <div className="flex items-center gap-5 pb-6 border-b border-border">
        <CompanyLogoLarge company={company} />
        <div>
          <div className="font-serif text-[29px] font-medium text-text tracking-tight">{company.name} LeetCode Questions</div>
          <div className="font-mono text-[11.5px] text-text-dim mt-1.5">
            <b className="text-text font-medium">{company.problemCount}</b> · {company.easy || 0} easy · {company.med || 0} medium · {company.hard || 0} hard
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-3 mt-3">
              <div className="w-[180px] h-1 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
              </div>
              <span className="font-mono text-[11px] text-text-dim">{solvedIds.size} / {rawTotalCount} solved</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-0.5 mt-6 border-b border-border">
        {Object.keys(TIME_FILES).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[11.5px] px-4 py-2.5 cursor-pointer border-b-2 rounded-t-lg transition-colors relative top-[1px] flex gap-2 items-center ${
              activeTab === tab ? 'text-gold border-gold' : 'text-text-faint border-transparent hover:text-text-dim hover:bg-surface'
            }`}
          >
            {tab} {activeTab === tab && <span className="opacity-60">{rawTotalCount}</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-2.5 mt-5">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-3 text-text-faint text-[13px]">⌕</span>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter problems or topics..." 
            className="w-full bg-surface border border-border rounded-lg text-text font-sans text-[12.5px] py-3 pl-9 pr-3 outline-none focus:border-gold/35 transition-colors"
          />
        </div>
        
        <div className="flex bg-surface border border-border rounded-lg p-1 gap-0.5">
          {['All', 'Easy', 'Medium', 'Hard'].map((lvl) => (
            <button 
              key={lvl}
              onClick={() => setDiffFilter(lvl)}
              className={`font-mono text-[11px] font-medium py-2 px-3.5 rounded-md transition-colors ${
                diffFilter === lvl ? 'bg-surface-2 text-text' : 'text-text-faint hover:text-text'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        
        {isAuthenticated && (
          <label className="flex items-center gap-2 font-mono text-[11px] text-text-dim cursor-pointer px-3.5 border border-border rounded-[10px] bg-surface select-none">
            <input type="checkbox" className="hidden" checked={hideSolved} onChange={(e) => setHideSolved(e.target.checked)} />
            <span className={`w-3.5 h-3.5 rounded-[4px] border border-border-hi flex items-center justify-center flex-shrink-0 transition-colors ${hideSolved ? 'bg-gold border-gold' : ''}`}>
              {hideSolved && <span className="text-[#12100a] text-[10px]">✓</span>}
            </span>
            Hide solved
          </label>
        )}
      </div>

      <TopicsCloud problems={problems} onSelect={setSearch} currentSearch={search} />

      {(!isAuthenticated && showBanner) && (
        <div className="flex items-center justify-between bg-gradient-to-br from-surface to-surface-2 border border-border rounded-xl py-4 px-5 mt-7 gap-4">
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/35 text-gold flex items-center justify-center text-sm flex-shrink-0">◈</div>
            <div className="font-sans text-[12.5px] text-text-dim leading-relaxed">
              <b className="text-text font-semibold">Track your progress.</b> Sign in free to tick off problems and save what you've solved.
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-5">
            <span className="text-text-faint cursor-pointer text-lg hover:text-text transition-colors" onClick={() => setShowBanner(false)}>×</span>
          </div>
        </div>
      )}

      {/* THE TABLE */}
      <div className="border border-border rounded-xl overflow-x-auto mt-6 shadow-[0_1px_0_rgba(0,0,0,0.15)]">
        <div className="min-w-[760px]">
          {/* UPDATED: Removed Acceptance Header */}
          <div className={`grid ${gridTemplate} p-3.5 px-5 font-mono text-[9px] text-text-faint tracking-[1.4px] uppercase border-b border-border bg-surface text-left`}>
            {isAuthenticated && <div></div>}
            <div>#</div><div>Problem</div><div>Difficulty</div><div>Frequency</div>
          </div>
          <div>
            {paginatedProblems.map((p) => {
              const isSolved = solvedIds.has(p.id);
              return (
                <a 
                  key={p.id} 
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid ${gridTemplate} items-center p-4 px-5 border-b border-border text-[12.5px] cursor-pointer hover:bg-surface border-l-2 border-l-transparent hover:border-l-gold transition-all group no-underline relative`}
                >
                  {isAuthenticated && (
                    <div 
                      onClick={(e) => toggleProblem(e, p.id)}
                      className={`w-4 h-4 rounded-[5px] border border-border-hi flex items-center justify-center flex-shrink-0 transition-colors ${isSolved ? 'bg-gold border-gold' : 'bg-bg hover:border-gold/50'}`}
                    >
                      {isSolved && <span className="text-[#12100a] text-[10px]">✓</span>}
                    </div>
                  )}

                  <div className="font-mono text-text-faint text-[11px] text-left">{String(p.id).padStart(2, '0')}</div>
                  <div className="text-left">
                    <div className={`font-sans text-text font-semibold mb-1.5 text-[13px] transition-opacity ${isSolved ? 'opacity-40' : ''}`}>{p.title}</div>
                    <div className="flex flex-wrap gap-1">
                      {p.topics?.map((tag, i) => (
                        <span key={i} className={`font-mono text-[8.5px] border border-border py-[2px] px-1.5 rounded-[5px] tracking-wide transition-opacity ${isSolved ? 'opacity-35 text-text-faint' : 'text-text-faint'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`inline-flex items-center gap-1.5 font-mono text-[9.5px] tracking-wide font-semibold py-1 px-2.5 rounded-full ${p.difficulty.toLowerCase() === 'easy' ? 'bg-[#6cb491]/10 text-[#6cb491]' : p.difficulty.toLowerCase() === 'medium' ? 'bg-[#cf9f58]/10 text-[#cf9f58]' : 'bg-[#bf6d64]/10 text-[#bf6d64]'}`}>
                      <span className={`w-1 h-1 rounded-full ${p.difficulty.toLowerCase() === 'easy' ? 'bg-[#6cb491]' : p.difficulty.toLowerCase() === 'medium' ? 'bg-[#cf9f58]' : 'bg-[#bf6d64]'}`}></span>
                      {p.difficulty.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-dim text-left">
                    <div className="w-[70px] h-1 rounded-full bg-surface-2 overflow-hidden flex-shrink-0">
                      <div className="h-full rounded-full bg-text-dim" style={{ width: `${p.frequency}%` }}></div>
                    </div>
                    <span className="min-w-[24px] text-right">{p.frequency}</span>
                  </div>
                  
                  {/* UPDATED: Removed the static 46.2% column here */}
                  
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-faint text-[12px] opacity-0 group-hover:opacity-60 transition-opacity">
                    ↗
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* PAGINATION UI */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between mt-5">
          <div className="font-mono text-[11.5px] text-text-faint">
            Showing <b className="text-text-dim font-semibold">{Math.min(currentPage * PAGE_SIZE, totalCount)}</b> of <b className="text-text-dim font-semibold">{totalCount}</b>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="font-mono text-[11.5px] text-text-dim bg-surface border border-border rounded-lg px-3.5 py-2 cursor-pointer transition-all hover:border-border-hi disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-border"
            >
              ‹ Prev
            </button>
            
            {getPageNumbers().map(num => (
              <button
                key={num}
                onClick={() => {
                  setCurrentPage(num);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-mono text-[11.5px] border rounded-lg px-3.5 py-2 cursor-pointer transition-all ${
                  currentPage === num 
                    ? 'bg-text text-bg border-text font-semibold' 
                    : 'bg-surface border-border text-text-dim hover:border-border-hi'
                }`}
              >
                {num}
              </button>
            ))}

            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="font-mono text-[11.5px] text-text-dim bg-surface border border-border rounded-lg px-3.5 py-2 cursor-pointer transition-all hover:border-border-hi disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-border"
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {/* EXPLAINER */}
      <div className="mt-16 max-w-[680px]">
        <div className="font-serif text-[24px] font-medium text-text tracking-[-0.3px] mb-4">How to read this list</div>
        <p className="font-sans text-[13.5px] text-text-dim leading-[1.9] mb-3.5">The tabs at the top split the questions by how recently people said they were asked in interviews. "Last 30 Days" is the past month, "Last 3 Months" is the past quarter, and so on. "All Time" is every question on record for this company.</p>
        
        {/* UPDATED: Removed the Acceptance rate explanation */}
        <p className="font-sans text-[13.5px] text-text-dim leading-[1.9] mb-3.5">Frequency is a score from 0 to 100 for how often a question showed up in that time window. A higher number means it came up more often, so the list starts with the most common questions first. Click any question to open it on LeetCode.</p>
      </div>
    </Container>
  );
}