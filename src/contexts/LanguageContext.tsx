import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navigation
    'nav.solutions': 'Çözümler',
    'nav.readyLines': 'Hazır Hatlar',
    'nav.singleMachines': 'Tekil Makineler',
    'nav.customProjects': 'Özel Projeler',
    'nav.services': 'Hizmetler',
    'nav.references': 'Referanslar',
    'nav.corporate': 'Kurumsal',
    'nav.blog': 'Blog / Rehber',
    'nav.contact': 'İletişim',
    
    // Hero
    'hero.title': 'Anahtar Teslim Üretim Tesisleri',
    'hero.subtitle': 'Hazır Hatlar • Tekil Makineler • Özel Projeler',
    'hero.description': 'Gıda üretiminden sektör bağımsız projelere kadar, ihtiyaca göre tasarlanan ve sahada çalışan sistemler kuruyoruz.',
    'hero.cta': 'Teklif Al',
    'hero.learnMore': 'Daha Fazla',
    
    // Quick Cards
    'card.readyLine.title': 'Hazır Hat Seç',
    'card.readyLine.desc': 'Salça, domates, mayonez, ketçap ve sos üretim hatları',
    'card.singleMachine.title': 'Tekil Makine Seç',
    'card.singleMachine.desc': 'Süt prosesi, dolum ve paketleme makineleri',
    'card.customProject.title': 'Özel Proje Başlat',
    'card.customProject.desc': 'Sektör bağımsız anahtar teslim çözümler',
    
    // Process Steps
    'process.title': 'Nasıl Çalışıyoruz?',
    'process.step1': 'Analiz',
    'process.step2': 'Konsept',
    'process.step3': 'Tedarik',
    'process.step4': 'Kurulum',
    'process.step5': 'Devreye Alma',
    'process.step6': 'Büyüme',
    
    // CTA
    'cta.title': 'Projenizi 2 dakikada tarif edin',
    'cta.subtitle': 'Ücretsiz ön değerlendirme',
    'cta.button': 'Hızlı Teklif Al',
    
    // Solutions
    'solutions.title': 'Çözümlerimiz',
    'solutions.turnkey.title': 'Anahtar Teslim Tesis Kurulumu',
    'solutions.turnkey.desc': 'Gıda tesisleri, süt & süt ürünleri, dolum & paketleme tesisleri',
    'solutions.engineering.title': 'Üretim Hattı Tasarımı & Mühendislik',
    'solutions.engineering.desc': 'Proses tasarımı, kapasite planlama, ekipman listeleri, yerleşim planları',
    'solutions.installation.title': 'Kurulum, Devreye Alma & Eğitim',
    'solutions.installation.desc': 'Saha koordinasyonu, commissioning, operatör eğitimi',
    
    // Ready Lines
    'readyLines.title': 'Hazır Hatlar',
    'readyLines.tomato.title': 'Salça & Domates İşleme Hatları',
    'readyLines.tomato.desc': 'Modüler, ölçeklenebilir üretim sistemleri',
    'readyLines.sauce.title': 'Mayonez, Ketçap & Sos Üretim Hatları',
    'readyLines.sauce.desc': 'Profesyonel, yüksek kapasiteli hat çözümleri',
    
    // Single Machines
    'singleMachines.title': 'Tekil Makineler',
    'singleMachines.dairy.title': 'Süt Prosesi Makineleri',
    'singleMachines.dairy.desc': 'Homojenizatör, separatör, pastörizatör ve daha fazlası',
    'singleMachines.filling.title': 'Dolum & Paketleme Makineleri',
    'singleMachines.filling.desc': 'Dolum, kapak kapama, etiketleme sistemleri',
    
    // Custom Projects
    'customProjects.title': 'Özel Projeler',
    'customProjects.hero': 'Katalogla sınırlı değiliz',
    'customProjects.heroDesc': 'Projenin ihtiyacını tanımlar, çalışan sistemi kurarız.',
    
    // Services
    'services.title': 'Hizmetlerimiz',
    'services.engineering': 'Proje & Mühendislik',
    'services.manufacturer': 'Üretici Organizasyonu',
    'services.tracking': 'Üretim Takibi & Test',
    'services.logistics': 'Lojistik',
    'services.installation': 'Kurulum & Devreye Alma',
    'services.training': 'Eğitim',
    'services.support': 'Teknik Servis & Yedek Parça',
    
    // References
    'references.title': 'Referanslarımız',
    'references.food': 'Gıda Projeleri',
    'references.dairy': 'Süt Projeleri',
    'references.custom': 'Özel Projeler',
    
    // Corporate
    'corporate.title': 'Kurumsal',
    'corporate.about': 'Hakkımızda',
    'corporate.vision': 'Vizyon & Misyon',
    'corporate.whyTurkey': 'Neden Türkiye Üreticileri?',
    'corporate.team': 'Ekibimiz',
    
    // Blog
    'blog.title': 'Blog & Rehber',
    
    // Contact
    'contact.title': 'İletişim',
    'contact.form.name': 'Ad Soyad',
    'contact.form.email': 'E-posta',
    'contact.form.phone': 'Telefon',
    'contact.form.company': 'Firma Adı',
    'contact.form.message': 'Mesajınız',
    'contact.form.submit': 'Gönder',
    'contact.whatsapp': 'WhatsApp ile İletişim',
    
    // Footer
    'footer.rights': 'Tüm hakları saklıdır.',
    'footer.quickLinks': 'Hızlı Bağlantılar',
    'footer.contact': 'İletişim Bilgileri',
    
    // Line Builder
    'lineBuilder.title': 'Kendi Dolum Hattınızı Oluşturun',
    'lineBuilder.subtitle': 'Ürün tipinize, kapasitenize ve ambalaj tercihinize göre hat yapılandırmanızı oluşturun.',
    'lineBuilder.step1': 'Ürün Tipi',
    'lineBuilder.step2': 'Kapasite',
    'lineBuilder.step3': 'Ambalaj Tipi',
    'lineBuilder.step4': 'Hat Ekipmanları',
    'lineBuilder.step1.desc': 'Dolum yapılacak ürünün tipini seçin.',
    'lineBuilder.step2.desc': 'Saatlik üretim kapasitenizi belirleyin.',
    'lineBuilder.step3.desc': 'Kullanacağınız ambalaj tipini seçin.',
    'lineBuilder.step4.desc': 'Önerilen ekipmanlar otomatik seçildi. İhtiyacınıza göre ekleyip çıkarabilirsiniz.',
    'lineBuilder.summary': 'Hat Özeti',
    'lineBuilder.getQuote': 'Bu Hat İçin Teklif Al',
    'lineBuilder.reset': 'Sıfırla',
    'lineBuilder.product.liquid': 'Sıvı',
    'lineBuilder.product.semiFluid': 'Yarı Akışkan',
    'lineBuilder.product.viscous': 'Viskoz',
    'lineBuilder.product.powder': 'Toz / Granül',
    'lineBuilder.product.liquid.desc': 'Su, süt, meyve suyu',
    'lineBuilder.product.semi-fluid.desc': 'Yoğurt, bal, reçel',
    'lineBuilder.product.viscous.desc': 'Salça, ketçap, mayonez',
    'lineBuilder.product.powder.desc': 'Toz gıda, baharat, granül',
    'lineBuilder.capacity.small': 'Küçük',
    'lineBuilder.capacity.medium': 'Orta',
    'lineBuilder.capacity.large': 'Büyük',
    'lineBuilder.capacity.industrial': 'Endüstriyel',
    'lineBuilder.capacity.small.desc': '500–2.000 adet/saat',
    'lineBuilder.capacity.medium.desc': '2.000–5.000 adet/saat',
    'lineBuilder.capacity.large.desc': '5.000–10.000 adet/saat',
    'lineBuilder.capacity.industrial.desc': '10.000+ adet/saat',
    'lineBuilder.packaging.glass': 'Cam Şişe',
    'lineBuilder.packaging.pet': 'Pet Şişe',
    'lineBuilder.packaging.tin': 'Teneke Kutu',
    'lineBuilder.packaging.pouch': 'Pouch / Doypack',
    'lineBuilder.packaging.jar': 'Kavanoz',
    'lineBuilder.packaging.ibc': 'Bidon / IBC',
    'lineBuilder.equipment.filler': 'Dolum Makinesi',
    'lineBuilder.equipment.capper': 'Kapak Kapama',
    'lineBuilder.equipment.labeler': 'Etiketleme',
    'lineBuilder.equipment.shrink': 'Shrink Ambalaj',
    'lineBuilder.equipment.conveyor': 'Konveyör Sistemi',
    'lineBuilder.equipment.uv': 'UV / Sterilizasyon',
    'lineBuilder.equipment.accumulation': 'Birikim Masası',

    // Common
    'common.explore': 'İncele',
    'common.learnMore': 'Detaylı Bilgi',
    'common.getQuote': 'Teklif Al',
    'common.viewAll': 'Tümünü Gör',
    'common.back': 'Geri',
    'common.compare': 'Karşılaştır',
  },
  en: {
    // Navigation
    'nav.solutions': 'Solutions',
    'nav.readyLines': 'Ready Lines',
    'nav.singleMachines': 'Single Machines',
    'nav.customProjects': 'Custom Projects',
    'nav.services': 'Services',
    'nav.references': 'References',
    'nav.corporate': 'Corporate',
    'nav.blog': 'Blog / Guide',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Turnkey Production Facilities',
    'hero.subtitle': 'Ready Lines • Single Machines • Custom Projects',
    'hero.description': 'From food production to industry-independent projects, we design and install systems tailored to your needs.',
    'hero.cta': 'Get Quote',
    'hero.learnMore': 'Learn More',
    
    // Quick Cards
    'card.readyLine.title': 'Select Ready Line',
    'card.readyLine.desc': 'Tomato paste, tomato, mayonnaise, ketchup and sauce production lines',
    'card.singleMachine.title': 'Select Single Machine',
    'card.singleMachine.desc': 'Dairy process, filling and packaging machines',
    'card.customProject.title': 'Start Custom Project',
    'card.customProject.desc': 'Industry-independent turnkey solutions',
    
    // Process Steps
    'process.title': 'How We Work',
    'process.step1': 'Analysis',
    'process.step2': 'Concept',
    'process.step3': 'Procurement',
    'process.step4': 'Installation',
    'process.step5': 'Commissioning',
    'process.step6': 'Growth',
    
    // CTA
    'cta.title': 'Describe your project in 2 minutes',
    'cta.subtitle': 'Free preliminary evaluation',
    'cta.button': 'Quick Quote',
    
    // Solutions
    'solutions.title': 'Our Solutions',
    'solutions.turnkey.title': 'Turnkey Facility Installation',
    'solutions.turnkey.desc': 'Food facilities, dairy products, filling & packaging facilities',
    'solutions.engineering.title': 'Production Line Design & Engineering',
    'solutions.engineering.desc': 'Process design, capacity planning, equipment lists, layout plans',
    'solutions.installation.title': 'Installation, Commissioning & Training',
    'solutions.installation.desc': 'Field coordination, commissioning, operator training',
    
    // Ready Lines
    'readyLines.title': 'Ready Lines',
    'readyLines.tomato.title': 'Tomato Paste & Tomato Processing Lines',
    'readyLines.tomato.desc': 'Modular, scalable production systems',
    'readyLines.sauce.title': 'Mayonnaise, Ketchup & Sauce Production Lines',
    'readyLines.sauce.desc': 'Professional, high-capacity line solutions',
    
    // Single Machines
    'singleMachines.title': 'Single Machines',
    'singleMachines.dairy.title': 'Dairy Process Machines',
    'singleMachines.dairy.desc': 'Homogenizer, separator, pasteurizer and more',
    'singleMachines.filling.title': 'Filling & Packaging Machines',
    'singleMachines.filling.desc': 'Filling, capping, labeling systems',
    
    // Custom Projects
    'customProjects.title': 'Custom Projects',
    'customProjects.hero': 'Not limited by catalog',
    'customProjects.heroDesc': 'We define the project needs and build the working system.',
    
    // Services
    'services.title': 'Our Services',
    'services.engineering': 'Project & Engineering',
    'services.manufacturer': 'Manufacturer Organization',
    'services.tracking': 'Production Tracking & Testing',
    'services.logistics': 'Logistics',
    'services.installation': 'Installation & Commissioning',
    'services.training': 'Training',
    'services.support': 'Technical Support & Spare Parts',
    
    // References
    'references.title': 'Our References',
    'references.food': 'Food Projects',
    'references.dairy': 'Dairy Projects',
    'references.custom': 'Custom Projects',
    
    // Corporate
    'corporate.title': 'Corporate',
    'corporate.about': 'About Us',
    'corporate.vision': 'Vision & Mission',
    'corporate.whyTurkey': 'Why Turkish Manufacturers?',
    'corporate.team': 'Our Team',
    
    // Blog
    'blog.title': 'Blog & Guide',
    
    // Contact
    'contact.title': 'Contact',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.company': 'Company Name',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Submit',
    'contact.whatsapp': 'Contact via WhatsApp',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Information',
    
    // Line Builder
    'lineBuilder.title': 'Build Your Own Filling Line',
    'lineBuilder.subtitle': 'Configure your line based on product type, capacity, and packaging preference.',
    'lineBuilder.step1': 'Product Type',
    'lineBuilder.step2': 'Capacity',
    'lineBuilder.step3': 'Packaging Type',
    'lineBuilder.step4': 'Line Equipment',
    'lineBuilder.step1.desc': 'Select the type of product to be filled.',
    'lineBuilder.step2.desc': 'Define your hourly production capacity.',
    'lineBuilder.step3.desc': 'Choose the packaging type you will use.',
    'lineBuilder.step4.desc': 'Recommended equipment auto-selected. Add or remove as needed.',
    'lineBuilder.summary': 'Line Summary',
    'lineBuilder.getQuote': 'Get Quote for This Line',
    'lineBuilder.reset': 'Reset',
    'lineBuilder.product.liquid': 'Liquid',
    'lineBuilder.product.semiFluid': 'Semi-Fluid',
    'lineBuilder.product.viscous': 'Viscous',
    'lineBuilder.product.powder': 'Powder / Granule',
    'lineBuilder.product.liquid.desc': 'Water, milk, fruit juice',
    'lineBuilder.product.semi-fluid.desc': 'Yogurt, honey, jam',
    'lineBuilder.product.viscous.desc': 'Paste, ketchup, mayonnaise',
    'lineBuilder.product.powder.desc': 'Powder food, spice, granule',
    'lineBuilder.capacity.small': 'Small',
    'lineBuilder.capacity.medium': 'Medium',
    'lineBuilder.capacity.large': 'Large',
    'lineBuilder.capacity.industrial': 'Industrial',
    'lineBuilder.capacity.small.desc': '500–2,000 units/hour',
    'lineBuilder.capacity.medium.desc': '2,000–5,000 units/hour',
    'lineBuilder.capacity.large.desc': '5,000–10,000 units/hour',
    'lineBuilder.capacity.industrial.desc': '10,000+ units/hour',
    'lineBuilder.packaging.glass': 'Glass Bottle',
    'lineBuilder.packaging.pet': 'PET Bottle',
    'lineBuilder.packaging.tin': 'Tin Can',
    'lineBuilder.packaging.pouch': 'Pouch / Doypack',
    'lineBuilder.packaging.jar': 'Jar',
    'lineBuilder.packaging.ibc': 'Drum / IBC',
    'lineBuilder.equipment.filler': 'Filling Machine',
    'lineBuilder.equipment.capper': 'Capper',
    'lineBuilder.equipment.labeler': 'Labeler',
    'lineBuilder.equipment.shrink': 'Shrink Wrapper',
    'lineBuilder.equipment.conveyor': 'Conveyor System',
    'lineBuilder.equipment.uv': 'UV / Sterilization',
    'lineBuilder.equipment.accumulation': 'Accumulation Table',

    // Common
    'common.explore': 'Explore',
    'common.learnMore': 'Learn More',
    'common.getQuote': 'Get Quote',
    'common.viewAll': 'View All',
    'common.back': 'Back',
    'common.compare': 'Compare',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
