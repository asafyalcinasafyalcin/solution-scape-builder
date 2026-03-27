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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                'relative flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md',
                isSelected
                  ? 'border-accent bg-accent/10 shadow-sm'
                  : 'border-border hover:border-accent/50'
              )}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
              {option.icon && <span className="text-accent">{option.icon}</span>}
              <span className="font-semibold text-sm">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LineBuilderStep;
