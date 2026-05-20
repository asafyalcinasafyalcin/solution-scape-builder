import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: language === 'tr' ? 'Ana Sayfa' : 'Home' },
    { path: '/cozumler', label: t('nav.solutions') },
    { path: '/konfigurator', label: language === 'tr' ? 'Konfigüratör' : 'Configurator' },
    { path: '/sunum', label: t('sunum.nav') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="PROCESSTÜRK" className="h-9 w-auto" />
          <span className="hidden sm:inline text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            processturk.com
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-amber",
                isActive(item.path) ? "text-amber" : "text-foreground"
              )}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-amber rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 px-2">
                <Globe className="h-4 w-4" />
                <span className="uppercase text-xs">{language}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('tr')}>
                🇹🇷 Türkçe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA Button */}
          <Button asChild size="sm" className="hidden md:inline-flex bg-amber hover:bg-amber-dark text-white">
            <Link to="/iletisim">{t('hero.cta')}</Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block py-2.5 text-base font-medium transition-colors hover:text-amber",
                  isActive(item.path) && "text-amber"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="w-full mt-4 bg-amber hover:bg-amber-dark text-white">
              <Link to="/iletisim" onClick={() => setMobileMenuOpen(false)}>
                {t('hero.cta')}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;