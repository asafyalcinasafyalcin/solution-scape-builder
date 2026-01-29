import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog = () => {
  const { t, language } = useLanguage();

  const articles = [
    {
      id: 1,
      slug: 'kapasite-nasil-hesaplanir',
      title: language === 'tr' ? 'Üretim Kapasitesi Nasıl Hesaplanır?' : 'How to Calculate Production Capacity?',
      excerpt: language === 'tr'
        ? 'Doğru kapasite hesaplama, yatırımınızın başarısı için kritik öneme sahiptir. Bu rehberde adım adım kapasite planlama yöntemlerini inceliyoruz.'
        : 'Correct capacity calculation is critical for the success of your investment. In this guide, we examine capacity planning methods step by step.',
      category: language === 'tr' ? 'Rehber' : 'Guide',
      date: '2024-01-15',
      readTime: '8 dk',
    },
    {
      id: 2,
      slug: 'dolum-hatti-secimi',
      title: language === 'tr' ? 'Dolum Hattı Seçiminde Dikkat Edilmesi Gerekenler' : 'Things to Consider When Choosing a Filling Line',
      excerpt: language === 'tr'
        ? 'Ürün viskozitesi, ambalaj tipi ve kapasite gereksinimlerine göre doğru dolum sistemini nasıl seçersiniz?'
        : 'How do you choose the right filling system according to product viscosity, packaging type and capacity requirements?',
      category: language === 'tr' ? 'Teknik' : 'Technical',
      date: '2024-01-10',
      readTime: '6 dk',
    },
    {
      id: 3,
      slug: 'sut-tesisi-kritik-ekipmanlar',
      title: language === 'tr' ? 'Süt Tesislerinde Kritik Ekipmanlar' : 'Critical Equipment in Dairy Facilities',
      excerpt: language === 'tr'
        ? 'Profesyonel bir süt işleme tesisi kurarken olmazsa olmaz ekipmanlar ve bunların seçim kriterleri.'
        : 'Must-have equipment when setting up a professional dairy processing facility and their selection criteria.',
      category: language === 'tr' ? 'Sektör' : 'Industry',
      date: '2024-01-05',
      readTime: '10 dk',
    },
    {
      id: 4,
      slug: 'anahtar-teslim-risk-yonetimi',
      title: language === 'tr' ? 'Anahtar Teslim Projelerde Risk Yönetimi' : 'Risk Management in Turnkey Projects',
      excerpt: language === 'tr'
        ? 'Büyük ölçekli projelerde karşılaşılabilecek riskler ve bunları minimize etme stratejileri.'
        : 'Risks that can be encountered in large-scale projects and strategies to minimize them.',
      category: language === 'tr' ? 'Yönetim' : 'Management',
      date: '2023-12-28',
      readTime: '7 dk',
    },
    {
      id: 5,
      slug: 'salca-uretim-teknolojileri',
      title: language === 'tr' ? 'Modern Salça Üretim Teknolojileri' : 'Modern Tomato Paste Production Technologies',
      excerpt: language === 'tr'
        ? 'Geleneksel yöntemlerden endüstriyel üretime: Salça üretiminde kullanılan modern teknolojiler.'
        : 'From traditional methods to industrial production: Modern technologies used in tomato paste production.',
      category: language === 'tr' ? 'Teknoloji' : 'Technology',
      date: '2023-12-20',
      readTime: '9 dk',
    },
    {
      id: 6,
      slug: 'pasturizasyon-yontemleri',
      title: language === 'tr' ? 'Pastörizasyon Yöntemleri Karşılaştırması' : 'Comparison of Pasteurization Methods',
      excerpt: language === 'tr'
        ? 'HTST, UHT ve diğer pastörizasyon yöntemlerinin avantajları, dezavantajları ve kullanım alanları.'
        : 'Advantages, disadvantages and areas of use of HTST, UHT and other pasteurization methods.',
      category: language === 'tr' ? 'Teknik' : 'Technical',
      date: '2023-12-15',
      readTime: '8 dk',
    },
  ];

  const categories = [
    { id: 'all', label: language === 'tr' ? 'Tümü' : 'All' },
    { id: 'rehber', label: language === 'tr' ? 'Rehber' : 'Guide' },
    { id: 'teknik', label: language === 'tr' ? 'Teknik' : 'Technical' },
    { id: 'sektor', label: language === 'tr' ? 'Sektör' : 'Industry' },
  ];

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'tr'
              ? 'Endüstriyel üretim, proses mühendisliği ve ekipman seçimi hakkında bilgi ve rehberler.'
              : 'Information and guides about industrial production, process engineering and equipment selection.'}
          </p>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Button key={cat.id} variant="outline" size="sm">
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {articles.map((article) => (
            <Card key={article.id} className="group relative overflow-hidden border-2 border-border transition-all hover:border-accent hover:shadow-lg">
              {/* Image placeholder */}
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-background rounded-full">
                  {article.category}
                </span>
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 h-auto text-accent">
                  {language === 'tr' ? 'Devamını Oku' : 'Read More'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all group-hover:w-full" />
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="rounded-2xl bg-secondary p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            {language === 'tr' ? 'Yeni içeriklerden haberdar olun' : 'Stay updated with new content'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'tr'
              ? 'Sektörel bilgiler ve rehberler e-posta adresinize gelsin.'
              : 'Get industry information and guides delivered to your email.'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/iletisim">
              {language === 'tr' ? 'İletişime Geç' : 'Contact Us'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
