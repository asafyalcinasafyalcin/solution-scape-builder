import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Cog, Lightbulb, Search, PenTool, Truck, Settings, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const quickCards = [
    {
      icon: Factory,
      title: t('card.readyLine.title'),
      description: t('card.readyLine.desc'),
      link: '/hazir-hatlar',
    },
    {
      icon: Cog,
      title: t('card.singleMachine.title'),
      description: t('card.singleMachine.desc'),
      link: '/tekil-makineler',
    },
    {
      icon: Lightbulb,
      title: t('card.customProject.title'),
      description: t('card.customProject.desc'),
      link: '/ozel-projeler',
    },
  ];

  const processSteps = [
    { icon: Search, label: t('process.step1'), step: 1 },
    { icon: PenTool, label: t('process.step2'), step: 2 },
    { icon: Truck, label: t('process.step3'), step: 3 },
    { icon: Settings, label: t('process.step4'), step: 4 },
    { icon: Play, label: t('process.step5'), step: 5 },
    { icon: TrendingUp, label: t('process.step6'), step: 6 },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-primary text-primary-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 0%, transparent 50%)',
          }} />
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="mb-4 text-xl font-medium text-primary-foreground/90 sm:text-2xl animate-fade-in">
              {t('hero.subtitle')}
            </p>
            <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in">
              {t('hero.description')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8">
                <Link to="/iletisim">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                <Link to="/cozumler">{t('hero.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Quick Access Cards */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {quickCards.map((card) => (
              <Card key={card.link} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-base">{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group-hover:text-accent">
                    <Link to={card.link}>
                      {t('common.explore')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
                {/* Hover accent bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            {t('process.title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border lg:block" />
                )}
                
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all group-hover:scale-110 group-hover:bg-accent">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 className="mt-1 text-lg font-semibold">{step.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mb-8 text-xl text-accent-foreground/90">
            {t('cta.subtitle')}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
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

export default Index;
