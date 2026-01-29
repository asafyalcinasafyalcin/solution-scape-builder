import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Heart, MapPin, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Corporate = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: CheckCircle,
      title: language === 'tr' ? 'Güvenilirlik' : 'Reliability',
      description: language === 'tr' 
        ? 'Söz verdiğimizi yaparız. Projelerimizi zamanında ve bütçe dahilinde teslim ederiz.'
        : 'We do what we promise. We deliver our projects on time and within budget.',
    },
    {
      icon: Target,
      title: language === 'tr' ? 'Odaklanma' : 'Focus',
      description: language === 'tr'
        ? 'Müşteri ihtiyacını anlar, en uygun çözümü sunarız.'
        : 'We understand customer needs and offer the most suitable solution.',
    },
    {
      icon: Heart,
      title: language === 'tr' ? 'Şeffaflık' : 'Transparency',
      description: language === 'tr'
        ? 'Süreç boyunca açık iletişim. Her aşamada bilgi paylaşımı.'
        : 'Open communication throughout the process. Information sharing at every stage.',
    },
  ];

  const whyTurkey = [
    {
      title: language === 'tr' ? 'Rekabetçi Fiyatlar' : 'Competitive Prices',
      description: language === 'tr'
        ? 'Avrupa kalitesinde ekipmanlar, çok daha rekabetçi fiyatlarla.'
        : 'European quality equipment at much more competitive prices.',
    },
    {
      title: language === 'tr' ? 'Hızlı Teslimat' : 'Fast Delivery',
      description: language === 'tr'
        ? 'Coğrafi avantaj sayesinde Orta Doğu, Afrika ve Avrupa\'ya hızlı teslimat.'
        : 'Fast delivery to the Middle East, Africa and Europe thanks to geographical advantage.',
    },
    {
      title: language === 'tr' ? 'Esnek Üretim' : 'Flexible Manufacturing',
      description: language === 'tr'
        ? 'Müşteri taleplerine göre özelleştirme yapabilen üreticiler.'
        : 'Manufacturers who can customize according to customer demands.',
    },
    {
      title: language === 'tr' ? 'Kalite Standartları' : 'Quality Standards',
      description: language === 'tr'
        ? 'CE, FDA ve uluslararası standartlara uygun üretim.'
        : 'Production in accordance with CE, FDA and international standards.',
    },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('corporate.title')}
          </h1>
        </div>

        {/* About Section */}
        <section className="mb-20" id="hakkimizda">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('corporate.about')}</h2>
              <p className="text-lg text-muted-foreground mb-4">
                {language === 'tr'
                  ? 'PROCESSTÜRK, Türkiye\'nin önde gelen endüstriyel ekipman üreticilerini dünya ile buluşturan bir anahtar teslim proje firmasıdır.'
                  : 'PROCESSTÜRK is a turnkey project company that brings Turkey\'s leading industrial equipment manufacturers to the world.'}
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                {language === 'tr'
                  ? 'Gıda, süt ürünleri, içecek ve diğer endüstriyel sektörlerde faaliyet gösteren müşterilerimize proje tasarımından kurulum ve eğitime kadar kapsamlı hizmetler sunuyoruz.'
                  : 'We offer comprehensive services from project design to installation and training to our customers operating in food, dairy, beverage and other industrial sectors.'}
              </p>
              <p className="text-lg text-muted-foreground">
                {language === 'tr'
                  ? 'Deneyimli mühendislik ekibimiz ve güçlü tedarikçi ağımızla, en karmaşık projeleri bile başarıyla hayata geçiriyoruz.'
                  : 'With our experienced engineering team and strong supplier network, we successfully implement even the most complex projects.'}
              </p>
            </div>
            <div className="bg-secondary rounded-2xl p-8 flex items-center justify-center aspect-square">
              <div className="text-center">
                <div className="text-6xl font-bold text-accent mb-2">10+</div>
                <p className="text-lg text-muted-foreground">
                  {language === 'tr' ? 'Yıllık Deneyim' : 'Years of Experience'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-20" id="vizyon">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Eye className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  {language === 'tr'
                    ? 'Türk mühendisliği ve üretimini dünya standartlarında tanıtarak, sektörde güvenilir bir küresel çözüm ortağı olmak.'
                    : 'To be a reliable global solution partner in the sector by promoting Turkish engineering and manufacturing at world standards.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === 'tr' ? 'Misyonumuz' : 'Our Mission'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  {language === 'tr'
                    ? 'Müşterilerimize ihtiyaçlarına uygun, kaliteli ve maliyet-etkin anahtar teslim çözümler sunarak üretim kapasitelerini artırmak.'
                    : 'To increase the production capacity of our customers by offering turnkey solutions that are suitable for their needs, high quality and cost-effective.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'tr' ? 'Değerlerimiz' : 'Our Values'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Turkey */}
        <section className="mb-20 rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="h-8 w-8" />
            <h2 className="text-3xl font-bold">
              {t('corporate.whyTurkey')}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyTurkey.map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/80">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold">{t('corporate.team')}</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'tr'
                ? 'Deneyimli mühendisler, proje yöneticileri ve saha uzmanlarından oluşan ekibimiz, her projeyi titizlikle yönetir. Müşteri memnuniyeti odaklı çalışma anlayışımızla, en zorlu projelerde bile başarıyı garantiliyoruz.'
                : 'Our team of experienced engineers, project managers and field specialists meticulously manages every project. With our customer satisfaction-oriented approach, we guarantee success even in the most challenging projects.'}
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/iletisim">
              {language === 'tr' ? 'Bizimle İletişime Geçin' : 'Contact Us'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Corporate;
