import type { Problem } from '../../types';
import Badge from '../ui/Badge';
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';

interface ProblemRowProps {
  problem: Problem;
  isSolved?: boolean; // We will connect this in Phase 7
}

export default function ProblemRow({ problem, isSolved = false }: ProblemRowProps) {
  return (
    <tr className="border-b border-border hover:bg-surface-2/50 transition-colors group">
      <td className="px-4 py-4 whitespace-nowrap text-sm text-text-dim w-12 text-center">
        {isSolved ? (
          <CheckCircle2 size={18} className="text-gold mx-auto" />
        ) : (
          <Circle size={18} className="text-border mx-auto group-hover:text-text-dim transition-colors" />
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-text-dim w-16">
        #{problem.id}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-text group-hover:text-gold transition-colors">
        <a href={problem.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
          {problem.title}
        </a>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <Badge variant={
          problem.difficulty === 'Easy' ? 'success' :
          problem.difficulty === 'Medium' ? 'warning' : 'danger'
        }>
          {problem.difficulty}
        </Badge>
      </td>
      <td className="px-4 py-4 whitespace-nowrap w-48 hidden sm:table-cell">
        <div className="flex items-center w-full bg-surface-2 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-text h-full opacity-30" 
            style={{ width: `${problem.frequency}%` }}
          />
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a 
          href={problem.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-text-dim hover:text-gold transition-colors"
        >
          Solve <ExternalLink size={14} className="ml-1.5" />
        </a>
      </td>
    </tr>
  );
}