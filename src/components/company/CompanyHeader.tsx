import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Company } from '../../types'; // <-- Added "type" here!

export default function CompanyHeader({ company }: { company: Company }) {
  return (
    <div className="mb-8 pt-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-sm text-text-dim hover:text-gold transition-colors mb-6"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to companies
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-text mb-2">
            {company.name}
          </h1>
          <p className="text-text-dim">
            Based on recent interview experiences
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-medium text-text">{company.problemCount}</div>
          <div className="text-sm text-text-dim uppercase tracking-wider font-semibold">Problems</div>
        </div>
      </div>
    </div>
  );
}