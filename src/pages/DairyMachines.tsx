import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const DairyMachines = () => {
  const { t } = useLanguage();

  const machines = [
    {
      name: 'Homojenizatör',
      description: 'Süt ve süt ürünlerinde yağ globüllerini parçalayarak homojen bir yapı elde etmeye yarar.',
      capacities: ['500 L/sa', '1.000 L/sa', '2.500 L/sa', '5.000 L/sa'],
    },
    {
      name: 'Krema Separatörü',
      description: 'Sütten kremayı ayırmak için kullanılan santrifüj prensipli makine.',
      capacities: ['1.000 L/sa', '3.000 L/sa', '5.000 L/sa', '10.000 L/sa'],
    },
    {
      name: 'Klarifikatör',
      description: 'Sütü mekanik kirliliklerden arındırmak için kullanılır.',
      capacities: ['2.000 L/sa', '5.000 L/sa', '10.000 L/sa'],
    },
    {
      name: 'Pastörizatör',
      description: 'Süt ve süt ürünlerini ısıl işleme tabi tutarak mikrobiyolojik güvenlik sağlar.',
      capacities: ['500 L/sa', '1.000 L/sa', '2.500 L/sa', '5.000 L/sa'],
    },
    {
      name: 'Yoğurt Dolum Makinesi',
      description: 'Yoğurt ve benzeri ürünlerin kaplara otomatik dolumunu sağlar.',
      capacities: ['1.500 kap/sa', '3.000 kap/sa', '6.000 kap/sa'],
    },
    {
      name: 'Cooker Line (Pişirme Hattı)',
      description: 'Peynir, kaşar ve benzeri ürünlerin eritilmesi ve şekillendirilmesi için.',
      capacities: ['200 kg/sa', '500 kg/sa', '1.000 kg/sa'],
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link to="/tekil-makineler" className="hover:text-foreground">{t('nav.singleMachines')}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Süt Prosesi</span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t('singleMachines.dairy.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Süt ve süt ürünleri işleme tesisleri için profesyonel proses makineleri. 
            İhtiyacınıza uygun kapasitelerde, güvenilir Türk üreticilerinden temin ediyoruz.
          </p>
        </div>

        {/* Machines Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {machines.map((machine) => (
            <Card key={machine.name} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{machine.name}</CardTitle>
                <CardDescription>{machine.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Kapasite Seçenekleri:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {machine.capacities.map((cap, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-secondary rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  <Link to="/iletisim">
                    {t('common.getQuote')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            Listede olmayan bir makine mi arıyorsunuz?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            İhtiyacınızı bize iletin, sizin için doğru çözümü bulalım.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/iletisim">
              İletişime Geç
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DairyMachines;
