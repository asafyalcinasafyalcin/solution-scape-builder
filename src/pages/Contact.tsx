import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(language === 'tr' ? 'Web Sitesi İletişim Formu' : 'Website Contact Form');
    const body = encodeURIComponent(`
${t('contact.form.name')}: ${formData.name}
${t('contact.form.email')}: ${formData.email}
${t('contact.form.phone')}: ${formData.phone}
${t('contact.form.company')}: ${formData.company}

${t('contact.form.message')}:
${formData.message}
    `);
    window.location.href = `mailto:info@processturk.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'tr'
              ? 'Projeleriniz hakkında konuşmak veya sorularınızı sormak için bize ulaşın.'
              : 'Contact us to discuss your projects or ask your questions.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <MessageCircle className="h-6 w-6" />
                  WhatsApp
                </CardTitle>
                <CardDescription>
                  {language === 'tr' ? 'Hızlı yanıt için' : 'For quick response'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-green-500 hover:bg-green-600">
                  <a href="https://wa.me/905551234567" target="_blank" rel="noopener noreferrer">
                    {t('contact.whatsapp')}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('footer.contact')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {language === 'tr' ? 'Adres' : 'Address'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {language === 'tr' ? 'Telefon' : 'Phone'}
                    </p>
                    <a href="tel:+905551234567" className="text-sm text-muted-foreground hover:text-foreground">
                      +90 555 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">E-posta</p>
                    <a href="mailto:info@processturk.com" className="text-sm text-muted-foreground hover:text-foreground">
                      info@processturk.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {language === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'tr' ? 'Pzt - Cum: 09:00 - 18:00' : 'Mon - Fri: 09:00 - 18:00'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {language === 'tr' ? 'Teklif Formu' : 'Quote Form'}
              </CardTitle>
              <CardDescription>
                {language === 'tr'
                  ? 'Formu doldurun, en kısa sürede size dönüş yapalım.'
                  : 'Fill out the form and we will get back to you as soon as possible.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')} *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('contact.form.company')}</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.form.message')} *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    placeholder={language === 'tr' 
                      ? 'Projenizi veya ihtiyacınızı kısaca açıklayın...' 
                      : 'Briefly describe your project or needs...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="mr-2 h-5 w-5" />
                  {t('contact.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map placeholder */}
        <div className="mt-16 rounded-2xl bg-secondary h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground">
              {language === 'tr' ? 'Harita konumu' : 'Map location'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
