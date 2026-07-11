import { cn } from '../../utils/classNames';

export type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

interface DifficultyFilterProps {
  active: Difficulty;
  onChange: (diff: Difficulty) => void;
}

export default function DifficultyFilter({ active, onChange }: DifficultyFilterProps) {
  const difficulties: Difficulty[] = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-text-dim mr-2 hidden sm:inline">Difficulty:</span>
      {difficulties.map((diff) => (
        <button
          key={diff}
          onClick={() => onChange(diff)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
            active === diff
              ? "bg-surface-2 text-text border-text-dim"
              : "bg-transparent text-text-dim border-border hover:border-text-dim"
          )}
        >
          {diff}
        </button>
      ))}
    </div>
  );
}