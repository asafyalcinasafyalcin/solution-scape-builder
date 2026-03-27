import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Gauge, Package, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import LineBuilderStep from './LineBuilderStep';
import LineSummary from './LineSummary';

const PRODUCT_TYPES = ['liquid', 'semi-fluid', 'viscous', 'powder'] as const;
const CAPACITIES = ['small', 'medium', 'large', 'industrial'] as const;
const PACKAGING = ['glass', 'pet', 'tin', 'pouch', 'jar', 'ibc'] as const;
const EQUIPMENT = ['filler', 'capper', 'labeler', 'shrink', 'conveyor', 'uv', 'accumulation'] as const;

type ProductType = typeof PRODUCT_TYPES[number];
type Packaging = typeof PACKAGING[number];

// Recommendation logic
function getRecommendedEquipment(product: ProductType, pkg: Packaging): string[] {
  const base = ['filler', 'conveyor'];
  
  // Capper recommendations based on packaging
  if (['glass', 'pet', 'jar'].includes(pkg)) base.push('capper');
  
  // Labeler almost always needed
  base.push('labeler');
  
  // Shrink for bottles and cans
  if (['glass', 'pet', 'tin'].includes(pkg)) base.push('shrink');
  
  // UV for food-grade
  if (['liquid', 'semi-fluid'].includes(product)) base.push('uv');
  
  return base;
}

const LineBuilder = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [packaging, setPackaging] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [autoApplied, setAutoApplied] = useState(false);

  const allLabels: Record<string, string> = useMemo(() => ({
    liquid: t('lineBuilder.product.liquid'),
    'semi-fluid': t('lineBuilder.product.semiFluid'),
    viscous: t('lineBuilder.product.viscous'),
    powder: t('lineBuilder.product.powder'),
    small: t('lineBuilder.capacity.small'),
    medium: t('lineBuilder.capacity.medium'),
    large: t('lineBuilder.capacity.large'),
    industrial: t('lineBuilder.capacity.industrial'),
    glass: t('lineBuilder.packaging.glass'),
    pet: t('lineBuilder.packaging.pet'),
    tin: t('lineBuilder.packaging.tin'),
    pouch: t('lineBuilder.packaging.pouch'),
    jar: t('lineBuilder.packaging.jar'),
    ibc: t('lineBuilder.packaging.ibc'),
    filler: t('lineBuilder.equipment.filler'),
    capper: t('lineBuilder.equipment.capper'),
    labeler: t('lineBuilder.equipment.labeler'),
    shrink: t('lineBuilder.equipment.shrink'),
    conveyor: t('lineBuilder.equipment.conveyor'),
    uv: t('lineBuilder.equipment.uv'),
    accumulation: t('lineBuilder.equipment.accumulation'),
  }), [t]);

  const productOptions = PRODUCT_TYPES.map(id => ({
    id,
    label: allLabels[id],
    description: t(`lineBuilder.product.${id}.desc`),
  }));

  const capacityOptions = CAPACITIES.map(id => ({
    id,
    label: allLabels[id],
    description: t(`lineBuilder.capacity.${id}.desc`),
  }));

  const packagingOptions = PACKAGING.map(id => ({
    id,
    label: allLabels[id],
  }));

  const equipmentOptions = EQUIPMENT.map(id => ({
    id,
    label: allLabels[id],
  }));

  // Auto-apply recommendations when reaching step 3
  const goToStep = useCallback((s: number) => {
    if (s === 3 && !autoApplied && productType && packaging) {
      const recommended = getRecommendedEquipment(productType as ProductType, packaging as Packaging);
      setEquipment(recommended);
      setAutoApplied(true);
    }
    setStep(s);
  }, [autoApplied, productType, packaging]);

  const handleSelect = (setter: (v: string) => void, nextStep: number) => (id: string) => {
    setter(id);
    setTimeout(() => goToStep(nextStep), 200);
  };

  const toggleEquipment = (id: string) => {
    setEquipment(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleGetQuote = () => {
    const params = new URLSearchParams({
      product: allLabels[productType] || '',
      capacity: allLabels[capacity] || '',
      packaging: allLabels[packaging] || '',
      equipment: equipment.map(e => allLabels[e]).join(', '),
    });
    navigate(`/iletisim?${params.toString()}`);
  };

  const handleReset = () => {
    setStep(0);
    setProductType('');
    setCapacity('');
    setPackaging('');
    setEquipment([]);
    setAutoApplied(false);
  };

  const stepTitles = [
    t('lineBuilder.step1'),
    t('lineBuilder.step2'),
    t('lineBuilder.step3'),
    t('lineBuilder.step4'),
  ];

  const progressValue = productType ? (capacity ? (packaging ? (equipment.length > 0 ? 100 : 75) : 50) : 25) : 0;

  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">{t('lineBuilder.title')}</h2>
        <p className="text-muted-foreground">{t('lineBuilder.subtitle')}</p>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          {stepTitles.map((title, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === 0) goToStep(0);
                else if (i === 1 && productType) goToStep(1);
                else if (i === 2 && capacity) goToStep(2);
                else if (i === 3 && packaging) goToStep(3);
              }}
              className={`transition-colors ${i <= step ? 'text-accent font-semibold' : ''} ${
                (i === 0) || (i === 1 && productType) || (i === 2 && capacity) || (i === 3 && packaging)
                  ? 'cursor-pointer hover:text-accent'
                  : 'cursor-default'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Steps */}
      <div className="mt-8">
        {step === 0 && (
          <LineBuilderStep
            title={t('lineBuilder.step1')}
            subtitle={t('lineBuilder.step1.desc')}
            options={productOptions}
            selected={productType ? [productType] : []}
            onSelect={handleSelect(setProductType, 1)}
          />
        )}
        {step === 1 && (
          <LineBuilderStep
            title={t('lineBuilder.step2')}
            subtitle={t('lineBuilder.step2.desc')}
            options={capacityOptions}
            selected={capacity ? [capacity] : []}
            onSelect={handleSelect(setCapacity, 2)}
          />
        )}
        {step === 2 && (
          <LineBuilderStep
            title={t('lineBuilder.step3')}
            subtitle={t('lineBuilder.step3.desc')}
            options={packagingOptions}
            selected={packaging ? [packaging] : []}
            onSelect={(id) => {
              setPackaging(id);
              setAutoApplied(false);
              setTimeout(() => goToStep(3), 200);
            }}
          />
        )}
        {step === 3 && (
          <LineBuilderStep
            title={t('lineBuilder.step4')}
            subtitle={t('lineBuilder.step4.desc')}
            options={equipmentOptions}
            selected={equipment}
            onSelect={toggleEquipment}
            multiSelect
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <Button variant="outline" onClick={() => goToStep(step - 1)}>
            {t('common.back')}
          </Button>
        )}
        {progressValue > 0 && (
          <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
            {t('lineBuilder.reset')}
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8">
        <LineSummary
          productType={productType}
          capacity={capacity}
          packaging={packaging}
          equipment={equipment}
          labels={allLabels}
          onGetQuote={handleGetQuote}
        />
      </div>
    </section>
  );
};

export default LineBuilder;
