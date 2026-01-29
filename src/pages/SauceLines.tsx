import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';

const SauceLines = () => {
  const { t } = useLanguage();

  const sauceSeries = [
    {
      name: 'SAUCE 500',
      capacity: '500 L/saat',
      description: 'Giriş seviyesi sos üretimi için kompakt çözüm',
      features: ['Vakum karıştırma', 'Isıtma sistemi', 'Manuel dozajlama'],
    },
    {
      name: 'SAUCE 1000',
      capacity: '1.000 L/saat',
      description: 'Orta ölçekli endüstriyel üretim hattı',
      features: ['Tam vakum sistemi', 'Otomatik dozajlama', 'In-line homojenizasyon'],
    },
    {
      name: 'SAUCE 1500',
      capacity: '1.500 L/saat',
      description: 'Yüksek kapasiteli profesyonel hat',
      features: ['Çift vakum kazanı', 'PLC kontrol', 'Dolum entegrasyonu'],
    },
  ];

  const comparisonData = [
    { feature: 'Kapasite', s500: '500 L/sa', s1000: '1.000 L/sa', s1500: '1.500 L/sa' },
    { feature: 'Vakum Sistemi', s500: 'Temel', s1000: 'Tam', s1500: 'Çift Kazan' },
    { feature: 'Karıştırma', s500: 'Tek Hızlı', s1000: 'Değişken Hızlı', s1500: 'Değişken + Homojenizatör' },
    { feature: 'Dozajlama', s500: 'Manuel', s1000: 'Yarı Otomatik', s1500: 'Tam Otomatik' },
    { feature: 'PLC Kontrol', s500: false, s1000: true, s1500: true },
    { feature: 'HMI Ekran', s500: false, s1000: true, s1500: true },
    { feature: 'CIP Sistemi', s500: false, s1000: 'Opsiyon', s1500: 'Dahil' },
    { feature: 'Dolum Entegrasyonu', s500: false, s1000: 'Opsiyon', s1500: 'Dahil' },
  ];

  const products = [
    'Mayonez',
    'Ketçap',
    'Hardal',
    'BBQ Sos',
    'Tat Sos',
    'Salata Sosu',
    'Acı Sos',
    'Teriyaki',
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link to="/hazir-hatlar" className="hover:text-foreground">{t('nav.readyLines')}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Mayonez, Ketçap & Sos</span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t('readyLines.sauce.title')}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-accent text-accent-foreground rounded-full">
              SAUCE Serisi
            </span>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Endüstriyel ölçekte mayonez, ketçap ve sos üretimi için tasarlanmış, yüksek performanslı ve ölçeklenebilir hatlar.
          </p>
        </div>

        {/* Products Tags */}
        <div className="mb-12">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Üretilebilen Ürünler:</h3>
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <span key={product} className="px-3 py-1 text-sm bg-secondary rounded-full">
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Series Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-20">
          {sauceSeries.map((series) => (
            <Card key={series.name} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">SAUCE</span>
                  <span className="text-sm font-semibold text-accent">{series.capacity}</span>
                </div>
                <CardTitle className="text-xl">{series.name}</CardTitle>
                <CardDescription>{series.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {series.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  <Link to="/iletisim">
                    {t('common.getQuote')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Birbirinden Farkı Ne?</h2>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Özellik</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">SAUCE 500</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">SAUCE 1000</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">SAUCE 1500</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, idx) => (
                  <TableRow key={idx} className={idx % 2 === 0 ? 'bg-secondary/50' : ''}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      {typeof row.s500 === 'boolean' ? (
                        row.s500 ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.s500}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.s1000 === 'boolean' ? (
                        row.s1000 ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.s1000}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.s1500 === 'boolean' ? (
                        row.s1500 ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.s1500}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-accent p-8 text-center text-accent-foreground md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            Hazır sistem dışında bir ihtiyacınız mı var?
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-6">
            Farklı bir kapasite veya ürün mü arıyorsunuz?
          </p>
          <Button asChild size="lg" variant="secondary">
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

export default SauceLines;
