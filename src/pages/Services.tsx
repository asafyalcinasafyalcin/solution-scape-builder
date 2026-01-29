import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Users, ClipboardCheck, Truck, Play, GraduationCap, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Settings,
      title: t('services.engineering'),
      titleEn: 'Project & Engineering',
      description: language === 'tr' 
        ? 'Proses tasarımı, kapasite hesaplamaları, ekipman seçimi ve yerleşim planları.' 
        : 'Process design, capacity calculations, equipment selection and layout plans.',
    },
    {
      icon: Users,
      title: t('services.manufacturer'),
      titleEn: 'Manufacturer Organization',
      description: language === 'tr'
        ? 'Türkiye\'nin güvenilir ekipman üreticileri ile koordinasyon ve sözleşme yönetimi.'
        : 'Coordination with reliable Turkish equipment manufacturers and contract management.',
    },
    {
      icon: ClipboardCheck,
      title: t('services.tracking'),
      titleEn: 'Production Tracking & Testing',
      description: language === 'tr'
        ? 'Üretim sürecinin takibi, fabrika kabul testleri (FAT) ve kalite kontrolü.'
        : 'Production process tracking, factory acceptance tests (FAT) and quality control.',
    },
    {
      icon: Truck,
      title: t('services.logistics'),
      titleEn: 'Logistics',
      description: language === 'tr'
        ? 'Ekipman nakliyesi, gümrükleme ve saha teslimatı koordinasyonu.'
        : 'Equipment shipping, customs clearance and on-site delivery coordination.',
    },
    {
      icon: Play,
      title: t('services.installation'),
      titleEn: 'Installation & Commissioning',
      description: language === 'tr'
        ? 'Saha kurulumu, mekanik ve elektrik bağlantıları, devreye alma ve optimizasyon.'
        : 'On-site installation, mechanical and electrical connections, commissioning and optimization.',
    },
    {
      icon: GraduationCap,
      title: t('services.training'),
      titleEn: 'Training',
      description: language === 'tr'
        ? 'Operatör eğitimi, bakım prosedürleri ve teknik dokümantasyon.'
        : 'Operator training, maintenance procedures and technical documentation.',
    },
    {
      icon: Wrench,
      title: t('services.support'),
      titleEn: 'Technical Support & Spare Parts',
      description: language === 'tr'
        ? 'Devreye alma sonrası teknik destek, yedek parça temini ve periyodik bakım.'
        : 'Post-commissioning technical support, spare parts supply and periodic maintenance.',
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('services.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'tr' 
              ? 'Projenizin her aşamasında yanınızdayız. Fikirden üretime, eğitimden teknik servise kadar kapsamlı hizmetler sunuyoruz.'
              : 'We are with you at every stage of your project. We offer comprehensive services from idea to production, from training to technical service.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:bg-accent transition-colors">
                  <service.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardContent>
              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="rounded-2xl bg-secondary p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'tr' ? 'Hizmet Akışımız' : 'Our Service Flow'}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Tasarım', 'Tedarik', 'Üretim', 'Kurulum', 'Eğitim', 'Destek'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>
                <span className="ml-2 font-medium">{step}</span>
                {index < 5 && (
                  <ArrowRight className="mx-3 h-5 w-5 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            {language === 'tr' ? 'Projenizi Konuşalım' : 'Let\'s Discuss Your Project'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            {language === 'tr' 
              ? 'Hangi hizmetlere ihtiyacınız olduğunu birlikte belirleyelim.'
              : 'Let\'s determine together which services you need.'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/iletisim">
              {t('common.getQuote')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
