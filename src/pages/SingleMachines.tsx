import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const SingleMachines = () => {
  const { t } = useLanguage();

  const categories = [
    {
      title: t('singleMachines.dairy.title'),
      description: t('singleMachines.dairy.desc'),
      image: '/placeholder.svg',
      link: '/tekil-makineler/sut-prosesi',
      machines: ['Homojenizatör', 'Separatör', 'Pastörizatör', 'Klarifikatör'],
    },
    {
      title: t('singleMachines.filling.title'),
      description: t('singleMachines.filling.desc'),
      image: '/placeholder.svg',
      link: '/tekil-makineler/dolum-paketleme',
      machines: ['Dolum Makineleri', 'Kapak Kapama', 'Etiketleme', 'Konveyör'],
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('singleMachines.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            Mevcut hattınızı güçlendirin veya ihtiyacınıza özel tekil makineler temin edin
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card key={category.link} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-xl">
              {/* Image placeholder */}
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {category.machines.slice(0, 4).map((machine, idx) => (
                    <span key={idx} className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded text-center">
                      {machine}
                    </span>
                  ))}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{category.title}</CardTitle>
                <CardDescription className="text-base">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to={category.link}>
                    {t('common.explore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Neden Tekil Makine?</h2>
          <p className="text-muted-foreground mb-8">
            Mevcut üretim hattınızı yükseltmek, darboğazları gidermek veya yeni bir proses eklemek istiyorsanız 
            tek tek makine tedariki sizin için doğru çözüm olabilir. İhtiyacınıza göre en uygun ekipmanı 
            seçmenize yardımcı oluyoruz.
          </p>
          <Button asChild variant="outline" size="lg">
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

export default SingleMachines;
