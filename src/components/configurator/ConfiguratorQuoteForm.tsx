import { useState } from 'react';
import { Send, CheckCircle, User, Building2, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

const TECHNICAL_EMAIL = 'info@processturk.com';

interface ConfiguratorQuoteFormProps {
  configSummary: Record<string, string>;
  activeTab: string;
}

const ConfiguratorQuoteForm = ({ configSummary, activeTab }: ConfiguratorQuoteFormProps) => {
  const { t, language } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', note: '' });

  const hasConfig = Object.keys(configSummary).length > 0;

  const configText = () => {
    const lines: string[] = [];
    if (configSummary.type) lines.push(`Kategori: ${configSummary.type.toUpperCase()}`);
    if (configSummary.package) lines.push(`Paket: ${configSummary.package}`);
    if (configSummary.line) lines.push(`Hat: ${configSummary.line}`);
    if (configSummary.machine) lines.push(`Makine: ${configSummary.machine}`);
    if (configSummary.capacity) lines.push(`Kapasite: ${configSummary.capacity}`);
    if (configSummary.products) lines.push(`Ürünler: ${configSummary.products}`);
    if (configSummary.usage) lines.push(`Kullanım: ${configSummary.usage}`);
    // Filling line builder fields
    if (configSummary.productType) lines.push(`Ürün Tipi: ${configSummary.productType}`);
    if (configSummary.packaging) lines.push(`Ambalaj: ${configSummary.packaging}`);
    if (configSummary.volume) lines.push(`Hacim: ${configSummary.volume}`);
    if (configSummary.equipment) lines.push(`Ekipmanlar: ${configSummary.equipment}`);
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tabNames: Record<string, string> = {
      macline: 'MACLINE Salça/Domates',
      sauce: 'Sos Hatları',
      dairy: 'Süt Prosesi',
      filling: 'Dolum & Paketleme',
    };
    const subject = encodeURIComponent(`${tabNames[activeTab] || 'Konfigüratör'} Teklif Talebi - ${form.company || form.name}`);
    const body = encodeURIComponent(
      `İletişim Bilgileri:\n` +
      `Ad Soyad: ${form.name}\n` +
      `Firma: ${form.company}\n` +
      `E-posta: ${form.email}\n` +
      `Telefon: ${form.phone}\n\n` +
      `Konfigürasyon:\n${configText()}\n\n` +
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
      <h3 className="text-xl font-bold mb-2">
        {language === 'tr' ? 'Teklif Talebi' : 'Quote Request'}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {language === 'tr'
          ? 'Yukarıdaki konfigürasyonunuza göre teklif almak için bilgilerinizi doldurun.'
          : 'Fill in your information to get a quote based on your configuration above.'}
      </p>

      {hasConfig && (
        <div className="rounded-lg bg-background border p-4 mb-6">
          <h4 className="text-sm font-bold mb-2">{language === 'tr' ? 'Seçilen Konfigürasyon' : 'Selected Configuration'}</h4>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{configText()}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cfg-name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {t('contact.form.name')} *
            </Label>
            <Input id="cfg-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cfg-company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {t('contact.form.company')}
            </Label>
            <Input id="cfg-company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cfg-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {t('contact.form.email')} *
            </Label>
            <Input id="cfg-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cfg-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {t('contact.form.phone')}
            </Label>
            <Input id="cfg-phone" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cfg-note" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {language === 'tr' ? 'Ek Not / Özel İstekler' : 'Additional Notes'}
          </Label>
          <Textarea id="cfg-note" rows={3} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
        </div>
        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 py-6">
          <Send className="mr-2 h-5 w-5" />
          {t('lineBuilder.quote.submit')}
        </Button>
      </form>
    </div>
  );
};

export default ConfiguratorQuoteForm;
