import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, SlidersHorizontal, Lightbulb, Search, PenTool, Truck, Settings, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      label: t('hero.label'),
      line1: t('hero.line1'),
      line2: t('hero.line2'),
      description: t('hero.description'),
      ctaText: t('hero.cta'),
      ctaLink: '/iletisim',
      secondaryText: t('hero.learnMore'),
      secondaryLink: '/cozumler',
    },
    {
      label: t('hero.slide2.label'),
      line1: t('hero.slide2.line1'),
      line2: t('hero.slide2.line2'),
      description: t('hero.slide2.description'),
      ctaText: t('hero.slide2.cta'),
      ctaLink: '/konfigurator',
      secondaryText: t('hero.slide2.secondary'),
      secondaryLink: '/cozumler',
    },
    {
      label: t('hero.slide3.label'),
      line1: t('hero.slide3.line1'),
      line2: t('hero.slide3.line2'),
      description: t('hero.slide3.description'),
      ctaText: t('hero.slide3.cta'),
      ctaLink: '/konfigurator',
      secondaryText: t('hero.slide3.secondary'),
      secondaryLink: '/cozumler',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const quickCards = [
    {
      icon: Factory,
      title: t('card.readyLine.title'),
      description: t('card.readyLine.desc'),
      link: '/hazir-hatlar',
    },
    {
      icon: SlidersHorizontal,
      title: t('LanguageContext') === 'tr' ? 'Konfigüratör' : 'Configurator',
      description: t('hero.slide2.description'),
      link: '/konfigurator',
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

        <div className="container relative z-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Slider */}
            <div className="relative min-h-[340px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
                    pointerEvents: currentSlide === index ? 'auto' : 'none',
                  }}
                >
                  <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-4">
                    {slide.label}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white/90 mb-2">
                    {slide.line1}
                  </h1>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic text-white mb-2">
                    {slide.line2}
                    <span className="block h-1 w-24 bg-amber mt-3 rounded-full" />
                  </h2>
                  <p className="text-steel text-lg max-w-xl mt-6 mb-8">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-amber hover:bg-amber-dark text-white text-base px-8 tracking-wide">
                      <Link to={slide.ctaLink}>
                        {slide.ctaText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-base px-8">
                      <Link to={slide.secondaryLink}>{slide.secondaryText}</Link>
                    </Button>
                  </div>
                </div>
              ))}

              {/* Dot Navigation */}
              <div className="absolute -bottom-2 left-0 flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'w-8 bg-amber'
                        : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md">
                {/* Decorative concentric rings */}
                <div className="absolute inset-0 rounded-full border border-amber/20 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-white/10 animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-amber/30" />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-navy to-navy-deep border border-amber/40 flex items-center justify-center shadow-2xl">
                    <Factory className="h-20 w-20 text-amber" strokeWidth={1.2} />
                    <div className="absolute -inset-4 rounded-full bg-amber/5 blur-2xl" />
                  </div>
                </div>
                {/* Orbiting dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber shadow-[0_0_20px_hsl(var(--amber))]" />
                <div className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full bg-white/60" />
                <div className="absolute bottom-1/4 left-0 w-2 h-2 rounded-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards - 3 main entries */}
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