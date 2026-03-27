import { useState, useMemo, useCallback } from 'react';
import {
  Droplets, Gauge, Package, Wrench, Beaker, Wind, FlaskRound,
  Wheat, GaugeCircle, Factory, Zap, Wine, Cylinder, Box,
  Package as JarIcon, Container, Ruler,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import LineBuilderStep, { StepOption } from './LineBuilderStep';
import LineSummary from './LineSummary';

const PRODUCT_TYPES = ['liquid', 'semi-fluid', 'viscous', 'powder'] as const;
const CAPACITIES = ['small', 'medium', 'large', 'industrial'] as const;
const PACKAGING = ['glass', 'pet', 'tin', 'pouch', 'jar', 'ibc'] as const;
const VOLUMES = ['0.25L', '0.5L', '1L', '2L', '5L', '10L', '25L'] as const;
const EQUIPMENT = ['filler', 'capper', 'labeler', 'shrink', 'conveyor', 'uv', 'accumulation'] as const;

type ProductType = typeof PRODUCT_TYPES[number];
type Packaging = typeof PACKAGING[number];

function getRecommendedEquipment(product: ProductType, pkg: Packaging): string[] {
  const base = ['filler', 'conveyor'];
  if (['glass', 'pet', 'jar'].includes(pkg)) base.push('capper');
  base.push('labeler');
  if (['glass', 'pet', 'tin'].includes(pkg)) base.push('shrink');
  if (['liquid', 'semi-fluid'].includes(product)) base.push('uv');
  return base;
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  liquid: <Droplets className="h-8 w-8" />,
  'semi-fluid': <Beaker className="h-8 w-8" />,
  viscous: <FlaskRound className="h-8 w-8" />,
  powder: <Wheat className="h-8 w-8" />,
};

const CAPACITY_ICONS: Record<string, React.ReactNode> = {
  small: <Gauge className="h-8 w-8" />,
  medium: <GaugeCircle className="h-8 w-8" />,
  large: <Factory className="h-8 w-8" />,
  industrial: <Zap className="h-8 w-8" />,
};

const PACKAGING_ICONS: Record<string, React.ReactNode> = {
  glass: <Wine className="h-8 w-8" />,
  pet: <Cylinder className="h-8 w-8" />,
  tin: <Box className="h-8 w-8" />,
  pouch: <Package className="h-8 w-8" />,
  jar: <JarIcon className="h-8 w-8" />,
  ibc: <Container className="h-8 w-8" />,
};

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  filler: <Droplets className="h-8 w-8" />,
  capper: <Wrench className="h-8 w-8" />,
  labeler: <Package className="h-8 w-8" />,
  shrink: <Box className="h-8 w-8" />,
  conveyor: <Factory className="h-8 w-8" />,
  uv: <Zap className="h-8 w-8" />,
  accumulation: <Container className="h-8 w-8" />,
};

const LineBuilder = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [productType, setProductType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [packaging, setPackaging] = useState('');
  const [packagingVolume, setPackagingVolume] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [autoApplied, setAutoApplied] = useState(false);

  const TOTAL_STEPS = 5;

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
    '0.25L': '0.25 L (250 ml)',
    '0.5L': '0.5 L (500 ml)',
    '1L': '1 L',
    '2L': '2 L',
    '5L': '5 L',
    '10L': '10 L',
    '25L': '25 L+',
    filler: t('lineBuilder.equipment.filler'),
    capper: t('lineBuilder.equipment.capper'),
    labeler: t('lineBuilder.equipment.labeler'),
    shrink: t('lineBuilder.equipment.shrink'),
    conveyor: t('lineBuilder.equipment.conveyor'),
    uv: t('lineBuilder.equipment.uv'),
    accumulation: t('lineBuilder.equipment.accumulation'),
  }), [t]);

  const productOptions: StepOption[] = PRODUCT_TYPES.map(id => ({
    id,
    label: allLabels[id],
    description: t(`lineBuilder.product.${id}.desc`),
    icon: PRODUCT_ICONS[id],
  }));

  const capacityOptions: StepOption[] = CAPACITIES.map(id => ({
    id,
    label: allLabels[id],
    description: t(`lineBuilder.capacity.${id}.desc`),
    icon: CAPACITY_ICONS[id],
  }));

  const packagingOptions: StepOption[] = PACKAGING.map(id => ({
    id,
    label: allLabels[id],
    icon: PACKAGING_ICONS[id],
  }));

  const volumeOptions: StepOption[] = VOLUMES.map(id => ({
    id,
    label: allLabels[id],
    icon: <Ruler className="h-8 w-8" />,
  }));

  const equipmentOptions: StepOption[] = EQUIPMENT.map(id => ({
    id,
    label: allLabels[id],
    icon: EQUIPMENT_ICONS[id],
  }));

  const goToStep = useCallback((s: number) => {
    if (s === 4 && !autoApplied && productType && packaging) {
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

  const handleReset = () => {
    setStep(0);
    setProductType('');
    setCapacity('');
    setPackaging('');
    setPackagingVolume('');
    setEquipment([]);
    setAutoApplied(false);
  };

  const stepTitles = [
    t('lineBuilder.step1'),
    t('lineBuilder.step2'),
    t('lineBuilder.step3'),
    t('lineBuilder.step4volume'),
    t('lineBuilder.step5'),
  ];

  const completedSteps = [productType, capacity, packaging, packagingVolume, equipment.length > 0 ? 'ok' : ''].filter(Boolean).length;
  const progressValue = (completedSteps / TOTAL_STEPS) * 100;

  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">{t('lineBuilder.title')}</h2>
        <p className="text-muted-foreground">{t('lineBuilder.subtitle')}</p>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          {stepTitles.map((title, i) => {
            const canClick = i === 0 ||
              (i === 1 && !!productType) ||
              (i === 2 && !!capacity) ||
              (i === 3 && !!packaging) ||
              (i === 4 && !!packagingVolume);
            return (
              <button
                key={i}
                onClick={() => canClick && goToStep(i)}
                className={`transition-colors ${i <= step ? 'text-accent font-semibold' : ''} ${canClick ? 'cursor-pointer hover:text-accent' : 'cursor-default'}`}
              >
                {title}
              </button>
            );
          })}
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
            title={t('lineBuilder.step4volume')}
            subtitle={t('lineBuilder.step4volume.desc')}
            options={volumeOptions}
            selected={packagingVolume ? [packagingVolume] : []}
            onSelect={handleSelect(setPackagingVolume, 4)}
          />
        )}
        {step === 4 && (
          <LineBuilderStep
            title={t('lineBuilder.step5')}
            subtitle={t('lineBuilder.step5.desc')}
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
          packagingVolume={packagingVolume}
          equipment={equipment}
          labels={allLabels}
        />
      </div>
    </section>
  );
};

export default LineBuilder;
