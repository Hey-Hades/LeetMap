import Card from '../ui/Card';

interface StatsProps {
  total: number;
  solved: number;
}

export default function CompanyStats({ total, solved }: StatsProps) {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Progress Card */}
      <Card className="md:col-span-2 flex flex-col justify-center space-y-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-text-dim text-sm font-medium uppercase tracking-wider">Your Progress</span>
            <div className="text-3xl font-medium text-text mt-1">
              {solved} <span className="text-text-dim text-xl">/ {total}</span>
            </div>
          </div>
          <div className="text-gold font-medium text-xl">{percentage}%</div>
        </div>
        
        {/* The Progress Bar */}
        <div className="w-full bg-surface-2 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gold h-full transition-all duration-1000 ease-out rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </Card>

      {/* Difficulty Breakdown Card */}
      <Card className="flex flex-col justify-center">
        <span className="text-text-dim text-sm font-medium uppercase tracking-wider mb-4">Difficulty</span>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6cb491]">Easy</span>
            <span className="text-text">30%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gold">Medium</span>
            <span className="text-text">55%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#bf6d64]">Hard</span>
            <span className="text-text">15%</span>
          </div>
        </div>
      </Card>

    </div>
  );
}