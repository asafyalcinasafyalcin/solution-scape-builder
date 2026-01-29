import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const FillingMachines = () => {
  const { t } = useLanguage();

  const machines = [
    {
      name: 'Dolum Makineleri',
      description: 'Sıvı, yarı akışkan ve viskoz ürünler için hassas dolum sistemleri.',
      types: ['Pistonlu Dolum', 'Ağırlıklı Dolum', 'Seviye Dolum', 'Volumetrik Dolum'],
    },
    {
      name: 'Kapak Kapama Makineleri',
      description: 'Farklı kapak tipleri için otomatik kapatma sistemleri.',
      types: ['Vidalı Kapak', 'Press-On Kapak', 'Twist-Off', 'ROPP Kapak'],
    },
    {
      name: 'Etiketleme Makineleri',
      description: 'Yuvarlak, düz ve konturlu ambalajlar için etiket uygulama.',
      types: ['Sarmal Etiket', 'Ön-Arka Etiket', 'Üst Etiket', 'Shrink Sleeve'],
    },
    {
      name: 'Shrink Ambalaj',
      description: 'Ürünlerin shrink film ile paketlenmesi.',
      types: ['L-Bar Shrink', 'Shrink Tünel', 'Sleeve Shrink'],
    },
    {
      name: 'Bantlama & UV',
      description: 'Güvenlik bandı uygulama ve UV sterilizasyon sistemleri.',
      types: ['Güvenlik Bandı', 'UV-C Sterilizasyon', 'Ozon Dezenfeksiyon'],
    },
    {
      name: 'Konveyör Sistemleri',
      description: 'Hat içi ürün taşıma ve birikim sistemleri.',
      types: ['Bantlı Konveyör', 'Zincirli Konveyör', 'Modüler Konveyör', 'Birikim Masası'],
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
          <span className="text-foreground">Dolum & Paketleme</span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t('singleMachines.filling.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Ürünlerinizin paketlenmesi için gereken tüm ekipmanlar. 
            Dolumdan etiketlemeye, shrink ambalajdan konveyör sistemlerine kadar komple çözümler.
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
                  <span className="text-sm font-medium text-muted-foreground">Tipler:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {machine.types.map((type, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-secondary rounded">
                        {type}
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
            Komple dolum hattı mı planlıyorsunuz?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            Anahtar teslim dolum ve paketleme hattı için özel proje teklifi alın.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/ozel-projeler">
              Özel Proje Başlat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FillingMachines;
