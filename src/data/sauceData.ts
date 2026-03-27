// SAUCE Series - Mayonnaise, Ketchup & Sauce Production Lines

export interface SaucePackage {
  id: string;
  name: string;
  capacity: string;
  usage: string;
  productionType: string;
  description: string;
  includedEquipment: string[];
  optionalEquipment: string[];
  popular: boolean;
  specs: {
    tankCount: number;
    heatControl: string;
    automation: string;
    cip: string;
    filling: string;
  };
}

export const sosPackages: Record<string, SaucePackage> = {
  sauce500: {
    id: 'sauce500',
    name: 'SAUCE 500',
    capacity: '500 kg/saat',
    usage: 'Küçük / orta ölçekli üretim',
    productionType: 'Esnek reçeteler, yarı otomatik süreçler',
    description: 'Başlangıç seviyesi sos üretim hattı. Küçük ve orta ölçekli tesisler için ideal.',
    includedEquipment: [
      'Karıştırma ve pişirme tankı (500L)',
      'Isı kontrol sistemi',
      'Temel otomasyon altyapısı',
      'CIP uyumlu yapı',
      'Proses izleme sistemi',
      'Paslanmaz çelik yapı (AISI 304)',
    ],
    optionalEquipment: [
      'Dolum hattı entegrasyonu',
      'Paketleme hattı bağlantısı',
      'Gelişmiş otomasyon modülleri',
      'ERP / SCADA entegrasyonu',
    ],
    popular: false,
    specs: { tankCount: 1, heatControl: 'Standart', automation: 'Yarı otomatik', cip: 'Uyumlu', filling: 'Opsiyonel' },
  },
  sauce1000: {
    id: 'sauce1000',
    name: 'SAUCE 1000',
    capacity: '1000 kg/saat',
    usage: 'Orta ölçekli tesisler',
    productionType: 'Sürekli ve stabil üretim',
    description: 'Orta ölçekli tesisler için optimize edilmiş sos üretim hattı.',
    includedEquipment: [
      'Karıştırma ve pişirme tankları (2x500L)',
      'Gelişmiş ısı kontrol sistemi',
      'Otomatik otomasyon altyapısı',
      'CIP uyumlu yapı',
      'Proses izleme ve kayıt sistemi',
      'Paslanmaz çelik yapı (AISI 304/316)',
      'PLC kontrol paneli',
    ],
    optionalEquipment: [
      'Dolum hattı entegrasyonu',
      'Paketleme hattı bağlantısı',
      'Gelişmiş otomasyon modülleri',
      'ERP / SCADA entegrasyonu',
      'Uzaktan izleme sistemi',
    ],
    popular: true,
    specs: { tankCount: 2, heatControl: 'Gelişmiş', automation: 'Otomatik', cip: 'Tam uyumlu', filling: 'Opsiyonel' },
  },
  sauce1500: {
    id: 'sauce1500',
    name: 'SAUCE 1500',
    capacity: '1500 kg/saat',
    usage: 'Endüstriyel yüksek hacimli üretim',
    productionType: 'Tam otomatik hat',
    description: 'Yüksek kapasiteli endüstriyel sos üretim hattı. Maksimum verimlilik.',
    includedEquipment: [
      'Karıştırma ve pişirme tankları (3x500L veya 2x750L)',
      'Premium ısı kontrol sistemi',
      'Tam otomatik otomasyon altyapısı',
      'Entegre CIP sistemi',
      'Gelişmiş proses izleme ve kayıt',
      'Paslanmaz çelik yapı (AISI 316)',
      'PLC + HMI kontrol sistemi',
      'Otomatik hammadde besleme',
    ],
    optionalEquipment: [
      'Dolum hattı entegrasyonu',
      'Paketleme hattı bağlantısı',
      'İleri otomasyon modülleri',
      'ERP / SCADA / MES entegrasyonu',
      'Uzaktan izleme ve kontrol',
      'Enerji optimizasyon paketi',
    ],
    popular: false,
    specs: { tankCount: 3, heatControl: 'Premium', automation: 'Tam otomatik', cip: 'Entegre', filling: 'Opsiyonel' },
  },
};

export const saucePackageOrder = ['sauce500', 'sauce1000', 'sauce1500'] as const;

export const technicalSpecs = [
  { label: 'Malzeme', labelEn: 'Material', value: 'AISI 304 / 316' },
  { label: 'Enerji', labelEn: 'Power', value: '380V / 50Hz' },
  { label: 'Kontrol', labelEn: 'Control', value: 'PLC + HMI' },
  { label: 'Temizlik', labelEn: 'Cleaning', value: 'CIP Uyumlu' },
  { label: 'Garanti', labelEn: 'Warranty', value: '2 Yıl' },
];
