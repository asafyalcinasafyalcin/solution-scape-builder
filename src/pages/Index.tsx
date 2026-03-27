import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Cog, Lightbulb, Search, PenTool, Truck, Settings, Play, TrendingUp, Layers, Package, Wrench, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const supportItems = [
    {
      icon: Factory,
      title: t('hero.support.readyLines'),
      desc: t('hero.support.readyLines.desc'),
    },
    {
      icon: Cog,
      title: t('hero.support.singleMachines'),
      desc: t('hero.support.singleMachines.desc'),
    },
    {
      icon: Lightbulb,
      title: t('hero.support.customProjects'),
      desc: t('hero.support.customProjects.desc'),
    },
    {
      icon: Wrench,
      title: t('hero.support.technical'),
      desc: t('hero.support.technical.desc'),
    },
  ];

  const featureBar = [
    { icon: Layers, label: t('hero.feature.turnkey') },
    { icon: Package, label: t('hero.feature.sourcing') },
    { icon: Settings, label: t('hero.feature.multiSector') },
    { icon: FileText, label: t('hero.feature.proposals') },
  ];

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
      {/* Hero Section - Premium 2-Column */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--amber)) 0%, transparent 40%), radial-gradient(circle at 80% 20%, hsl(var(--navy-light)) 0%, transparent 40%)',
          }} />
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div>
              <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-4">
                {t('hero.label')}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/90 mb-2 animate-fade-in">
                {t('hero.line1')}
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic text-white mb-2 animate-fade-in">
                {t('hero.line2')}
                <span className="block h-1 w-24 bg-amber mt-3 rounded-full" />
              </h2>
              <p className="text-steel text-lg max-w-xl mt-6 mb-8 animate-fade-in">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                <Button asChild size="lg" className="bg-amber hover:bg-amber-dark text-white text-base px-8 tracking-wide">
                  <Link to="/iletisim">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-base px-8">
                  <Link to="/cozumler">{t('hero.learnMore')}</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - WE SUPPORT */}
            <div className="space-y-3">
              <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-2">
                {t('hero.weSupport')}
              </span>
              {supportItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center border border-amber/20">
                    <item.icon className="h-5 w-5 text-amber" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber transition-colors">{item.title}</h3>
                    <p className="text-xs text-steel mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Bar */}
        <div className="relative z-10 border-t border-white/[0.08] bg-white/[0.03]">
          <div className="container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featureBar.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-amber flex-shrink-0" />
                  <span className="text-xs text-white/70 tracking-[0.15em] uppercase font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards - Premium */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {quickCards.map((card) => (
              <Card
                key={card.link}
                className="group relative overflow-hidden border border-border-strong border-t-2 border-t-amber/30 shadow-premium transition-all hover:shadow-premium-lg hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-navy-deep to-navy text-white">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-base">{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group-hover:text-amber px-0">
                    <Link to={card.link}>
                      {t('common.explore')}
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

      {/* Process Steps - Premium Dark */}
      <section className="py-20 bg-navy-deep text-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-3">
              {t('process.label')}
            </span>
            <h2 className="text-3xl font-light sm:text-4xl">
              {t('process.title')}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className="group relative flex flex-col items-center text-center"
              >
                {index < processSteps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-white/10 lg:block" />
                )}
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-light border border-white/10 transition-all group-hover:scale-110 group-hover:border-amber/40">
                  <step.icon className="h-7 w-7 text-white/80 group-hover:text-amber transition-colors" />
                </div>
                <div className="text-xs font-medium text-amber/60 tracking-widest">
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 className="mt-1 text-base font-semibold text-white/90">{step.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - Navy + Amber */}
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

export default Index;
