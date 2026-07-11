import type { Problem } from '../../types';
import ProblemRow from './ProblemRow';
import Card from '../ui/Card';

interface ProblemTableProps {
  problems: Problem[];
}

export default function ProblemTable({ problems }: ProblemTableProps) {
  if (problems.length === 0) {
    return (
      <Card className="text-center py-12 text-text-dim">
        No problems found matching your filters.
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-2 border-b border-border text-xs uppercase tracking-wider text-text-dim font-medium">
              <th className="px-4 py-3 text-center w-12">Status</th>
              <th className="px-4 py-3 w-16">ID</th>
              <th className="px-4 py-3">Problem Title</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3 hidden sm:table-cell">Frequency</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}