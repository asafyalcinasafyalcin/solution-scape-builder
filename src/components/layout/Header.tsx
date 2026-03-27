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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/cozumler', label: t('nav.solutions') },
    { 
      path: '/hazir-hatlar', 
      label: t('nav.readyLines'),
      children: [
        { path: '/hazir-hatlar/salca-domates', label: t('readyLines.tomato.title') },
        { path: '/hazir-hatlar/mayonez-ketcap-sos', label: t('readyLines.sauce.title') },
      ]
    },
    { 
      path: '/tekil-makineler', 
      label: t('nav.singleMachines'),
      children: [
        { path: '/tekil-makineler/sut-prosesi', label: t('singleMachines.dairy.title') },
        { path: '/tekil-makineler/dolum-paketleme', label: t('singleMachines.filling.title') },
      ]
    },
    { path: '/konfigurator', label: language === 'tr' ? 'Konfigüratör' : 'Configurator' },
    { path: '/ozel-projeler', label: t('nav.customProjects') },
    { path: '/hizmetler', label: t('nav.services') },
    { path: '/referanslar', label: t('nav.references') },
    { path: '/kurumsal', label: t('nav.corporate') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/iletisim', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="PROCESSTÜRK" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              item.children ? (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuTrigger 
                    className={cn(
                      "text-sm font-medium",
                      isActive(item.path) && "text-accent"
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.path}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium">{t('common.viewAll')}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={child.path}
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary focus:bg-secondary"
                            >
                              <div className="text-sm font-medium">{child.label}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive(item.path) && "text-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              )
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{language}</span>
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

          {/* CTA Button - Desktop */}
          <Button asChild className="hidden md:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground">
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
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors hover:text-accent",
                    isActive(item.path) && "text-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button asChild className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
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
