import { Link } from 'react-router-dom';
import { ArrowRight, Factory, PenTool, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Solutions = () => {
  const { language, t } = useLanguage();

  const solutions = [
    {
      icon: Factory,
      title: t('solutions.turnkey.title'),
      description: t('solutions.turnkey.desc'),
      details: language === 'tr'
        ? ['Gıda tesisleri', 'Süt & süt ürünleri', 'Dolum & paketleme tesisleri', 'Sektörünüz farklıysa → Özel Projeler']
        : ['Food facilities', 'Dairy products', 'Filling & packaging facilities', 'Different sector → Custom Projects'],
      link: '/konfigurator',
      cta: language === 'tr' ? 'Konfigüratörü Aç' : 'Open Configurator',
    },
    {
      icon: PenTool,
      title: t('solutions.engineering.title'),
      description: t('solutions.engineering.desc'),
      details: language === 'tr'
        ? ['Proses tasarımı', 'Kapasite planlama', 'Ekipman listeleri', 'Yerleşim planları']
        : ['Process design', 'Capacity planning', 'Equipment lists', 'Layout plans'],
      link: '/konfigurator',
      cta: language === 'tr' ? 'Konfigüratörü Aç' : 'Open Configurator',
    },
    {
      icon: GraduationCap,
      title: t('solutions.installation.title'),
      description: t('solutions.installation.desc'),
      details: language === 'tr'
        ? ['Saha koordinasyonu', 'Commissioning', 'Operatör eğitimi']
        : ['Field coordination', 'Commissioning', 'Operator training'],
      link: '/iletisim',
      cta: t('common.getQuote'),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero - Premium Navy */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, hsl(var(--amber)) 0%, transparent 40%), radial-gradient(circle at 70% 60%, hsl(var(--navy-light)) 0%, transparent 40%)',
          }} />
        </div>
        <div className="container relative z-10 py-20 lg:py-28 text-center">
          <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-4">
            {language === 'tr' ? 'ÇÖZÜMLERİMİZ' : 'OUR SOLUTIONS'}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-2">
            {t('solutions.title')}
          </h1>
          <span className="block h-1 w-24 bg-amber mx-auto mt-4 mb-6 rounded-full" />
          <p className="text-lg text-steel max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border border-border-strong border-t-2 border-t-amber/30 shadow-premium transition-all hover:shadow-premium-lg hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-navy-deep to-navy text-white">
                    <solution.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                  <CardDescription className="text-base">{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {solution.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="ghost" className="group-hover:text-amber px-0">
                    <Link to={solution.link}>
                      {solution.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-amber transition-all group-hover:w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-navy text-white">
        <div className="container text-center">
          <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-3">
            {t('cta.label')}
          </span>
          <h2 className="mb-4 text-3xl font-light sm:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mb-8 text-lg text-steel">
            {t('cta.subtitle')}
          </p>
          <Button asChild size="lg" className="bg-amber hover:bg-amber-dark text-white text-lg px-8">
            <Link to="/iletisim">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Solutions;