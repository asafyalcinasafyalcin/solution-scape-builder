import { useState } from 'react';
import { Check, ChevronRight, Thermometer, Gauge, Filter, Wind, Flame, CookingPot, Milk, PackageCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { dairyMachines } from '@/data/dairyData';
import { cn } from '@/lib/utils';

interface DairyConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

const machineIcons: Record<string, React.ReactNode> = {
  pasteurizer: <Thermometer className="h-8 w-8" />,
  homogenizer: <Gauge className="h-8 w-8" />,
  'cream-separator': <Filter className="h-8 w-8" />,
  clarificator: <Wind className="h-8 w-8" />,
  'vacuum-evaporator': <Flame className="h-8 w-8" />,
  'butter-churn': <CookingPot className="h-8 w-8" />,
  'cooker-line': <CookingPot className="h-8 w-8" />,
  'yogurt-filler': <PackageCheck className="h-8 w-8" />,
};

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
    <div className="space-y-10 animate-fade-in">
      {/* Step 1: Machine Selection */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
          {language === 'tr' ? 'MAKİNE KATEGORİSİ' : 'MACHINE CATEGORY'}
        </span>
        <h3 className="text-2xl font-light mb-6">
          {language === 'tr' ? 'İhtiyacınız olan süt prosesi ekipmanını seçin' : 'Choose the dairy process equipment you need'}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dairyMachines.map((m) => {
            const isSelected = selectedMachine === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMachineSelect(m.id)}
                className={cn(
                  'relative flex flex-col rounded-2xl border-2 border-t-2 p-5 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-premium-lg min-h-[180px]',
                  isSelected
                    ? 'border-amber border-t-amber bg-amber/5 shadow-premium-lg ring-2 ring-amber/30'
                    : 'border-border border-t-amber/30 bg-card hover:border-amber/40 shadow-premium'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl mb-3 transition-colors',
                  isSelected ? 'bg-amber text-amber-foreground' : 'bg-gradient-to-br from-navy to-navy-dark text-white'
                )}>
                  {machineIcons[m.id] || <Milk className="h-8 w-8" />}
                </div>

                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-amber-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
                <span className="text-lg font-bold">{language === 'tr' ? m.nameTr : m.name}</span>
                <span className="text-xs text-steel mt-2 line-clamp-2">{m.description}</span>
                <div className="flex flex-wrap gap-1 mt-3">
                  {m.useCases.slice(0, 3).map((uc, i) => (
                    <span key={i} className="text-[10px] bg-warm-gray rounded-md px-1.5 py-0.5">{uc}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Capacity Selection */}
      {machine && (
        <div className="animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
            {language === 'tr' ? 'KAPASİTE SEÇİMİ' : 'CAPACITY SELECTION'}
          </span>
          <h3 className="text-2xl font-light mb-6">
            {language === 'tr' ? `${machine.nameTr} — İhtiyacınıza uygun kapasiteyi seçin` : `${machine.name} — Select the right capacity`}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {machine.capacities.map((cap) => {
              const isSelected = selectedCapacity === cap.value;
              return (
                <button
                  key={cap.value}
                  onClick={() => handleCapacitySelect(cap.value)}
                  className={cn(
                    'flex flex-col rounded-2xl border-2 p-4 text-left transition-all duration-300 hover:shadow-premium hover:scale-[1.02]',
                    isSelected
                      ? 'border-amber bg-amber/5 ring-2 ring-amber/30 shadow-premium'
                      : 'border-border hover:border-amber/40'
                  )}
                >
                  {isSelected && (
                    <Check className="h-4 w-4 text-amber self-end" strokeWidth={3} />
                  )}
                  <span className="text-lg font-bold">{cap.label}</span>
                  <span className="text-xs text-steel mt-1">{cap.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Tech Specs */}
      {machine && selectedCapacity && (
        <div className="rounded-2xl border border-border-strong p-6 shadow-premium animate-fade-in">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
            {language === 'tr' ? 'TEKNİK ÖZELLİKLER' : 'TECHNICAL SPECIFICATIONS'}
          </span>
          <h3 className="text-xl font-light mb-4">
            {language === 'tr' ? `${machine.nameTr} — Teknik Detaylar` : `${machine.name} — Technical Details`}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {machine.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-warm-gray p-3 transition-all hover:shadow-premium">
                <ChevronRight className="h-4 w-4 text-amber shrink-0" />
                <div>
                  <span className="text-xs text-steel block">{spec.label}</span>
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
