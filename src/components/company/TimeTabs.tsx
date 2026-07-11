import { cn } from '../../utils/classNames';

export type TimeRange = '30d' | '6m' | 'all';

interface TimeTabsProps {
  activeTab: TimeRange;
  onChange: (tab: TimeRange) => void;
}

export default function TimeTabs({ activeTab, onChange }: TimeTabsProps) {
  const tabs: { id: TimeRange; label: string }[] = [
    { id: '30d', label: 'Last 30 Days' },
    { id: '6m', label: 'Last 6 Months' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex space-x-1 bg-surface-2 p-1 rounded-lg w-fit border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === tab.id
              ? "bg-surface text-gold shadow-sm border border-border"
              : "text-text-dim hover:text-text hover:bg-surface/50 border border-transparent"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}