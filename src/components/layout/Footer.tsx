import { Link } from 'react-router-dom';
import Container from './Container';

export default function Footer() {
  
  // The function to glide the user back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-bg mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mt-14 pt-6 border-t border-border font-mono text-[11px] text-text-faint pb-8 gap-6 text-center md:text-left">
          
          {/* Left Side: Credits & Disclaimer */}
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.5px]">
              BUILT BY{' '}
              <a 
                href="https://himanshusharmazen-dev.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold font-semibold hover:underline transition-all"
              >
                HIMANSHU SHARMA
              </a>
            </div>
            <div className="font-sans text-[10px] max-w-[400px] leading-relaxed">
              © {new Date().getFullYear()} All rights reserved. <br className="hidden md:block" />
              Data sourced from open-source repositories. Not affiliated with LeetCode.
            </div>
          </div>
          
          {/* Right Side: Navigation & External Links */}
          <div className="flex gap-5 items-center justify-center pt-1 md:pt-0">
            {/* Added the onClick handler here! */}
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="cursor-pointer hover:text-gold transition-colors"
            >
              All companies
            </Link>
            
            <a 
              href="https://leetcode.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer hover:text-gold transition-colors"
            >
              LeetCode
            </a>
            <a 
              href="https://github.com/liquidslr/leetcode-company-wise-problems" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer hover:text-gold transition-colors"
            >
              Source
            </a>
          </div>
          
        </div>
      </Container>
    </footer>
  );
}