import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, optionalItems, packageOrder, formatPrice, calculateTotal } from '@/data/maclineData';
import { cn } from '@/lib/utils';

interface MaclineConfiguratorProps {
  onConfigChange: (config: Record<string, string>) => void;
}

const MaclineConfigurator = ({ onConfigChange }: MaclineConfiguratorProps) => {
  const { t, language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

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

  const total = calculateTotal(selectedPackage, selectedAddons);

  return (
    <div className="space-y-12">
      {/* Package Selection */}
      <div>
        <h3 className="text-xl font-bold mb-2">
          {language === 'tr' ? 'Paket Seçimi' : 'Select Package'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {language === 'tr' ? 'İhtiyacınıza uygun MACLINE paketini seçin.' : 'Choose the MACLINE package that fits your needs.'}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {packageOrder.map((id) => {
            const pkg = packages[id];
            const isSelected = selectedPackage === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectPackage(id)}
                className={cn(
                  'relative flex flex-col rounded-xl border-2 p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-md ring-2 ring-accent/30'
                    : 'border-border bg-card hover:border-accent/40'
                )}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-foreground">
                    <Star className="h-3 w-3" /> {language === 'tr' ? 'Popüler' : 'Popular'}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
                <span className="text-lg font-bold">{pkg.name}</span>
                <span className="text-2xl font-bold text-accent mt-2">{formatPrice(pkg.price, pkg.currency)}</span>
                <span className="text-xs text-muted-foreground mt-1">{pkg.capacity}</span>
                <div className="mt-3 flex flex-wrap gap-1">
                  {pkg.products.map((p, i) => (
                    <span key={i} className="text-xs bg-secondary rounded px-1.5 py-0.5">{p}</span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground mt-3 line-clamp-2">{pkg.idealFor}</span>
                {pkg.dualLine && (
                  <span className="mt-2 text-xs font-semibold text-accent">⚡ {language === 'tr' ? 'Çift Hat' : 'Dual Line'}: {pkg.dualLineCapacity}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedPackage && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-bold mb-4">
            {language === 'tr' ? 'Teknik Karşılaştırma' : 'Technical Comparison'}
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-medium text-muted-foreground">{language === 'tr' ? 'Özellik' : 'Feature'}</th>
                {packageOrder.map(id => (
                  <th key={id} className={cn('p-3 text-center font-bold', selectedPackage === id && 'bg-accent/10')}>
                    {packages[id].name.split(' ')[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 text-muted-foreground">{language === 'tr' ? 'Fiyat' : 'Price'}</td>
                {packageOrder.map(id => (
                  <td key={id} className={cn('p-3 text-center font-semibold', selectedPackage === id && 'bg-accent/10')}>
                    {formatPrice(packages[id].price, packages[id].currency)}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 text-muted-foreground">{language === 'tr' ? 'Kapasite' : 'Capacity'}</td>
                {packageOrder.map(id => (
                  <td key={id} className={cn('p-3 text-center', selectedPackage === id && 'bg-accent/10')}>
                    {packages[id].capacity}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 text-muted-foreground">{language === 'tr' ? 'Ürünler' : 'Products'}</td>
                {packageOrder.map(id => (
                  <td key={id} className={cn('p-3 text-center text-xs', selectedPackage === id && 'bg-accent/10')}>
                    {packages[id].products.join(', ')}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 text-muted-foreground">{language === 'tr' ? 'Elektrik' : 'Electricity'}</td>
                {packageOrder.map(id => (
                  <td key={id} className={cn('p-3 text-center', selectedPackage === id && 'bg-accent/10')}>
                    {packages[id].electricity}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Optional Items */}
      {selectedPackage && (
        <div>
          <h3 className="text-xl font-bold mb-2">
            {language === 'tr' ? 'Opsiyonel Ekipmanlar' : 'Optional Equipment'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'tr' ? 'İhtiyacınıza göre ek ekipman seçin.' : 'Select additional equipment as needed.'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {optionalItems.map(item => {
              const isSelected = selectedAddons.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAddon(item.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all hover:shadow-sm',
                    isSelected ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/40'
                  )}
                >
                  <span className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border-muted-foreground'
                  )}>
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block">{item.name}</span>
                    <span className="text-sm font-bold text-accent">{formatPrice(item.price, item.currency)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Total */}
      {selectedPackage && (
        <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
          <h3 className="text-lg font-bold mb-3">{language === 'tr' ? 'Toplam Fiyat' : 'Total Price'}</h3>
          <div className="flex flex-wrap gap-6">
            {total.usd > 0 && (
              <div>
                <span className="text-3xl font-bold text-accent">{formatPrice(total.usd, 'USD')}</span>
              </div>
            )}
            {total.eur > 0 && (
              <div>
                <span className="text-2xl font-bold text-accent">+ {formatPrice(total.eur, 'EUR')}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {language === 'tr' ? 'Fiyatlar EXW bazında olup KDV hariçtir.' : 'Prices are EXW basis, VAT excluded.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MaclineConfigurator;
