import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const References = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: language === 'tr' ? 'Tümü' : 'All' },
    { id: 'food', label: t('references.food') },
    { id: 'dairy', label: t('references.dairy') },
    { id: 'custom', label: t('references.custom') },
  ];

  const projects = [
    {
      id: 1,
      title: language === 'tr' ? 'Salça Üretim Tesisi' : 'Tomato Paste Production Facility',
      category: 'food',
      location: 'Manisa, Türkiye',
      year: '2023',
      capacity: '5.000 kg/saat',
      description: language === 'tr' 
        ? 'MACLINE PRO serisi ile anahtar teslim salça üretim hattı kurulumu.'
        : 'Turnkey tomato paste production line installation with MACLINE PRO series.',
    },
    {
      id: 2,
      title: language === 'tr' ? 'Süt İşleme Tesisi' : 'Dairy Processing Facility',
      category: 'dairy',
      location: 'Konya, Türkiye',
      year: '2023',
      capacity: '10.000 L/gün',
      description: language === 'tr'
        ? 'Pastörizasyon, homojenizasyon ve dolum hatlarını içeren komple süt tesisi.'
        : 'Complete dairy facility including pasteurization, homogenization and filling lines.',
    },
    {
      id: 3,
      title: language === 'tr' ? 'Ketçap & Mayonez Fabrikası' : 'Ketchup & Mayonnaise Factory',
      category: 'food',
      location: 'Bursa, Türkiye',
      year: '2022',
      capacity: '1.500 L/saat',
      description: language === 'tr'
        ? 'SAUCE 1500 serisi ile yüksek kapasiteli sos üretim hattı.'
        : 'High capacity sauce production line with SAUCE 1500 series.',
    },
    {
      id: 4,
      title: language === 'tr' ? 'Yoğurt Üretim Hattı' : 'Yogurt Production Line',
      category: 'dairy',
      location: 'Balıkesir, Türkiye',
      year: '2023',
      capacity: '8.000 kap/saat',
      description: language === 'tr'
        ? 'Fermantasyon tanklarından dolum hattına kadar komple yoğurt üretim sistemi.'
        : 'Complete yogurt production system from fermentation tanks to filling line.',
    },
    {
      id: 5,
      title: language === 'tr' ? 'Özel Gıda Prosesi' : 'Custom Food Process',
      category: 'custom',
      location: 'İzmir, Türkiye',
      year: '2022',
      capacity: 'Özel',
      description: language === 'tr'
        ? 'Müşteri ihtiyacına özel tasarlanmış endüstriyel gıda işleme hattı.'
        : 'Industrial food processing line custom designed for customer needs.',
    },
    {
      id: 6,
      title: language === 'tr' ? 'Meyve Suyu Tesisi' : 'Fruit Juice Facility',
      category: 'food',
      location: 'Mersin, Türkiye',
      year: '2023',
      capacity: '3.000 L/saat',
      description: language === 'tr'
        ? 'MACLINE JUICE ile doğal meyve suyu üretim hattı kurulumu.'
        : 'Natural fruit juice production line installation with MACLINE JUICE.',
    },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('references.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'tr' 
              ? 'Türkiye ve yurt dışında tamamladığımız projelerden örnekler.'
              : 'Examples of projects we have completed in Turkey and abroad.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id ? 'bg-accent hover:bg-accent/90' : ''}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              {/* Image placeholder */}
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground/30">
                  {project.capacity}
                </span>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {project.year}
                  </div>
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            {language === 'tr' ? 'Sizin de böyle bir projeniz mi var?' : 'Do you have a similar project?'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            {language === 'tr' 
              ? 'Projenizi değerlendirelim ve size uygun çözümü sunalım.'
              : 'Let us evaluate your project and offer you the right solution.'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
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

export default References;
