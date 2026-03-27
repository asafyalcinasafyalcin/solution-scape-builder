import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Droplets, Milk, Package } from 'lucide-react';
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
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: 'sauce',
      label: language === 'tr' ? 'Sos Hatları' : 'Sauce Lines',
      icon: <Droplets className="h-4 w-4" />,
    },
    {
      id: 'dairy',
      label: language === 'tr' ? 'Süt Prosesi' : 'Dairy Process',
      icon: <Milk className="h-4 w-4" />,
    },
    {
      id: 'filling',
      label: language === 'tr' ? 'Dolum & Paketleme' : 'Filling & Packaging',
      icon: <Package className="h-4 w-4" />,
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">{language === 'tr' ? 'Ana Sayfa' : 'Home'}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{language === 'tr' ? 'Konfigüratör' : 'Configurator'}</span>
        </nav>

        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {language === 'tr' ? 'Üretim Hattınızı Konfigüre Edin' : 'Configure Your Production Line'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'tr'
              ? 'Salça, sos, süt prosesi veya dolum & paketleme — ihtiyacınıza uygun konfigürasyonu oluşturun ve teklif alın.'
              : 'Tomato paste, sauce, dairy process or filling & packaging — build your configuration and get a quote.'}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setConfigSummary({}); }}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 bg-muted/50 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8">
            <TabsContent value="macline">
              <MaclineConfigurator onConfigChange={handleConfigChange} />
            </TabsContent>

            <TabsContent value="sauce">
              <SauceConfigurator onConfigChange={handleConfigChange} />
            </TabsContent>

            <TabsContent value="dairy">
              <DairyConfigurator onConfigChange={handleConfigChange} />
            </TabsContent>

            <TabsContent value="filling">
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
