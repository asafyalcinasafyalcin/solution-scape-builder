import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { dairyMachines } from '@/data/dairyData';
import { cn } from '@/lib/utils';

interface DairyConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

const DairyConfigurator = ({ onConfigChange }: DairyConfiguratorProps) => {
  const { language } = useLanguage();
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);

  const machine = selectedMachine ? dairyMachines.find(m => m.id === selectedMachine) : null;

  const handleMachineSelect = (id: string) => {
    setSelectedMachine(id);
    setSelectedCapacity(null);
    const m = dairyMachines.find(dm => dm.id === id);
    if (m) {
      onConfigChange({
        type: 'dairy',
        machine: language === 'tr' ? m.nameTr : m.name,
      });
    }
  };

  const handleCapacitySelect = (value: string) => {
    setSelectedCapacity(value);
    if (machine) {
      const cap = machine.capacities.find(c => c.value === value);
      onConfigChange({
        type: 'dairy',
        machine: language === 'tr' ? machine.nameTr : machine.name,
        capacity: cap?.label || value,
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Step 1: Machine Selection */}
      <div>
        <h3 className="text-xl font-bold mb-2">
          {language === 'tr' ? 'Makine Kategorisi Seçin' : 'Select Machine Category'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {language === 'tr' ? 'İhtiyacınız olan süt prosesi ekipmanını seçin.' : 'Choose the dairy process equipment you need.'}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dairyMachines.map((m) => {
            const isSelected = selectedMachine === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMachineSelect(m.id)}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg min-h-[140px]',
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-md ring-2 ring-accent/30'
                    : 'border-border bg-card hover:border-accent/40'
                )}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
                <span className="text-lg font-bold">{language === 'tr' ? m.nameTr : m.name}</span>
                <span className="text-xs text-muted-foreground mt-2 line-clamp-2">{m.description}</span>
                <div className="flex flex-wrap gap-1 mt-3">
                  {m.useCases.slice(0, 3).map((uc, i) => (
                    <span key={i} className="text-[10px] bg-secondary rounded px-1.5 py-0.5">{uc}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Capacity Selection */}
      {machine && (
        <div>
          <h3 className="text-xl font-bold mb-2">
            {language === 'tr' ? `${machine.nameTr} – Kapasite Seçimi` : `${machine.name} – Capacity Selection`}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {language === 'tr' ? 'İhtiyacınıza uygun kapasiteyi seçin.' : 'Select the capacity that fits your needs.'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {machine.capacities.map((cap) => {
              const isSelected = selectedCapacity === cap.value;
              return (
                <button
                  key={cap.value}
                  onClick={() => handleCapacitySelect(cap.value)}
                  className={cn(
                    'flex flex-col rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
                    isSelected
                      ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
                      : 'border-border hover:border-accent/40'
                  )}
                >
                  {isSelected && (
                    <Check className="h-4 w-4 text-accent self-end" strokeWidth={3} />
                  )}
                  <span className="text-lg font-bold">{cap.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{cap.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Tech Specs */}
      {machine && selectedCapacity && (
        <div className="rounded-xl border-2 border-border p-6">
          <h3 className="text-lg font-bold mb-4">
            {language === 'tr' ? 'Teknik Özellikler' : 'Technical Specifications'}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {machine.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <ChevronRight className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block">{spec.label}</span>
                  <span className="text-sm font-semibold">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DairyConfigurator;
