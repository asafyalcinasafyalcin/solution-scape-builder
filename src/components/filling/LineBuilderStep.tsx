import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface StepOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface LineBuilderStepProps {
  title: string;
  subtitle?: string;
  options: StepOption[];
  selected: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

const LineBuilderStep = ({ title, subtitle, options, selected, onSelect, multiSelect = false }: LineBuilderStepProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 min-h-[130px] text-center transition-all duration-200',
                'hover:scale-[1.03] hover:shadow-lg hover:border-accent/60',
                isSelected
                  ? 'border-accent bg-accent/15 shadow-md ring-2 ring-accent/30'
                  : 'border-border bg-card hover:bg-accent/5'
              )}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
              {option.icon && (
                <span className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
                  isSelected ? 'text-accent' : 'text-muted-foreground'
                )}>
                  {option.icon}
                </span>
              )}
              <span className="font-semibold text-sm leading-tight">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground leading-tight">{option.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LineBuilderStep;
