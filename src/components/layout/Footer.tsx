import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { language, t } = useLanguage();

  const links = [
    { path: '/', label: language === 'tr' ? 'Ana Sayfa' : 'Home' },
    { path: '/cozumler', label: t('nav.solutions') },
    { path: '/konfigurator', label: language === 'tr' ? 'Konfigüratör' : 'Configurator' },
  ];

  return (
    <footer className="bg-navy-deep text-white">
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

      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="PROCESSTÜRK" className="h-10 w-auto brightness-0 invert" />
            <div className="hidden sm:block">
              <p className="text-xs tracking-[0.25em] uppercase text-amber font-semibold">processturk.com</p>
              <p className="text-xs text-steel mt-0.5">
                {language === 'tr' ? 'Endüstriyel proses çözümleri' : 'Industrial process solutions'}
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-white/80 hover:text-amber transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <a href="tel:+905551234567" className="flex items-center gap-2 text-sm text-white/80 hover:text-amber transition-colors">
              <Phone className="h-4 w-4 text-amber" />
              +90 555 123 45 67
            </a>
            <a href="mailto:info@processturk.com" className="flex items-center gap-2 text-sm text-white/80 hover:text-amber transition-colors">
              <Mail className="h-4 w-4 text-amber" />
              info@processturk.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} PROCESSTÜRK. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;