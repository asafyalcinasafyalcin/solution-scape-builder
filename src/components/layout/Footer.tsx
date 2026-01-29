import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { path: '/cozumler', label: t('nav.solutions') },
    { path: '/hazir-hatlar', label: t('nav.readyLines') },
    { path: '/tekil-makineler', label: t('nav.singleMachines') },
    { path: '/ozel-projeler', label: t('nav.customProjects') },
    { path: '/hizmetler', label: t('nav.services') },
    { path: '/referanslar', label: t('nav.references') },
  ];

  const corporateLinks = [
    { path: '/kurumsal', label: t('corporate.about') },
    { path: '/kurumsal#vizyon', label: t('corporate.vision') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/iletisim', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/905551234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <img src={logo} alt="PROCESSTÜRK" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm text-primary-foreground/80">
              {t('hero.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('corporate.title')}</h3>
            <ul className="space-y-2">
              {corporateLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-5 w-5 shrink-0" />
                <a href="tel:+905551234567" className="hover:text-primary-foreground">
                  +90 555 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-5 w-5 shrink-0" />
                <a href="mailto:info@processturk.com" className="hover:text-primary-foreground">
                  info@processturk.com
                </a>
              </li>
            </ul>
            <Button
              asChild
              className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('contact.whatsapp')}
              </a>
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-primary-foreground/60 md:flex-row md:text-left">
            <p>© {new Date().getFullYear()} PROCESSTÜRK. {t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
