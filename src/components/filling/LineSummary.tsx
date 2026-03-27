import { useState } from 'react';
import { ArrowRight, Send, CheckCircle, User, Building2, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface LineSummaryProps {
  productType: string;
  capacity: string;
  packaging: string;
  packagingVolume: string;
  equipment: string[];
  labels: Record<string, string>;
}

const TECHNICAL_EMAIL = 'info@processturk.com';

const LineSummary = ({ productType, capacity, packaging, packagingVolume, equipment, labels }: LineSummaryProps) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', note: '' });

  if (!productType || !capacity || !packaging || !packagingVolume || equipment.length === 0) return null;

  const configSummaryText = () => {
    const lines = [
      `${t('lineBuilder.step1')}: ${labels[productType]}`,
      `${t('lineBuilder.step2')}: ${labels[capacity]}`,
      `${t('lineBuilder.step3')}: ${labels[packaging]}`,
      `${t('lineBuilder.step4volume')}: ${labels[packagingVolume]}`,
      `${t('lineBuilder.step5')}: ${equipment.map(e => labels[e]).join(' → ')}`,
    ];
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Dolum Hattı Teklif Talebi - ${form.company || form.name}`);
    const body = encodeURIComponent(
      `İletişim Bilgileri:\n` +
      `Ad Soyad: ${form.name}\n` +
      `Firma: ${form.company}\n` +
      `E-posta: ${form.email}\n` +
      `Telefon: ${form.phone}\n\n` +
      `Hat Konfigürasyonu:\n${configSummaryText()}\n\n` +
      `Ek Not:\n${form.note || '-'}`
    );
    window.open(`mailto:${TECHNICAL_EMAIL}?subject=${subject}&body=${body}`, '_self');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-xl border-2 border-accent/50 bg-accent/5 p-8 text-center">
        <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">{t('lineBuilder.quote.sent')}</h3>
        <p className="text-muted-foreground">{t('lineBuilder.quote.sentDesc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-accent bg-accent/5 p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6">{t('lineBuilder.summary')}</h3>

      {/* Config summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
        <div className="rounded-lg bg-background p-4 border">
          <span className="text-xs text-muted-foreground">{t('lineBuilder.step4volume')}</span>
          <p className="font-semibold mt-1">{labels[packagingVolume]}</p>
        </div>
      </div>

      {/* Equipment flow */}
      <div className="mb-8">
        <span className="text-sm font-medium text-muted-foreground mb-3 block">{t('lineBuilder.step5')}</span>
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

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 py-6">
          <Send className="mr-2 h-5 w-5" />
          {t('lineBuilder.getQuote')}
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="border-t pt-6 mt-2 space-y-4">
          <h4 className="text-lg font-bold mb-4">{t('lineBuilder.quote.contactTitle')}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lb-name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t('contact.form.name')} *
              </Label>
              <Input id="lb-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t('contact.form.company')}
              </Label>
              <Input id="lb-company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t('contact.form.email')} *
              </Label>
              <Input id="lb-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {t('contact.form.phone')}
              </Label>
              <Input id="lb-phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lb-note" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {t('lineBuilder.quote.note')}
            </Label>
            <Textarea id="lb-note" rows={3} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
          </div>
          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 py-6">
            <Send className="mr-2 h-5 w-5" />
            {t('lineBuilder.quote.submit')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default LineSummary;
