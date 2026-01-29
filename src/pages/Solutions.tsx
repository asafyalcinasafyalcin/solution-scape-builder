import { Link } from 'react-router-dom';
import { ArrowRight, Factory, PenTool, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Solutions = () => {
  const { t } = useLanguage();

  const solutions = [
    {
      icon: Factory,
      title: t('solutions.turnkey.title'),
      description: t('solutions.turnkey.desc'),
      details: [
        'Gıda tesisleri',
        'Süt & süt ürünleri',
        'Dolum & paketleme tesisleri',
        'Sektörünüz farklıysa → Özel Projeler',
      ],
      detailsEn: [
        'Food facilities',
        'Dairy products',
        'Filling & packaging facilities',
        'Different sector → Custom Projects',
      ],
    },
    {
      icon: PenTool,
      title: t('solutions.engineering.title'),
      description: t('solutions.engineering.desc'),
      details: [
        'Proses tasarımı',
        'Kapasite planlama',
        'Ekipman listeleri',
        'Yerleşim planları',
      ],
      detailsEn: [
        'Process design',
        'Capacity planning',
        'Equipment lists',
        'Layout plans',
      ],
    },
    {
      icon: GraduationCap,
      title: t('solutions.installation.title'),
      description: t('solutions.installation.desc'),
      details: [
        'Saha koordinasyonu',
        'Commissioning',
        'Operatör eğitimi',
      ],
      detailsEn: [
        'Field coordination',
        'Commissioning',
        'Operator training',
      ],
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('solutions.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('hero.description')}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {solutions.map((solution, index) => (
            <Card key={index} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <solution.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">{solution.title}</CardTitle>
                <CardDescription className="text-base">{solution.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {solution.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                  <Link to="/iletisim">
                    {t('common.getQuote')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            {t('cta.subtitle')}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/iletisim">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
