import { useState } from 'react';
import { Check, Star, Factory, Boxes, Zap, Crown, Grape, Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, optionalItems, packageOrder, comparisonFeatures, formatPrice, calculateTotal } from '@/data/maclineData';
import { cn } from '@/lib/utils';

interface MaclineConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

const packageIcons: Record<string, React.ReactNode> = {
  eco: <Factory className="h-8 w-8" />,
  plus: <Boxes className="h-8 w-8" />,
  pro: <Zap className="h-8 w-8" />,
  premium: <Crown className="h-8 w-8" />,
  juice: <Grape className="h-8 w-8" />,
};

const MaclineConfigurator = ({ onConfigChange }: MaclineConfiguratorProps) => {
  const { t, language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [inputBrix, setInputBrix] = useState(5);
  const [targetBrix, setTargetBrix] = useState(32);
  const [workHours, setWorkHours] = useState(16);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSelectPackage = (id: string) => {
    setSelectedPackage(id);
    const pkg = packages[id];
    onConfigChange({
      type: 'macline',
      package: pkg.name,
      capacity: pkg.capacity,
      products: pkg.products.join(', '),
    });
  };

  // Brix Calculator Logic
  const rawCapacityKg = 6000; // base daily capacity per line
  const dailyRawMaterial = rawCapacityKg * (workHours / 8);
  const dailyPasteOutput = Math.round((dailyRawMaterial * inputBrix) / targetBrix);
  const concentrationRatio = (targetBrix / inputBrix).toFixed(1);

  const recommendedPackage = (() => {
    if (dailyPasteOutput <= 1500) return 'eco';
    if (dailyPasteOutput <= 3000) return 'plus';
    if (dailyPasteOutput <= 5000) return 'pro';
    return 'premium';
  })();

  const total = calculateTotal(selectedPackage, selectedAddons);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Brix / Capacity Calculator */}
      <div className="rounded-2xl border border-border-strong bg-surface p-6 md:p-8 shadow-premium">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-dark text-white">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {language === 'tr' ? 'Brix / Kapasite Hesaplayıcı' : 'Brix / Capacity Calculator'}
            </h3>
            <p className="text-sm text-steel">
              {language === 'tr' ? 'Hammadde ve hedef brix değerlerine göre günlük üretim kapasitesini hesaplayın.' : 'Calculate daily production based on raw material and target Brix values.'}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-steel">
              {language === 'tr' ? 'Hammadde Brix' : 'Input Brix'}
            </label>
            <Slider
              value={[inputBrix]}
              onValueChange={([v]) => setInputBrix(v)}
              min={4}
              max={8}
              step={0.5}
              className="mt-2"
            />
            <div className="text-3xl font-bold text-amber">{inputBrix}°Bx</div>
            <p className="text-xs text-steel">{language === 'tr' ? 'Domates: 4-6 °Bx tipik' : 'Tomato: 4-6 °Bx typical'}</p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-steel">
              {language === 'tr' ? 'Hedef Salça Brix' : 'Target Paste Brix'}
            </label>
            <Slider
              value={[targetBrix]}
              onValueChange={([v]) => setTargetBrix(v)}
              min={28}
              max={36}
              step={1}
              className="mt-2"
            />
            <div className="text-3xl font-bold text-amber">{targetBrix}°Bx</div>
            <p className="text-xs text-steel">{language === 'tr' ? 'Salça: 28-36 °Bx standart' : 'Paste: 28-36 °Bx standard'}</p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-steel">
              {language === 'tr' ? 'Günlük Çalışma Saati' : 'Working Hours/Day'}
            </label>
            <Slider
              value={[workHours]}
              onValueChange={([v]) => setWorkHours(v)}
              min={8}
              max={24}
              step={1}
              className="mt-2"
            />
            <div className="text-3xl font-bold text-amber">{workHours} {language === 'tr' ? 'saat' : 'hrs'}</div>
            <p className="text-xs text-steel">{language === 'tr' ? 'Vardiya planı' : 'Shift planning'}</p>
          </div>
        </div>

        {/* Calculator Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border-strong bg-card p-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-steel block mb-1">
              {language === 'tr' ? 'Günlük Hammadde' : 'Daily Raw Material'}
            </span>
            <span className="text-2xl font-bold">{dailyRawMaterial.toLocaleString('tr-TR')} kg</span>
          </div>
          <div className="rounded-xl border border-border-strong bg-card p-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-steel block mb-1">
              {language === 'tr' ? 'Günlük Salça Çıktısı' : 'Daily Paste Output'}
            </span>
            <span className="text-2xl font-bold text-amber">{dailyPasteOutput.toLocaleString('tr-TR')} kg</span>
          </div>
          <div className="rounded-xl border border-border-strong bg-card p-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-steel block mb-1">
              {language === 'tr' ? 'Konsantrasyon Oranı' : 'Concentration Ratio'}
            </span>
            <span className="text-2xl font-bold">{concentrationRatio}:1</span>
          </div>
          <div className="rounded-xl border-2 border-amber/50 bg-amber/5 p-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber block mb-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {language === 'tr' ? 'Önerilen Paket' : 'Recommended'}
            </span>
            <span className="text-2xl font-bold text-amber">{packages[recommendedPackage]?.name.split(' ')[1]}</span>
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <div>
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
            {language === 'tr' ? 'PAKET SEÇİMİ' : 'SELECT PACKAGE'}
          </span>
          <h3 className="text-2xl font-light">
            {language === 'tr' ? 'İhtiyacınıza uygun MACLINE paketini seçin' : 'Choose the MACLINE package that fits your needs'}
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {packageOrder.map((id) => {
            const pkg = packages[id];
            const isSelected = selectedPackage === id;
            const isRecommended = recommendedPackage === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectPackage(id)}
                className={cn(
                  'relative flex flex-col rounded-2xl border-2 border-t-2 p-5 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-premium-lg',
                  isSelected
                    ? 'border-amber border-t-amber bg-amber/5 shadow-premium-lg ring-2 ring-amber/30'
                    : isRecommended
                    ? 'border-border-strong border-t-amber/50 bg-card shadow-premium'
                    : 'border-border bg-card hover:border-amber/40 shadow-premium'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-colors',
                  isSelected
                    ? 'bg-amber text-amber-foreground'
                    : 'bg-gradient-to-br from-navy to-navy-dark text-white'
                )}>
                  {packageIcons[id]}
                </div>

                {pkg.isPopular && (
                  <span className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-amber px-3 py-0.5 text-xs font-bold text-amber-foreground">
                    <Star className="h-3 w-3" /> {language === 'tr' ? 'Popüler' : 'Popular'}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-amber-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
                <span className="text-lg font-bold">{pkg.name}</span>
                <span className="text-2xl font-bold text-amber mt-2">{formatPrice(pkg.price, pkg.currency)}</span>
                <span className="text-xs text-steel mt-1">{pkg.capacity}</span>
                <div className="mt-3 flex flex-wrap gap-1">
                  {pkg.products.map((p, i) => (
                    <span key={i} className="text-xs bg-warm-gray rounded-md px-1.5 py-0.5">{p}</span>
                  ))}
                </div>
                <span className="text-xs text-steel mt-3 line-clamp-2">{pkg.idealFor}</span>
                {pkg.dualLine && (
                  <span className="mt-2 text-xs font-semibold text-amber">⚡ {language === 'tr' ? 'Çift Hat' : 'Dual Line'}: {pkg.dualLineCapacity}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Comparison Table - Always visible */}
      <div className="rounded-2xl border border-border-strong bg-card shadow-premium overflow-hidden">
        <div className="border-b border-border-strong px-6 py-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-1 block">
            {language === 'tr' ? 'TEKNİK KARŞILAŞTIRMA' : 'TECHNICAL COMPARISON'}
          </span>
          <h3 className="text-xl font-light">
            {language === 'tr' ? 'Tüm MACLINE paketleri yan yana' : 'All MACLINE packages side by side'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-strong">
                <th className="p-4 text-left font-medium text-steel min-w-[140px]">{language === 'tr' ? 'Özellik' : 'Feature'}</th>
                {packageOrder.map(id => (
                  <th key={id} className={cn(
                    'p-4 text-center font-bold min-w-[120px] transition-colors',
                    selectedPackage === id && 'bg-amber/10 text-amber'
                  )}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        selectedPackage === id ? 'bg-amber text-amber-foreground' : 'bg-gradient-to-br from-navy to-navy-dark text-white'
                      )}>
                        {packageIcons[id]}
                      </div>
                      {packages[id].name.split(' ')[1]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 text-steel font-medium">{language === 'tr' ? 'Fiyat' : 'Price'}</td>
                {packageOrder.map(id => (
                  <td key={id} className={cn('p-4 text-center font-bold text-amber', selectedPackage === id && 'bg-amber/10')}>
                    {formatPrice(packages[id].price, packages[id].currency)}
                  </td>
                ))}
              </tr>
              {comparisonFeatures.map((feat) => (
                <tr key={feat.key} className="border-b border-border last:border-0">
                  <td className="p-4 text-steel font-medium">{language === 'tr' ? feat.label : feat.labelEn}</td>
                  {packageOrder.map(id => {
                    const pkg = packages[id];
                    let value: string;
                    switch (feat.key) {
                      case 'products': value = pkg.products.join(', '); break;
                      case 'capacity': value = pkg.capacity; break;
                      case 'dualLine': value = pkg.dualLine ? `✅ ${pkg.dualLineCapacity}` : '—'; break;
                      case 'electricity': value = pkg.electricity; break;
                      case 'steam': value = pkg.steam; break;
                      case 'water': value = pkg.water; break;
                      case 'idealFor': value = pkg.idealFor; break;
                      default: value = '—';
                    }
                    return (
                      <td key={id} className={cn('p-4 text-center text-xs', selectedPackage === id && 'bg-amber/10')}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional Items */}
      {selectedPackage && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-2 block">
              {language === 'tr' ? 'OPSİYONEL EKİPMANLAR' : 'OPTIONAL EQUIPMENT'}
            </span>
            <h3 className="text-xl font-light">
              {language === 'tr' ? 'İhtiyacınıza göre ek ekipman seçin' : 'Select additional equipment as needed'}
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {optionalItems.map(item => {
              const isSelected = selectedAddons.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAddon(item.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-300 hover:shadow-premium hover:scale-[1.02]',
                    isSelected ? 'border-amber bg-amber/5 shadow-premium' : 'border-border hover:border-amber/40'
                  )}
                >
                  <span className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    isSelected ? 'border-amber bg-amber text-amber-foreground' : 'border-steel'
                  )}>
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block">{item.name}</span>
                    <span className="text-sm font-bold text-amber">{formatPrice(item.price, item.currency)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      {selectedPackage && (
        <div className="rounded-2xl border-2 border-amber/30 bg-amber/5 p-6 shadow-premium-lg animate-scale-in">
          <h3 className="text-lg font-bold mb-3">{language === 'tr' ? 'Toplam Fiyat' : 'Total Price'}</h3>
          <div className="flex flex-wrap gap-6">
            {total.usd > 0 && (
              <div>
                <span className="text-3xl font-bold text-amber">{formatPrice(total.usd, 'USD')}</span>
              </div>
            )}
            {total.eur > 0 && (
              <div>
                <span className="text-2xl font-bold text-amber">+ {formatPrice(total.eur, 'EUR')}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-steel mt-2">
            {language === 'tr' ? 'Fiyatlar EXW bazında olup KDV hariçtir.' : 'Prices are EXW basis, VAT excluded.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MaclineConfigurator;
