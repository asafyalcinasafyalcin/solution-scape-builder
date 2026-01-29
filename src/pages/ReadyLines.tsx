import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const ReadyLines = () => {
  const { t } = useLanguage();

  const categories = [
    {
      title: t('readyLines.tomato.title'),
      description: t('readyLines.tomato.desc'),
      image: '/placeholder.svg',
      link: '/hazir-hatlar/salca-domates',
      series: 'MACLINE',
    },
    {
      title: t('readyLines.sauce.title'),
      description: t('readyLines.sauce.desc'),
      image: '/placeholder.svg',
      link: '/hazir-hatlar/mayonez-ketcap-sos',
      series: 'SAUCE',
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('readyLines.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            Modüler, ölçeklenebilir ve endüstriyel kalitede hazır üretim hatları
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card key={category.link} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-xl">
              {/* Image placeholder */}
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground/30">{category.series}</span>
              </div>
              <CardHeader>
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                    {category.series} Serisi
                  </span>
                </div>
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

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Bu sektör sizinki değil mi?
          </p>
          <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link to="/ozel-projeler">
              Özel Proje Talebi Oluştur
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadyLines;
