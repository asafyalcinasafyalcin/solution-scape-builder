// MACLINE Series - Tomato & Paste Processing Lines

export interface MaclinePackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  products: string[];
  capacity: string;
  electricity: string;
  steam: string;
  water: string;
  idealFor: string;
  dualLine?: boolean;
  dualLineCapacity?: string;
  isPopular?: boolean;
}

export interface OptionalItem {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export const packages: Record<string, MaclinePackage> = {
  eco: {
    id: 'eco',
    name: 'MACLINE ECO',
    price: 78000,
    currency: 'USD',
    products: ['Domates salçası'],
    capacity: '6,000 kg/gün',
    electricity: '17 kW/h',
    steam: '150 kg/h',
    water: '400 L/h',
    idealFor: 'Küçük ölçekli işletmeler ve giriş seviyesi üretim',
  },
  plus: {
    id: 'plus',
    name: 'MACLINE PLUS',
    price: 90000,
    currency: 'USD',
    products: ['Domates salçası', 'Ketçap', 'Acı sos', 'Barbekü sos'],
    capacity: '6,000 kg/gün',
    electricity: '17 kW/h',
    steam: '150 kg/h',
    water: '400 L/h',
    idealFor: 'Sos çeşitliliği isteyen orta ölçekli işletmeler',
    isPopular: true,
  },
  pro: {
    id: 'pro',
    name: 'MACLINE PRO',
    price: 126000,
    currency: 'USD',
    products: ['Domates salçası', 'Ketçap', 'Acı sos', 'Barbekü sos'],
    capacity: '12,000 kg/gün',
    electricity: '17 kW/h',
    steam: '150 kg/h',
    water: '400 L/h',
    idealFor: 'Yüksek kapasite ihtiyacı olan büyük işletmeler',
    dualLine: true,
    dualLineCapacity: '12,000 kg/gün toplam',
  },
  premium: {
    id: 'premium',
    name: 'MACLINE PREMIUM',
    price: 162000,
    currency: 'USD',
    products: ['Domates salçası', 'Biber salçası', 'Ketçap', 'Acı sos', 'Barbekü sos'],
    capacity: '6,000 kg/gün',
    electricity: '17 kW/h',
    steam: '150 kg/h',
    water: '400 L/h',
    idealFor: 'Tam ürün yelpazesi isteyen profesyonel üreticiler',
  },
  juice: {
    id: 'juice',
    name: 'MACLINE JUICE',
    price: 102000,
    currency: 'USD',
    products: ['Meyve suyu', 'Nektar', 'Marmelat', 'Reçel'],
    capacity: '6,000 kg/gün',
    electricity: '17 kW/h',
    steam: '150 kg/h',
    water: '400 L/h',
    idealFor: 'Meyve işleme tesisleri, içecek üreticileri',
  },
};

export const optionalItems: OptionalItem[] = [
  { id: 'manual-label', name: 'Manuel Etiketleme Makinesi', price: 840, currency: 'USD' },
  { id: 'semi-auto-label', name: 'Yarı Otomatik Etiketleme Makinesi', price: 1620, currency: 'USD' },
  { id: 'jar-capper', name: 'Yarı Otomatik Kavanoz Kapak Kapatma Makinesi', price: 3900, currency: 'USD' },
  { id: 'can-seamer', name: 'Konserve Kapatma Makinesi', price: 7200, currency: 'USD' },
  { id: 'barcode-printer', name: 'Barkod Yazıcı', price: 9600, currency: 'USD' },
  { id: 'sachet-machine', name: 'Sachet Ambalaj Makinesi', price: 61800, currency: 'EUR' },
];

export const packageOrder = ['eco', 'plus', 'pro', 'premium', 'juice'] as const;

export const comparisonFeatures = [
  { key: 'products', label: 'Üretilebilen Ürünler', labelEn: 'Products' },
  { key: 'capacity', label: 'Günlük Kapasite', labelEn: 'Daily Capacity' },
  { key: 'dualLine', label: 'Çift Hat', labelEn: 'Dual Line' },
  { key: 'electricity', label: 'Elektrik', labelEn: 'Electricity' },
  { key: 'steam', label: 'Buhar', labelEn: 'Steam' },
  { key: 'water', label: 'Su', labelEn: 'Water' },
  { key: 'idealFor', label: 'Kimler İçin', labelEn: 'Ideal For' },
];

export function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString('tr-TR')} ${currency}`;
}

export function calculateTotal(packageId: string | null, selectedAddonIds: string[]): { usd: number; eur: number } {
  let usd = 0;
  let eur = 0;
  if (packageId && packages[packageId]) {
    usd += packages[packageId].price;
  }
  selectedAddonIds.forEach((id) => {
    const item = optionalItems.find((i) => i.id === id);
    if (item) {
      if (item.currency === 'USD') usd += item.price;
      else if (item.currency === 'EUR') eur += item.price;
    }
  });
  return { usd, eur };
}
