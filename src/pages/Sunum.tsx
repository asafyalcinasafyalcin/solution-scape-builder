import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Wrench,
  PackageSearch,
  Workflow,
  HardHat,
  Rocket,
  CheckCircle2,
  Globe2,
  Layers,
  Scale,
  Sparkles,
  TrendingUp,
  Building2,
  Mail,
  Factory,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PROCESSTURK_NAVY = '#071739';
const PROCESSTURK_COPPER = '#A68868';
const PROCESSTURK_BEIGE = '#E3C39D';
const PROCESSTURK_OFFWHITE = '#F6F4F0';

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-3">
    <span className="block h-px w-8" style={{ backgroundColor: PROCESSTURK_COPPER }} />
    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#A68868]">
      {children}
    </span>
  </div>
);

const SectionTitle = ({
  primary,
  accent,
}: {
  primary: string;
  accent?: string;
}) => (
  <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-[#071739]">
    {primary}
    {accent && (
      <>
        {' '}
        <span className="italic font-light text-[#1E4E79]">{accent}</span>
      </>
    )}
  </h2>
);

const Sunum = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const approachCards = [
    { icon: Wrench, t: 'sunum.approach.card1' },
    { icon: PackageSearch, t: 'sunum.approach.card2' },
    { icon: Workflow, t: 'sunum.approach.card3' },
    { icon: HardHat, t: 'sunum.approach.card4' },
    { icon: Rocket, t: 'sunum.approach.card5' },
  ];

  const processSteps = [
    'sunum.process.step1',
    'sunum.process.step2',
    'sunum.process.step3',
    'sunum.process.step4',
    'sunum.process.step5',
    'sunum.process.step6',
    'sunum.process.step7',
  ];

  const coreServices = [
    'sunum.services.core1',
    'sunum.services.core2',
    'sunum.services.core3',
    'sunum.services.core4',
    'sunum.services.core5',
    'sunum.services.core6',
    'sunum.services.core7',
  ];

  const additionalServices = [
    'sunum.services.add1',
    'sunum.services.add2',
    'sunum.services.add3',
    'sunum.services.add4',
    'sunum.services.add5',
    'sunum.services.add6',
    'sunum.services.add7',
    'sunum.services.add8',
  ];

  const valueCards = [
    { icon: Layers, t: 'sunum.value.card1' },
    { icon: Factory, t: 'sunum.value.card2' },
    { icon: Scale, t: 'sunum.value.card3' },
    { icon: Globe2, t: 'sunum.value.card4' },
    { icon: TrendingUp, t: 'sunum.value.card5' },
    { icon: Sparkles, t: 'sunum.value.card6' },
  ];

  const configurations = [
    {
      label: 'sunum.config.entry.label',
      tag: 'sunum.config.entry.tag',
      desc: 'sunum.config.entry.desc',
      bullets: ['sunum.config.entry.b1', 'sunum.config.entry.b2', 'sunum.config.entry.b3'],
      featured: false,
    },
    {
      label: 'sunum.config.standard.label',
      tag: 'sunum.config.standard.tag',
      desc: 'sunum.config.standard.desc',
      bullets: [
        'sunum.config.standard.b1',
        'sunum.config.standard.b2',
        'sunum.config.standard.b3',
      ],
      featured: true,
    },
    {
      label: 'sunum.config.advanced.label',
      tag: 'sunum.config.advanced.tag',
      desc: 'sunum.config.advanced.desc',
      bullets: [
        'sunum.config.advanced.b1',
        'sunum.config.advanced.b2',
        'sunum.config.advanced.b3',
      ],
      featured: false,
    },
  ];

  const nextSteps = [
    'sunum.cta.step1',
    'sunum.cta.step2',
    'sunum.cta.step3',
    'sunum.cta.step4',
  ];

  return (
    <div className="bg-[#F6F4F0] text-[#1B1F24]">
      {/* ─────────────────────── HERO ─────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: PROCESSTURK_NAVY }}
      >
        {/* layered background decorations */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(166,136,104,0.35) 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(30,78,121,0.6) 0%, transparent 50%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 lg:pt-36 pb-28 lg:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="mb-8 flex items-center gap-3">
                <span
                  className="block h-px w-10"
                  style={{ backgroundColor: PROCESSTURK_COPPER }}
                />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-[#E3C39D]">
                  {t('sunum.hero.eyebrow')}
                </span>
              </div>

              <h1 className="font-semibold leading-[1.02] tracking-tight">
                <span className="block text-[clamp(2.5rem,7vw,6rem)] text-white">
                  {t('sunum.hero.title1')}
                </span>
                <span className="block text-[clamp(2.5rem,7vw,6rem)] text-white/70 italic font-light">
                  {t('sunum.hero.title2')}
                </span>
                <span className="block mt-4 text-[clamp(2.5rem,7vw,6rem)] text-white">
                  {t('sunum.hero.title3')}
                </span>
                <span
                  className="block text-[clamp(2.5rem,7vw,6rem)] italic font-light"
                  style={{ color: PROCESSTURK_BEIGE }}
                >
                  {t('sunum.hero.title4')}
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pl-6 space-y-8">
              <p className="text-base lg:text-lg leading-relaxed text-white/75 max-w-md">
                {t('sunum.hero.desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/iletisim"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all"
                  style={{ backgroundColor: PROCESSTURK_COPPER, color: PROCESSTURK_NAVY }}
                >
                  {t('sunum.hero.cta')}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.25}
                  />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium border border-white/25 text-white hover:bg-white/10 transition-colors"
                >
                  {t('sunum.hero.secondary')}
                </a>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
                <span
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PROCESSTURK_COPPER }}
                />
                {t('sunum.hero.tagBadge')}
              </div>
            </div>
          </div>
        </div>

        {/* hero base gradient */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(7,23,57,0.4) 60%, #071739 100%)',
          }}
        />
      </section>

      {/* ─────────────────── POSITIONING STATEMENT ─────────────────── */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="mb-10">
            <Eyebrow>{t('sunum.positioning.eyebrow')}</Eyebrow>
          </div>
          <SectionTitle
            primary={t('sunum.positioning.title')}
            accent={t('sunum.positioning.titleAccent')}
          />
          <p className="mt-10 max-w-3xl text-lg lg:text-xl leading-relaxed text-[#4B6382]">
            {t('sunum.positioning.desc')}
          </p>
        </div>
      </section>

      {/* ─────────────────────── APPROACH ─────────────────────── */}
      <section
        className="relative"
        style={{ backgroundColor: PROCESSTURK_OFFWHITE }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <Eyebrow>{t('sunum.approach.eyebrow')}</Eyebrow>
              </div>
              <SectionTitle
                primary={t('sunum.approach.title')}
                accent={t('sunum.approach.titleAccent')}
              />
            </div>
            <div className="lg:col-span-5 lg:pt-10">
              <p className="text-base lg:text-lg leading-relaxed text-[#4B6382]">
                {t('sunum.approach.desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {approachCards.map(({ icon: Icon, t: key }, idx) => (
              <div
                key={key}
                className="group relative bg-white border border-[#CDD5DB] rounded-2xl p-6 transition-all hover:border-[#A68868] hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(7,23,57,0.25)]"
              >
                <div
                  className="absolute top-6 right-6 text-xs font-mono tracking-wider"
                  style={{ color: PROCESSTURK_COPPER }}
                >
                  0{idx + 1}
                </div>
                <div
                  className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#071739' }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-[#071739] mb-2 leading-snug">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[#4B6382]">
                  {t(`${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PROCESS FLOW ─────────────────────── */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="mb-16">
            <div className="mb-6">
              <Eyebrow>{t('sunum.process.eyebrow')}</Eyebrow>
            </div>
            <SectionTitle
              primary={t('sunum.process.title')}
              accent={t('sunum.process.titleAccent')}
            />
          </div>

          <div className="relative">
            {/* horizontal connecting line */}
            <div
              aria-hidden
              className="hidden lg:block absolute top-7 left-7 right-7 h-px"
              style={{
                background: `linear-gradient(90deg, ${PROCESSTURK_COPPER} 0%, ${PROCESSTURK_COPPER}40 50%, ${PROCESSTURK_COPPER} 100%)`,
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-10 gap-x-4 lg:gap-x-2">
              {processSteps.map((stepKey, idx) => (
                <div key={stepKey} className="relative flex flex-col items-center text-center">
                  <div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white border-2"
                    style={{ borderColor: PROCESSTURK_NAVY }}
                  >
                    <span className="text-sm font-semibold text-[#071739]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-snug text-[#071739] px-1 max-w-[140px]">
                    {t(stepKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── BIG NUMBERS ─────────────────────── */}
      <section className="relative text-white" style={{ backgroundColor: PROCESSTURK_NAVY }}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(166,136,104,0.5) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="mb-16">
            <div className="mb-6">
              <Eyebrow>{t('sunum.numbers.eyebrow')}</Eyebrow>
            </div>
            <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-white">
              {t('sunum.numbers.title')}{' '}
              <span className="italic font-light" style={{ color: PROCESSTURK_BEIGE }}>
                {t('sunum.numbers.titleAccent')}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[
              {
                v: 'sunum.numbers.stat1Value',
                l: 'sunum.numbers.stat1Label',
                d: 'sunum.numbers.stat1Desc',
              },
              {
                v: 'sunum.numbers.stat2Value',
                l: 'sunum.numbers.stat2Label',
                d: 'sunum.numbers.stat2Desc',
              },
              {
                v: 'sunum.numbers.stat3Value',
                l: 'sunum.numbers.stat3Label',
                d: 'sunum.numbers.stat3Desc',
              },
            ].map((s) => (
              <div
                key={s.v}
                className="bg-[#071739] p-10 lg:p-12 flex flex-col justify-between min-h-[280px]"
              >
                <div
                  className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-tight"
                  style={{ color: PROCESSTURK_BEIGE }}
                >
                  {t(s.v)}
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white mb-3 mt-8">
                    {t(s.l)}
                  </div>
                  <p className="text-sm leading-relaxed text-white/65 max-w-xs">
                    {t(s.d)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── SERVICE AREAS ─────────────────────── */}
      <section id="services" className="relative bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <Eyebrow>{t('sunum.services.eyebrow')}</Eyebrow>
              </div>
              <SectionTitle
                primary={t('sunum.services.title')}
                accent={t('sunum.services.titleAccent')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core */}
            <div
              className="rounded-3xl p-8 lg:p-10 text-white"
              style={{ backgroundColor: PROCESSTURK_NAVY }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="h-5 w-5" style={{ color: PROCESSTURK_BEIGE }} />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                  {t('sunum.services.coreLabel')}
                </span>
              </div>
              <ul className="space-y-0">
                {coreServices.map((key, idx) => (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-4 py-4 border-t border-white/10 first:border-t-0"
                  >
                    <span className="text-base lg:text-lg leading-snug">{t(key)}</span>
                    <span
                      className="shrink-0 text-xs font-mono"
                      style={{ color: PROCESSTURK_COPPER }}
                    >
                      0{idx + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional */}
            <div className="rounded-3xl p-8 lg:p-10 border border-[#CDD5DB] bg-[#F6F4F0]">
              <div className="flex items-center gap-3 mb-8">
                <Layers className="h-5 w-5" style={{ color: PROCESSTURK_COPPER }} />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4B6382]">
                  {t('sunum.services.additionalLabel')}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {additionalServices.map((key, idx) => (
                  <li
                    key={key}
                    className={
                      'flex items-start gap-3 py-3.5 border-t border-[#CDD5DB] ' +
                      (idx < 2 ? 'sm:border-t-0 ' : '') +
                      (idx === 0 ? 'border-t-0' : '')
                    }
                  >
                    <span
                      className="mt-2 block h-1 w-1 rounded-full shrink-0"
                      style={{ backgroundColor: PROCESSTURK_COPPER }}
                    />
                    <span className="text-sm lg:text-base leading-snug text-[#1B1F24]">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── VALUE PROPOSITIONS ─────────────────── */}
      <section style={{ backgroundColor: PROCESSTURK_OFFWHITE }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <div className="mb-6">
                <Eyebrow>{t('sunum.value.eyebrow')}</Eyebrow>
              </div>
              <SectionTitle
                primary={t('sunum.value.title')}
                accent={t('sunum.value.titleAccent')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#CDD5DB] rounded-3xl overflow-hidden border border-[#CDD5DB]">
            {valueCards.map(({ icon: Icon, t: key }, idx) => (
              <div
                key={key}
                className="bg-white p-8 lg:p-10 flex flex-col gap-6 min-h-[260px]"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: PROCESSTURK_COPPER,
                      backgroundColor: PROCESSTURK_OFFWHITE,
                    }}
                  >
                    <Icon className="h-5 w-5" color={PROCESSTURK_NAVY} strokeWidth={1.75} />
                  </div>
                  <span
                    className="text-xs font-mono tracking-wider"
                    style={{ color: PROCESSTURK_COPPER }}
                  >
                    0{idx + 1}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#071739] leading-snug">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B6382]">
                    {t(`${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CONFIGURATION COMPARISON ─────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="mb-16">
            <div className="mb-6">
              <Eyebrow>{t('sunum.config.eyebrow')}</Eyebrow>
            </div>
            <SectionTitle
              primary={t('sunum.config.title')}
              accent={t('sunum.config.titleAccent')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {configurations.map((cfg) => (
              <div
                key={cfg.label}
                className={
                  cfg.featured
                    ? 'relative rounded-3xl p-8 lg:p-10 text-white shadow-[0_30px_60px_-30px_rgba(7,23,57,0.45)]'
                    : 'relative rounded-3xl p-8 lg:p-10 bg-white border border-[#CDD5DB]'
                }
                style={cfg.featured ? { backgroundColor: PROCESSTURK_NAVY } : undefined}
              >
                {cfg.featured && (
                  <div
                    className="absolute -top-3 left-8 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: PROCESSTURK_COPPER,
                      color: PROCESSTURK_NAVY,
                    }}
                  >
                    {t(cfg.tag)}
                  </div>
                )}

                <div
                  className={
                    'mb-3 text-xs font-semibold uppercase tracking-[0.2em] ' +
                    (cfg.featured ? 'text-white/65' : 'text-[#A68868]')
                  }
                >
                  {!cfg.featured && t(cfg.tag)}
                  {cfg.featured && t('sunum.config.eyebrow')}
                </div>
                <h3
                  className={
                    'text-3xl lg:text-4xl font-semibold tracking-tight ' +
                    (cfg.featured ? 'text-white' : 'text-[#071739]')
                  }
                >
                  {t(cfg.label)}
                </h3>
                <p
                  className={
                    'mt-4 text-sm leading-relaxed ' +
                    (cfg.featured ? 'text-white/70' : 'text-[#4B6382]')
                  }
                >
                  {t(cfg.desc)}
                </p>

                <ul className="mt-8 space-y-3">
                  {cfg.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: cfg.featured ? PROCESSTURK_BEIGE : PROCESSTURK_NAVY }}
                        strokeWidth={2}
                      />
                      <span
                        className={
                          'text-sm leading-snug ' +
                          (cfg.featured ? 'text-white/90' : 'text-[#1B1F24]')
                        }
                      >
                        {t(b)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── CTA / NEXT STEPS ─────────────────────── */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: PROCESSTURK_NAVY }}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 90% 10%, rgba(227,195,157,0.35) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(30,78,121,0.7) 0%, transparent 55%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3">
                  <span
                    className="block h-px w-8"
                    style={{ backgroundColor: PROCESSTURK_COPPER }}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E3C39D]">
                    {t('sunum.cta.eyebrow')}
                  </span>
                </div>
              </div>

              <h2 className="font-semibold leading-[1.05] tracking-tight">
                <span className="block text-[clamp(2rem,5vw,4.25rem)] text-white">
                  {t('sunum.cta.title1')}
                </span>
                <span
                  className="block text-[clamp(2rem,5vw,4.25rem)] italic font-light"
                  style={{ color: PROCESSTURK_BEIGE }}
                >
                  {t('sunum.cta.title2')}
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-base lg:text-lg leading-relaxed text-white/70">
                {t('sunum.cta.desc')}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/iletisim"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-all"
                  style={{ backgroundColor: PROCESSTURK_COPPER, color: PROCESSTURK_NAVY }}
                >
                  <Mail className="h-4 w-4" />
                  {t('sunum.cta.button')}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </Link>
                <Link
                  to="/cozumler"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-medium border border-white/25 text-white hover:bg-white/10 transition-colors"
                >
                  {t('sunum.cta.secondary')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 lg:p-10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="block h-px w-6"
                    style={{ backgroundColor: PROCESSTURK_COPPER }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">
                    Recommended Next Steps
                  </span>
                </div>
                <ul className="space-y-5">
                  {nextSteps.map((k, idx) => (
                    <li key={k} className="flex items-start gap-5">
                      <div
                        className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border"
                        style={{ borderColor: 'rgba(227,195,157,0.4)' }}
                      >
                        <span className="text-xs font-semibold text-[#E3C39D]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="pt-2 text-sm lg:text-base leading-snug text-white">
                        {t(k)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sunum;
