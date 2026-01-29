import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';

const TomatoLines = () => {
  const { t, language } = useLanguage();

  const maclineSeries = [
    {
      name: 'MACLINE ECO',
      capacity: '500 kg/saat',
      description: 'Giriş seviyesi, küçük işletmeler için ideal',
      features: ['Manuel yükleme', 'Temel proses', 'Kompakt tasarım'],
    },
    {
      name: 'MACLINE PLUS',
      capacity: '1.000 kg/saat',
      description: 'Orta ölçekli üretim için optimize edilmiş',
      features: ['Yarı otomatik yükleme', 'Gelişmiş proses', 'Modüler yapı'],
    },
    {
      name: 'MACLINE PRO',
      capacity: '2.500 kg/saat',
      description: 'Profesyonel üretim tesisleri için',
      features: ['Tam otomatik yükleme', 'İleri proses kontrol', 'SCADA entegrasyonu'],
    },
    {
      name: 'MACLINE PREMIUM',
      capacity: '5.000 kg/saat',
      description: 'Endüstriyel ölçekte maksimum verimlilik',
      features: ['Tam otomasyon', 'AI destekli kontrol', 'Uzaktan izleme'],
    },
    {
      name: 'MACLINE JUICE',
      capacity: '3.000 L/saat',
      description: 'Domates suyu ve konsantre üretimi',
      features: ['Özel filtre sistemleri', 'Aseptik dolum opsiyonu', 'CIP sistemi'],
    },
  ];

  const comparisonData = [
    { feature: 'Kapasite', eco: '500 kg/sa', plus: '1.000 kg/sa', pro: '2.500 kg/sa', premium: '5.000 kg/sa', juice: '3.000 L/sa' },
    { feature: 'Otomasyon', eco: 'Manuel', plus: 'Yarı Otomatik', pro: 'Tam Otomatik', premium: 'AI Destekli', juice: 'Tam Otomatik' },
    { feature: 'Yükleme', eco: 'Manuel', plus: 'Yarı Otomatik', pro: 'Otomatik', premium: 'Otomatik', juice: 'Otomatik' },
    { feature: 'SCADA', eco: false, plus: false, pro: true, premium: true, juice: true },
    { feature: 'Uzaktan İzleme', eco: false, plus: false, pro: false, premium: true, juice: true },
    { feature: 'CIP Sistemi', eco: false, plus: true, pro: true, premium: true, juice: true },
    { feature: 'Aseptik Dolum', eco: false, plus: false, pro: 'Opsiyon', premium: 'Dahil', juice: 'Opsiyon' },
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
          <span className="text-foreground">Salça & Domates</span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t('readyLines.tomato.title')}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-accent text-accent-foreground rounded-full">
              MACLINE Serisi
            </span>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            MACLINE, salça ve domates bazlı ürünler için geliştirilmiş modüler bir üretim hattı platformudur. 
            Küçük alanda üretime başlamaya, büyüdükçe kapasite artırmaya uygundur.
          </p>
        </div>

        {/* Series Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {maclineSeries.map((series) => (
            <Card key={series.name} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">MACLINE</span>
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
                  <TableHead className="text-primary-foreground font-semibold text-center">ECO</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">PLUS</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">PRO</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">PREMIUM</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">JUICE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, idx) => (
                  <TableRow key={idx} className={idx % 2 === 0 ? 'bg-secondary/50' : ''}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      {typeof row.eco === 'boolean' ? (
                        row.eco ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.eco}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.plus === 'boolean' ? (
                        row.plus ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.plus}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.pro}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.premium}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.juice === 'boolean' ? (
                        row.juice ? <Check className="h-5 w-5 text-accent mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      ) : row.juice}
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
            Bu sektör sizinki değil mi?
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-6">
            Farklı bir ürün veya kapasite mi arıyorsunuz?
          </p>
          <Button asChild size="lg" variant="secondary">
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

export default TomatoLines;
