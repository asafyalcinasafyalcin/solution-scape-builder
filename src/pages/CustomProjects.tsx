import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, PenTool, Truck, Settings, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

const CustomProjects = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    projectType: '',
    sector: '',
    country: '',
    budget: '',
    capacity: '',
    area: '',
    timeline: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  });

  const processSteps = [
    { icon: Search, label: language === 'tr' ? 'Keşif & Hedef Netleştirme' : 'Discovery & Goal Setting', step: 1 },
    { icon: PenTool, label: language === 'tr' ? 'Konsept & Fizibilite' : 'Concept & Feasibility', step: 2 },
    { icon: Truck, label: language === 'tr' ? 'Tedarik & Üretici Organizasyonu' : 'Procurement & Manufacturer Org.', step: 3 },
    { icon: Settings, label: language === 'tr' ? 'Kurulum & Devreye Alma' : 'Installation & Commissioning', step: 4 },
    { icon: Play, label: language === 'tr' ? 'Teslim & Büyüme Planı' : 'Delivery & Growth Plan', step: 5 },
  ];

  const projectTypes = [
    { value: 'greenfield', label: language === 'tr' ? 'Sıfırdan Kurulum (Greenfield)' : 'Greenfield Installation' },
    { value: 'revamp', label: language === 'tr' ? 'Kapasite Artırımı (Revamp)' : 'Capacity Upgrade (Revamp)' },
    { value: 'integration', label: language === 'tr' ? 'Yeni Ürün / Hat Entegrasyonu' : 'New Product / Line Integration' },
    { value: 'relocation', label: language === 'tr' ? 'Fabrika Taşıma & Yeniden Kurulum' : 'Factory Relocation & Reinstallation' },
    { value: 'feasibility', label: language === 'tr' ? 'Fizibilite & Proses Tasarımı' : 'Feasibility & Process Design' },
  ];

  const sectors = [
    { value: 'food', label: language === 'tr' ? 'Gıda Üretimi' : 'Food Production' },
    { value: 'dairy', label: language === 'tr' ? 'Süt & Süt Ürünleri' : 'Dairy Products' },
    { value: 'beverage', label: language === 'tr' ? 'İçecek' : 'Beverage' },
    { value: 'health', label: language === 'tr' ? 'Sağlık & Klinik' : 'Health & Clinic' },
    { value: 'energy', label: language === 'tr' ? 'Enerji & Altyapı' : 'Energy & Infrastructure' },
    { value: 'other', label: language === 'tr' ? 'Diğer' : 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link
    const subject = encodeURIComponent('Özel Proje Talebi');
    const body = encodeURIComponent(`
Proje Tipi: ${formData.projectType}
Sektör: ${formData.sector}
Ülke/Şehir: ${formData.country}
Bütçe Aralığı: ${formData.budget}
Hedef Kapasite: ${formData.capacity}
Alan Durumu: ${formData.area}
Zaman Planı: ${formData.timeline}

Açıklama:
${formData.description}

İletişim Bilgileri:
Ad Soyad: ${formData.name}
E-posta: ${formData.email}
Telefon: ${formData.phone}
    `);
    window.location.href = `mailto:info@processturk.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-20">
      <div className="container">
        {/* Hero Section */}
        <div className="relative mb-20 rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(var(--accent)) 0%, transparent 50%)',
            }} />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              {t('customProjects.hero')}
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {t('customProjects.heroDesc')}
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-12">
            {t('process.title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className="group relative flex flex-col items-center text-center"
              >
                {index < processSteps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border lg:block" />
                )}
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all group-hover:scale-110 group-hover:bg-accent">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 className="mt-1 text-sm font-semibold">{step.label}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Project Types & Sectors */}
        <div className="grid gap-8 md:grid-cols-2 mb-20">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'tr' ? 'Proje Türleri' : 'Project Types'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {projectTypes.map((type) => (
                  <li key={type.value} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span>{type.label}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'tr' ? 'Uygun Olduğumuz Alanlar' : 'Suitable Areas'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0" />
                  <span>{language === 'tr' ? 'Endüstriyel üretim tesisleri' : 'Industrial production facilities'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0" />
                  <span>{language === 'tr' ? 'Hizmet & sağlık projeleri' : 'Service & health projects'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent shrink-0" />
                  <span>{language === 'tr' ? 'Enerji & altyapı projeleri' : 'Energy & infrastructure projects'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {language === 'tr' ? 'Özel Proje Başvuru Formu' : 'Custom Project Application Form'}
            </CardTitle>
            <CardDescription>
              {language === 'tr' ? 'Projenizi detaylandırın, size uygun çözümü önerelim.' : 'Detail your project, we will suggest the right solution.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectType">{language === 'tr' ? 'Proje Türü' : 'Project Type'}</Label>
                  <select
                    id="projectType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option value="">{language === 'tr' ? 'Seçiniz...' : 'Select...'}</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">{language === 'tr' ? 'Sektör' : 'Sector'}</Label>
                  <select
                    id="sector"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  >
                    <option value="">{language === 'tr' ? 'Seçiniz...' : 'Select...'}</option>
                    {sectors.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">{language === 'tr' ? 'Ülke / Şehir' : 'Country / City'}</Label>
                  <Input
                    id="country"
                    placeholder={language === 'tr' ? 'Türkiye, İstanbul' : 'Turkey, Istanbul'}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">{language === 'tr' ? 'Bütçe Aralığı' : 'Budget Range'}</Label>
                  <Input
                    id="budget"
                    placeholder={language === 'tr' ? 'Örn: 500.000 - 1.000.000 USD' : 'E.g.: 500,000 - 1,000,000 USD'}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">{language === 'tr' ? 'Hedef Kapasite' : 'Target Capacity'}</Label>
                  <Input
                    id="capacity"
                    placeholder={language === 'tr' ? 'Örn: 5.000 L/saat' : 'E.g.: 5,000 L/hour'}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">{language === 'tr' ? 'Alan Durumu' : 'Area Status'}</Label>
                  <Input
                    id="area"
                    placeholder={language === 'tr' ? 'Mevcut / Planlanan alan' : 'Existing / Planned area'}
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">{language === 'tr' ? 'Zaman Planı' : 'Timeline'}</Label>
                <Input
                  id="timeline"
                  placeholder={language === 'tr' ? 'Hedeflenen başlangıç / tamamlanma tarihi' : 'Target start / completion date'}
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{language === 'tr' ? 'Proje Açıklaması' : 'Project Description'}</Label>
                <Textarea
                  id="description"
                  placeholder={language === 'tr' ? 'Projenizi detaylı olarak açıklayın...' : 'Describe your project in detail...'}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">{language === 'tr' ? 'İletişim Bilgileri' : 'Contact Information'}</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {language === 'tr' ? 'Başvuruyu Gönder' : 'Submit Application'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomProjects;
