// Dairy Process Machines Data

export interface DairyMachine {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  capacities: { value: string; label: string; description: string }[];
  specs: { label: string; value: string }[];
  useCases: string[];
}

export const dairyMachines: DairyMachine[] = [
  {
    id: 'pasteurizer',
    name: 'Pasteurizer',
    nameTr: 'Pastörizatör',
    description: 'Süt ve süt ürünleri proseslerinde güvenilir ve kontrollü ısıl işlem çözümü.',
    capacities: [
      { value: '500', label: '500 L/saat', description: 'Pilot üretim' },
      { value: '1000', label: '1.000 L/saat', description: 'Orta ölçekli mandıralar' },
      { value: '2000', label: '2.000 L/saat', description: 'Bölgesel süt fabrikaları' },
      { value: '3000', label: '3.000 L/saat', description: 'Büyük üretim tesisleri' },
      { value: '5000', label: '5.000 L/saat', description: 'Endüstriyel hatlar' },
      { value: '10000', label: '10.000 L/saat', description: 'Büyük ölçekli fabrikalar' },
    ],
    specs: [
      { label: 'Kapasite', value: '500 - 20.000 L/saat' },
      { label: 'Çalışma Tipi', value: 'Plakalı / Borulu HTST' },
      { label: 'Isıtma', value: 'Buhar / Sıcak Su' },
      { label: 'Otomasyon', value: 'PLC + HMI' },
      { label: 'CIP', value: 'Tam Entegrasyon' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['İçme sütü', 'Yoğurt & ayran', 'Krema & tereyağı', 'Meyve suyu'],
  },
  {
    id: 'homogenizer',
    name: 'Homogenizer',
    nameTr: 'Homojenizatör',
    description: 'Ürün stabilitesini, kaliteyi ve raf ömrünü artıran kritik proses ekipmanı.',
    capacities: [
      { value: '500', label: '500 L/saat', description: 'Küçük ölçekli' },
      { value: '1000', label: '1.000 L/saat', description: 'Orta ölçekli' },
      { value: '2000', label: '2.000 L/saat', description: 'Endüstriyel' },
      { value: '3000', label: '3.000 L/saat', description: 'Yüksek hacim' },
      { value: '5000', label: '5.000 L/saat', description: 'Mega tesis' },
    ],
    specs: [
      { label: 'Basınç', value: '150 - 250 bar' },
      { label: 'Homojenizasyon', value: 'Çok Kademeli' },
      { label: 'Kontrol', value: 'Manuel / PLC' },
      { label: 'CIP', value: 'Tam Entegrasyon' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Pastörize süt', 'Yoğurt & ayran', 'Krema', 'Sos & emülsiyon'],
  },
  {
    id: 'cream-separator',
    name: 'Cream Separator',
    nameTr: 'Krema Separatörü',
    description: 'Sütteki yağ oranını hassas şekilde ayırarak standart üretim sağlayan ekipman.',
    capacities: [
      { value: '500', label: '500 L/saat', description: 'Küçük ölçekli' },
      { value: '1000', label: '1.000 L/saat', description: 'Orta ölçekli' },
      { value: '2000', label: '2.000 L/saat', description: 'Endüstriyel' },
      { value: '3000', label: '3.000 L/saat', description: 'Yüksek hacim' },
      { value: '5000', label: '5.000 L/saat', description: 'Büyük fabrikalar' },
    ],
    specs: [
      { label: 'Separasyon', value: 'Yüksek devirli santrifüj' },
      { label: 'Yağ Kontrolü', value: 'Ayarlanabilir' },
      { label: 'Kontrol', value: 'Manuel / PLC' },
      { label: 'CIP', value: 'Tam uyumlu' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Pastörize süt', 'Tereyağı üretimi', 'Krema & kaymak', 'Peynir hatları'],
  },
  {
    id: 'clarificator',
    name: 'Clarificator',
    nameTr: 'Temizleme Separatörü',
    description: 'Sütten yabancı maddelerin ve istenmeyen partiküllerin ayrıştırılması.',
    capacities: [
      { value: '1000', label: '1.000 L/saat', description: 'Küçük mandıralar' },
      { value: '3000', label: '3.000 L/saat', description: 'Orta ölçekli' },
      { value: '5000', label: '5.000 L/saat', description: 'Bölgesel fabrikalar' },
      { value: '10000', label: '10.000 L/saat', description: 'Endüstriyel' },
      { value: '15000', label: '15.000 L/saat', description: 'Mega tesis' },
    ],
    specs: [
      { label: 'Kapasite', value: '1.000 - 15.000 L/saat' },
      { label: 'Prensip', value: 'Disk Tipi Santrifüj' },
      { label: 'G-Kuvveti', value: '8.000 - 12.000 G' },
      { label: 'Otomasyon', value: 'PLC + HMI' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Ham süt alımı', 'Pastörizasyon öncesi', 'Peynir sütü', 'UHT süt'],
  },
  {
    id: 'vacuum-evaporator',
    name: 'Vacuum Evaporator',
    nameTr: 'Vakum Evaporatör',
    description: 'Sıvı ürünlerde kontrollü konsantrasyon sağlayan buharlaştırma sistemi.',
    capacities: [
      { value: '250', label: '250 kg/saat', description: 'Pilot üretim' },
      { value: '500', label: '500 kg/saat', description: 'Orta ölçekli' },
      { value: '1000', label: '1.000 kg/saat', description: 'Endüstriyel' },
      { value: '1500', label: '1.500 kg/saat', description: 'Yüksek hacim' },
      { value: '3000', label: '3.000+ kg/saat', description: 'Mega tesis' },
    ],
    specs: [
      { label: 'Proses', value: 'Vakum altında buharlaştırma' },
      { label: 'Evaporasyon', value: 'Tek / çok kademeli' },
      { label: 'Konsantrasyon', value: 'Ayarlanabilir brix' },
      { label: 'Kontrol', value: 'PLC kontrollü' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Salça üretimi', 'Meyve püresi', 'Yoğunlaştırılmış süt', 'Sos & ketçap'],
  },
  {
    id: 'butter-churn',
    name: 'Butter Churn',
    nameTr: 'Tereyağı Yayık Makinesi',
    description: 'Kremadan tereyağı üretimi için yüksek kapasiteli yayık makineleri.',
    capacities: [
      { value: '100', label: '100 kg/saat', description: 'Butik üretim' },
      { value: '250', label: '250 kg/saat', description: 'Orta ölçekli' },
      { value: '500', label: '500 kg/saat', description: 'Bölgesel fabrikalar' },
      { value: '750', label: '750 kg/saat', description: 'Büyük tesisler' },
      { value: '1000', label: '1.000 kg/saat', description: 'Endüstriyel' },
    ],
    specs: [
      { label: 'Kapasite', value: '100 - 1.000 kg/saat' },
      { label: 'Prensip', value: 'Sürekli Yayıklama' },
      { label: 'Krema Yağ Oranı', value: '%35 - 45' },
      { label: 'Otomasyon', value: 'PLC + HMI' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Endüstriyel tereyağı', 'Butik tereyağı', 'Organik tereyağı', 'Aromalı tereyağı'],
  },
  {
    id: 'cooker-line',
    name: 'Cooker Line',
    nameTr: 'Pişirme Hattı',
    description: 'Sos, ketçap, reçel ve benzeri ürünlerde kontrollü pişirme ve karışım hattı.',
    capacities: [
      { value: '300', label: '300 kg/saat', description: 'Küçük ölçekli' },
      { value: '500', label: '500 kg/saat', description: 'Orta ölçekli' },
      { value: '1000', label: '1.000 kg/saat', description: 'Endüstriyel' },
      { value: '1500', label: '1.500 kg/saat', description: 'Yüksek hacim' },
      { value: '3000', label: '3.000+ kg/saat', description: 'Mega tesis' },
    ],
    specs: [
      { label: 'Gövde', value: 'Çift cidarlı pişirme tankı' },
      { label: 'Isıtma', value: 'Buhar / sıcak su' },
      { label: 'Karıştırma', value: 'Homojen karıştırma' },
      { label: 'Kontrol', value: 'PLC kontrollü' },
      { label: 'Malzeme', value: 'AISI 304/316' },
    ],
    useCases: ['Ketçap & sos', 'Salça ön pişirme', 'Reçel & marmelat', 'Dolgu & şurup'],
  },
  {
    id: 'yogurt-filler',
    name: 'Yogurt Filler',
    nameTr: 'Yoğurt Dolum Makinesi',
    description: 'Yoğurt üretiminde hassas dolum, yüksek hijyen ve stabil kapasite.',
    capacities: [
      { value: '1000', label: '1.000 adet/saat', description: 'Küçük ölçekli' },
      { value: '2000', label: '2.000 adet/saat', description: 'Orta ölçekli' },
      { value: '4000', label: '4.000 adet/saat', description: 'Yarı otomatik' },
      { value: '6000', label: '6.000 adet/saat', description: 'Tam otomatik' },
      { value: '8000', label: '8.000+ adet/saat', description: 'Endüstriyel' },
    ],
    specs: [
      { label: 'Dolum', value: 'Pnömatik / servo kontrollü' },
      { label: 'Gramaj', value: 'Hassas ayarlanabilir' },
      { label: 'Nozullar', value: 'Damlatma önleyici' },
      { label: 'Kontrol', value: 'PLC kontrollü' },
      { label: 'CIP', value: 'Tam uyumlu' },
    ],
    useCases: ['Set yoğurt', 'Karıştırılmış yoğurt', 'Meyveli yoğurt', 'Ayran bazlı ürünler'],
  },
];
