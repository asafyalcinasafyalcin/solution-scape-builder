import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Droplets, Milk, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const quoteRef = useRef<HTMLDivElement>(null);

  const handleConfigChange = (config: Record<string, string>) => {
    setConfigSummary(config);
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
    <div className="py-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-steel">
          <Link to="/" className="hover:text-foreground transition-colors">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{language === 'tr' ? 'Konfigüratör' : 'Configurator'}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber mb-3 block">
            {language === 'tr' ? 'KONFİGÜRATÖR' : 'CONFIGURATOR'}
          </span>
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl mb-4">
            {language === 'tr' ? 'Üretim Hattınızı Konfigüre Edin' : 'Configure Your Production Line'}
          </h1>
          <p className="text-lg text-steel max-w-3xl mx-auto">
            {language === 'tr'
              ? 'Salça, sos, süt prosesi veya dolum & paketleme — ihtiyacınıza uygun konfigürasyonu oluşturun ve teklif alın.'
              : 'Tomato paste, sauce, dairy process or filling & packaging — build your configuration and get a quote.'}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setConfigSummary({}); }}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-3 py-4 px-5 rounded-xl border-2 border-border bg-card shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] data-[state=active]:border-amber data-[state=active]:bg-amber/5 data-[state=active]:shadow-premium-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy to-navy-dark text-white shrink-0 data-[state=active]:from-amber data-[state=active]:to-amber-dark">
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

        {/* Quote Form */}
        {activeTab !== 'filling' && (
          <div ref={quoteRef} className="mt-16">
            <ConfiguratorQuoteForm configSummary={configSummary} activeTab={activeTab} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Configurator;
