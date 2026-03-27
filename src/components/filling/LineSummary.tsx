import { ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface LineSummaryProps {
  productType: string;
  capacity: string;
  packaging: string;
  equipment: string[];
  labels: Record<string, string>;
  onGetQuote: () => void;
}

const LineSummary = ({ productType, capacity, packaging, equipment, labels, onGetQuote }: LineSummaryProps) => {
  const { t } = useLanguage();

  if (!productType || !capacity || !packaging || equipment.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-accent bg-accent/5 p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6">{t('lineBuilder.summary')}</h3>

      {/* Config summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-lg bg-background p-4 border">
          <span className="text-xs text-muted-foreground">{t('lineBuilder.step1')}</span>
          <p className="font-semibold mt-1">{labels[productType]}</p>
        </div>
        <div className="rounded-lg bg-background p-4 border">
          <span className="text-xs text-muted-foreground">{t('lineBuilder.step2')}</span>
          <p className="font-semibold mt-1">{labels[capacity]}</p>
        </div>
        <div className="rounded-lg bg-background p-4 border">
          <span className="text-xs text-muted-foreground">{t('lineBuilder.step3')}</span>
          <p className="font-semibold mt-1">{labels[packaging]}</p>
        </div>
      </div>

      {/* Equipment flow */}
      <div className="mb-8">
        <span className="text-sm font-medium text-muted-foreground mb-3 block">{t('lineBuilder.step4')}</span>
        <div className="flex flex-wrap items-center gap-2">
          {equipment.map((eq, idx) => (
            <div key={eq} className="flex items-center gap-2">
              <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                {labels[eq]}
              </span>
              {idx < equipment.length - 1 && (
                <ArrowRight className="h-4 w-4 text-accent shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onGetQuote} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Send className="mr-2 h-4 w-4" />
        {t('lineBuilder.getQuote')}
      </Button>
    </div>
  );
};

export default LineSummary;
