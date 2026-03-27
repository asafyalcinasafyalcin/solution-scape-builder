import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Droplets, Milk, Package, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import MaclineConfigurator from '@/components/configurator/MaclineConfigurator';
import SauceConfigurator from '@/components/configurator/SauceConfigurator';
import DairyConfigurator from '@/components/configurator/DairyConfigurator';
import LineBuilder from '@/components/filling/LineBuilder';
import ConfiguratorQuoteForm from '@/components/configurator/ConfiguratorQuoteForm';

const Configurator = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('macline');
  const [configSummary, setConfigSummary] = useState<Record<string, string>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);

  const handleConfigChange = (config: Record<string, string>) => {
    setConfigSummary(config);
  };

  const slides = [
    {
      label: t('config.slide1.label'),
      line1: t('config.slide1.line1'),
      line2: t('config.slide1.line2'),
      description: t('config.slide1.description'),
      ctaText: t('config.slide1.cta'),
      ctaAction: 'scroll',
      secondaryText: t('config.slide1.secondary'),
      secondaryLink: '/cozumler',
    },
    {
      label: t('config.slide2.label'),
      line1: t('config.slide2.line1'),
      line2: t('config.slide2.line2'),
      description: t('config.slide2.description'),
      ctaText: t('config.slide2.cta'),
      ctaAction: 'tab-macline',
      secondaryText: t('config.slide2.secondary'),
      secondaryLink: '/hazir-hatlar',
    },
    {
      label: t('config.slide3.label'),
      line1: t('config.slide3.line1'),
      line2: t('config.slide3.line2'),
      description: t('config.slide3.description'),
      ctaText: t('config.slide3.cta'),
      ctaAction: 'tab-sauce',
      secondaryText: t('config.slide3.secondary'),
      secondaryLink: '/sut-makineleri',
    },
  ];

  const supportItems = [
    {
      icon: Factory,
      title: t('config.support.tomato'),
      desc: t('config.support.tomato.desc'),
    },
    {
      icon: Droplets,
      title: t('config.support.sauce'),
      desc: t('config.support.sauce.desc'),
    },
    {
      icon: Milk,
      title: t('config.support.dairy'),
      desc: t('config.support.dairy.desc'),
    },
    {
      icon: Package,
      title: t('config.support.filling'),
      desc: t('config.support.filling.desc'),
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleSlideCtaClick = (action: string) => {
    if (action === 'scroll') {
      document.getElementById('configurator-tabs')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action.startsWith('tab-')) {
      const tabId = action.replace('tab-', '');
      setActiveTab(tabId);
      document.getElementById('configurator-tabs')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tabs = [
    {
      id: 'macline',
      label: language === 'tr' ? 'Salça & Domates' : 'Tomato & Paste',
      icon: <Factory className="h-5 w-5" />,
    },
    {
      id: 'sauce',
      label: language === 'tr' ? 'Sos Hatları' : 'Sauce Lines',
      icon: <Droplets className="h-5 w-5" />,
    },
    {
      id: 'dairy',
      label: language === 'tr' ? 'Süt Prosesi' : 'Dairy Process',
      icon: <Milk className="h-5 w-5" />,
    },
    {
      id: 'filling',
      label: language === 'tr' ? 'Dolum & Paketleme' : 'Filling & Packaging',
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--amber)) 0%, transparent 40%), radial-gradient(circle at 80% 20%, hsl(var(--navy-light)) 0%, transparent 40%)',
          }} />
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Slider */}
            <div className="relative min-h-[320px]">
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
                    <Button
                      size="lg"
                      className="bg-amber hover:bg-amber-dark text-white text-base px-8 tracking-wide"
                      onClick={() => handleSlideCtaClick(slide.ctaAction)}
                    >
                      {slide.ctaText}
                      <ArrowRight className="ml-2 h-5 w-5" />
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

            {/* Right Column - Config Areas */}
            <div className="space-y-3">
              <span className="inline-block text-amber tracking-[0.25em] uppercase text-xs font-semibold mb-2">
                {t('config.support.label')}
              </span>
              {supportItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all group cursor-pointer"
                  onClick={() => {
                    const tabMap: Record<string, string> = {
                      [t('config.support.tomato')]: 'macline',
                      [t('config.support.sauce')]: 'sauce',
                      [t('config.support.dairy')]: 'dairy',
                      [t('config.support.filling')]: 'filling',
                    };
                    const tab = tabMap[item.title];
                    if (tab) {
                      setActiveTab(tab);
                      document.getElementById('configurator-tabs')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
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
      </section>

      {/* Tabs Section */}
      <div id="configurator-tabs" className="py-16">
        <div className="container">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setConfigSummary({}); }}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-3 py-4 px-5 rounded-xl border-2 border-border bg-card shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] data-[state=active]:border-amber data-[state=active]:bg-amber/5 data-[state=active]:shadow-premium-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-dark text-white shrink-0">
                    {tab.icon}
                  </div>
                  <span className="hidden sm:inline font-medium">{tab.label}</span>
                  <span className="sm:hidden text-xs font-medium">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-10">
              <TabsContent value="macline" className="animate-fade-in">
                <MaclineConfigurator onConfigChange={handleConfigChange} />
              </TabsContent>
              <TabsContent value="sauce" className="animate-fade-in">
                <SauceConfigurator onConfigChange={handleConfigChange} />
              </TabsContent>
              <TabsContent value="dairy" className="animate-fade-in">
                <DairyConfigurator onConfigChange={handleConfigChange} />
              </TabsContent>
              <TabsContent value="filling" className="animate-fade-in">
                <LineBuilder />
              </TabsContent>
            </div>
          </Tabs>

          {activeTab !== 'filling' && (
            <div ref={quoteRef} className="mt-16">
              <ConfiguratorQuoteForm configSummary={configSummary} activeTab={activeTab} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configurator;
