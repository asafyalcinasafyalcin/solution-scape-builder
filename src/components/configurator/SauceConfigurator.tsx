import { useState } from 'react';
import { Check, Star, ChevronDown, ChevronUp, Beaker, FlaskConical, Warehouse } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { sosPackages, saucePackageOrder } from '@/data/sauceData';
import { cn } from '@/lib/utils';

interface SauceConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

const lineIcons: Record<string, React.ReactNode> = {
  sauce500: <Beaker className="h-8 w-8" />,
  sauce1000: <FlaskConical className="h-8 w-8" />,
  sauce1500: <Warehouse className="h-8 w-8" />,
};

const SauceConfigurator = ({ onConfigChange }: SauceConfiguratorProps) => {
  const { language } = useLanguage();
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedLine(id);
    setExpandedLine(id);
    const pkg = sosPackages[id];
    onConfigChange({
      type: 'sauce',
      line: pkg.name,
      capacity: pkg.capacity,
      usage: pkg.usage,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
          {language === 'tr' ? 'SOS HATTI SEÇİMİ' : 'SAUCE LINE SELECTION'}
        </span>
        <h3 className="text-2xl font-light mb-2">
          {language === 'tr' ? 'İhtiyacınıza uygun sos üretim hattını seçin' : 'Choose the sauce production line that fits your needs'}
        </h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {saucePackageOrder.map((id) => {
          const pkg = sosPackages[id];
          const isSelected = selectedLine === id;
          const isExpanded = expandedLine === id;

          return (
            <div
              key={id}
              className={cn(
                'relative rounded-2xl border-2 border-t-2 transition-all duration-300 overflow-hidden hover:shadow-premium-lg hover:scale-[1.01]',
                isSelected
                  ? 'border-amber border-t-amber shadow-premium-lg ring-2 ring-amber/30'
                  : 'border-border border-t-amber/30 hover:border-amber/40 shadow-premium'
              )}
            >
              {pkg.popular && (
                <div className="bg-amber text-amber-foreground text-center py-1.5 text-xs font-bold flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" /> {language === 'tr' ? 'En Çok Tercih Edilen' : 'Most Popular'}
                </div>
              )}

              <button
                onClick={() => handleSelect(id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-xl shrink-0 transition-colors',
                      isSelected ? 'bg-amber text-amber-foreground' : 'bg-gradient-to-br from-navy to-navy-dark text-white'
                    )}>
                      {lineIcons[id]}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{pkg.name}</h4>
                      <p className="text-2xl font-bold text-amber mt-1">{pkg.capacity}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber text-amber-foreground">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-sm text-steel mt-3">{pkg.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-warm-gray rounded-lg p-2.5">
                    <span className="text-steel block">{language === 'tr' ? 'Tank' : 'Tanks'}</span>
                    <span className="font-semibold">{pkg.specs.tankCount}x</span>
                  </div>
                  <div className="bg-warm-gray rounded-lg p-2.5">
                    <span className="text-steel block">{language === 'tr' ? 'Isı Kontrol' : 'Heat Control'}</span>
                    <span className="font-semibold">{pkg.specs.heatControl}</span>
                  </div>
                  <div className="bg-warm-gray rounded-lg p-2.5">
                    <span className="text-steel block">{language === 'tr' ? 'Otomasyon' : 'Automation'}</span>
                    <span className="font-semibold">{pkg.specs.automation}</span>
                  </div>
                  <div className="bg-warm-gray rounded-lg p-2.5">
                    <span className="text-steel block">CIP</span>
                    <span className="font-semibold">{pkg.specs.cip}</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setExpandedLine(isExpanded ? null : id)}
                className="w-full border-t border-border-strong px-6 py-2.5 text-xs font-medium text-steel hover:text-foreground flex items-center justify-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>{language === 'tr' ? 'Detayları Gizle' : 'Hide Details'} <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>{language === 'tr' ? 'Detayları Göster' : 'Show Details'} <ChevronDown className="h-3 w-3" /></>
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 animate-fade-in">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-steel mb-2">
                      {language === 'tr' ? 'Dahil Ekipmanlar' : 'Included Equipment'}
                    </h5>
                    <ul className="space-y-1">
                      {pkg.includedEquipment.map((item, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <Check className="h-3 w-3 text-amber shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-steel mb-2">
                      {language === 'tr' ? 'Opsiyonel' : 'Optional'}
                    </h5>
                    <ul className="space-y-1">
                      {pkg.optionalEquipment.map((item, i) => (
                        <li key={i} className="text-xs text-steel">+ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SauceConfigurator;
