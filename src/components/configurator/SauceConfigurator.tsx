import { useState } from 'react';
import { Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { sosPackages, saucePackageOrder } from '@/data/sauceData';
import { cn } from '@/lib/utils';

interface SauceConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

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
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-2">
          {language === 'tr' ? 'Sos Hattı Seçimi' : 'Sauce Line Selection'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {language === 'tr' ? 'İhtiyacınıza uygun sos üretim hattını seçin.' : 'Choose the sauce production line that fits your needs.'}
        </p>
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
                'relative rounded-xl border-2 transition-all duration-200 overflow-hidden',
                isSelected
                  ? 'border-accent shadow-lg ring-2 ring-accent/30'
                  : 'border-border hover:border-accent/40 hover:shadow-md'
              )}
            >
              {pkg.popular && (
                <div className="bg-accent text-accent-foreground text-center py-1 text-xs font-bold flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" /> {language === 'tr' ? 'En Çok Tercih Edilen' : 'Most Popular'}
                </div>
              )}

              <button
                onClick={() => handleSelect(id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-bold">{pkg.name}</h4>
                    <p className="text-2xl font-bold text-accent mt-1">{pkg.capacity}</p>
                  </div>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary rounded p-2">
                    <span className="text-muted-foreground block">{language === 'tr' ? 'Tank' : 'Tanks'}</span>
                    <span className="font-semibold">{pkg.specs.tankCount}x</span>
                  </div>
                  <div className="bg-secondary rounded p-2">
                    <span className="text-muted-foreground block">{language === 'tr' ? 'Isı Kontrol' : 'Heat Control'}</span>
                    <span className="font-semibold">{pkg.specs.heatControl}</span>
                  </div>
                  <div className="bg-secondary rounded p-2">
                    <span className="text-muted-foreground block">{language === 'tr' ? 'Otomasyon' : 'Automation'}</span>
                    <span className="font-semibold">{pkg.specs.automation}</span>
                  </div>
                  <div className="bg-secondary rounded p-2">
                    <span className="text-muted-foreground block">CIP</span>
                    <span className="font-semibold">{pkg.specs.cip}</span>
                  </div>
                </div>
              </button>

              {/* Expand/Collapse Details */}
              <button
                onClick={() => setExpandedLine(isExpanded ? null : id)}
                className="w-full border-t border-border px-6 py-2 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                {isExpanded ? (
                  <>{language === 'tr' ? 'Detayları Gizle' : 'Hide Details'} <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>{language === 'tr' ? 'Detayları Göster' : 'Show Details'} <ChevronDown className="h-3 w-3" /></>
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">
                      {language === 'tr' ? 'Dahil Ekipmanlar' : 'Included Equipment'}
                    </h5>
                    <ul className="space-y-1">
                      {pkg.includedEquipment.map((item, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <Check className="h-3 w-3 text-accent shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">
                      {language === 'tr' ? 'Opsiyonel' : 'Optional'}
                    </h5>
                    <ul className="space-y-1">
                      {pkg.optionalEquipment.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground">+ {item}</li>
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
