'use client';

// ═══════════════════════════════════════════════════════════════
// CLUBD Brand Book — v2
// Bold. Active. Community. Gender-neutral.
// ═══════════════════════════════════════════════════════════════

// ── Named Color Palette ──────────────────────────────────────
const palette = {
  sunset:   { name: 'Sunset',      hex: '#FF6B2B', rgb: '255, 107, 43',  usage: 'Primary brand. Buttons, links, hero accent, identity.' },
  midnight: { name: 'Midnight',    hex: '#11224E', rgb: '17, 34, 78',    usage: 'Dark grounds. Hero sections, footers, contrast blocks.' },
  amber:    { name: 'Amber',       hex: '#EDAA1E', rgb: '237, 170, 30',  usage: 'Warmth. Highlights, badges, secondary emphasis.' },
  cream:    { name: 'Cream',       hex: '#FEF7F0', rgb: '254, 247, 240', usage: 'Warm surface. Primary background, breathing room.' },
  mist:     { name: 'Mist',        hex: '#EDF0F4', rgb: '237, 240, 244', usage: 'Cool surface. Cards on dark, alt backgrounds.' },
  ink:      { name: 'Ink',         hex: '#1C1C28', rgb: '28, 28, 40',    usage: 'Text. Headlines and body on light backgrounds.' },
} as const;

// ── Brand Mark ───────────────────────────────────────────────
function ClubdMark({ size = 48, color = palette.sunset.hex, className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 4C24 4 27 18 30 21C33 24 44 24 44 24C44 24 33 24 30 27C27 30 24 44 24 44C24 44 21 30 18 27C15 24 4 24 4 24C4 24 15 24 18 21C21 18 24 4 24 4Z"
        fill={color}
      />
    </svg>
  );
}

function ClubdWordmark({ color = '#FFFFFF', className = '' }: { color?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ClubdMark size={32} color={color} />
      <span className="font-display text-2xl font-black tracking-tight" style={{ color }}>
        clubd
      </span>
    </div>
  );
}

// ── Color Card ───────────────────────────────────────────────
function ColorCard({
  name, hex, rgb, usage, dark = false, large = false,
}: {
  name: string; hex: string; rgb: string; usage: string; dark?: boolean; large?: boolean;
}) {
  return (
    <div className={large ? 'md:col-span-2' : ''}>
      <div
        className={`${large ? 'h-48' : 'h-36'} w-full rounded-2xl flex items-end p-5`}
        style={{ backgroundColor: hex }}
      >
        <span className={`font-display text-xl font-bold ${dark ? 'text-white' : 'text-black/60'}`}>
          {name}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm font-mono font-semibold" style={{ color: palette.ink.hex }}>{hex}</span>
        <span className="text-xs font-mono text-gray-400">RGB {rgb}</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">{usage}</p>
    </div>
  );
}

// ── Phone Mockup ─────────────────────────────────────────────
function PhoneMockup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-[260px] rounded-[2.5rem] border-[8px] border-gray-900 bg-gray-900 p-1 shadow-2xl ${className}`}>
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <div className="flex justify-center bg-gray-900 pb-2 pt-2">
          <div className="h-5 w-28 rounded-full bg-gray-800" />
        </div>
        {children}
      </div>
    </div>
  );
}

function BrowserMockup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${className}`}>
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="ml-4 flex-1 rounded-md bg-gray-50 px-3 py-1 text-[10px] text-gray-400">
          clubd.com
        </div>
      </div>
      {children}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// Page
// ═════════════════════════════════════════════════════════════
export default function BrandPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream.hex }}>

      {/* ────────────────────────────────────────────────────────
          COVER
          ──────────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8"
        style={{ backgroundColor: palette.midnight.hex }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <ClubdMark size={600} color="#FFFFFF" />
        </div>

        <div className="relative z-10 text-center">
          <ClubdMark size={72} color={palette.sunset.hex} className="mx-auto" />
          <h1 className="mt-8 font-display text-7xl font-black tracking-tighter text-white md:text-9xl">
            clubd
          </h1>
          <p className="mt-4 text-lg text-white/30">Brand Guidelines</p>

          <div className="mt-12 flex items-center justify-center gap-3">
            {Object.values(palette).map((c) => (
              <div
                key={c.hex}
                className="h-10 w-10 rounded-full border-2 border-white/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          01 — BRAND MARK
          ──────────────────────────────────────────────────────── */}
      <section className="px-8 py-24 md:px-16" style={{ backgroundColor: palette.cream.hex }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            01 &mdash; Brand Mark
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            The Spark
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-500">
            A 4-point spark. The moment people come together &mdash; plans become
            real, community ignites. Simple, bold, unmistakable.
          </p>

          {/* Mark on backgrounds */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div
              className="flex aspect-square items-center justify-center rounded-3xl"
              style={{ backgroundColor: palette.midnight.hex }}
            >
              <ClubdMark size={80} color={palette.sunset.hex} />
            </div>
            <div
              className="flex aspect-square items-center justify-center rounded-3xl"
              style={{ backgroundColor: palette.sunset.hex }}
            >
              <ClubdMark size={80} color="#FFFFFF" />
            </div>
            <div
              className="flex aspect-square items-center justify-center rounded-3xl border border-gray-100"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ClubdMark size={80} color={palette.ink.hex} />
            </div>
          </div>

          {/* Wordmark lockups */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div
              className="flex items-center justify-center rounded-3xl py-14"
              style={{ backgroundColor: palette.midnight.hex }}
            >
              <ClubdWordmark color="#FFFFFF" />
            </div>
            <div
              className="flex items-center justify-center rounded-3xl border border-gray-100 py-14"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <ClubdWordmark color={palette.ink.hex} />
            </div>
          </div>

          {/* Clear space */}
          <div className="mt-10 rounded-2xl bg-white p-8 border border-gray-100">
            <h3 className="font-display text-base font-bold" style={{ color: palette.ink.hex }}>
              Clear Space &amp; Minimum Size
            </h3>
            <div className="mt-6 flex items-center gap-10">
              <div className="relative shrink-0">
                <div className="rounded-xl border-2 border-dashed p-8" style={{ borderColor: palette.sunset.hex + '40' }}>
                  <ClubdMark size={48} color={palette.sunset.hex} />
                </div>
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-semibold"
                  style={{ color: palette.sunset.hex }}
                >
                  1x padding
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Clear space = 1x mark width, all sides</li>
                <li>Minimum: 24px digital, 10mm print</li>
                <li>Never stretch, rotate, or add effects</li>
                <li>Only use palette colors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          02 — COLOR PALETTE
          ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            02 &mdash; Color
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            Palette
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-500">
            Sunset leads. Midnight grounds. Amber warms. Cream and Mist breathe.
            Six named colors &mdash; nothing else.
          </p>

          <div className="mt-16 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <ColorCard {...palette.sunset} dark large />
            <ColorCard {...palette.midnight} dark />
            <ColorCard {...palette.amber} />
            <ColorCard {...palette.cream} />
            <ColorCard {...palette.mist} />
            <ColorCard {...palette.ink} dark />
          </div>

          {/* Approved pairings */}
          <h3 className="mt-16 font-display text-lg font-bold" style={{ color: palette.ink.hex }}>
            Approved Pairings
          </h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { a: palette.sunset.hex, b: palette.midnight.hex, label: 'Primary', desc: 'Sunset on Midnight. Hero moments, key CTAs.' },
              { a: palette.sunset.hex, b: palette.cream.hex, label: 'Warm', desc: 'Sunset on Cream. Default UI, buttons on light.' },
              { a: palette.amber.hex, b: palette.midnight.hex, label: 'Highlight', desc: 'Amber on Midnight. Badges, secondary emphasis.' },
            ].map((p) => (
              <div key={p.label} className="rounded-2xl border border-gray-100 p-6">
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: p.a }} />
                  <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: p.b }} />
                </div>
                <p className="mt-4 text-sm font-semibold" style={{ color: palette.ink.hex }}>{p.label}</p>
                <p className="mt-1 text-xs text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          03 — TYPOGRAPHY
          ──────────────────────────────────────────────────────── */}
      <section className="px-8 py-24 md:px-16" style={{ backgroundColor: palette.cream.hex }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            03 &mdash; Typography
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            Type System
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-10 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: palette.sunset.hex }}>
                Display
              </p>
              <p className="mt-6 font-display text-6xl font-black tracking-tighter" style={{ color: palette.ink.hex }}>
                Outfit
              </p>
              <p className="mt-4 font-display text-2xl font-bold" style={{ color: palette.ink.hex }}>
                Aa Bb Cc 123
              </p>
              <div className="mt-6 space-y-1 text-sm text-gray-400">
                <p>Bold 700 &middot; ExtraBold 800 &middot; Black 900</p>
                <p>Headlines, hero text, section titles</p>
                <p>Tracking: -0.02em to -0.03em</p>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-10 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: palette.sunset.hex }}>
                Body
              </p>
              <p className="mt-6 text-6xl font-bold tracking-tight" style={{ color: palette.ink.hex }}>
                Inter
              </p>
              <p className="mt-4 text-2xl" style={{ color: palette.ink.hex }}>
                Aa Bb Cc 123
              </p>
              <div className="mt-6 space-y-1 text-sm text-gray-400">
                <p>Regular 400 &middot; Medium 500 &middot; Semibold 600</p>
                <p>Body copy, labels, UI elements</p>
                <p>Default tracking &middot; 1.6 line height</p>
              </div>
            </div>
          </div>

          {/* Live type scale */}
          <div className="mt-10 rounded-3xl bg-white p-10 border border-gray-100">
            <div className="space-y-8">
              <div className="border-b border-gray-50 pb-6">
                <p className="font-display text-5xl font-black tracking-tighter md:text-6xl" style={{ color: palette.ink.hex }}>
                  Find Your People
                </p>
                <span className="mt-2 inline-block text-[11px] font-mono text-gray-300">
                  Hero &mdash; 64px / Black / -0.03em
                </span>
              </div>
              <div className="border-b border-gray-50 pb-6">
                <p className="font-display text-4xl font-extrabold tracking-tight" style={{ color: palette.ink.hex }}>
                  What&apos;s Happening Near You
                </p>
                <span className="mt-2 inline-block text-[11px] font-mono text-gray-300">
                  H1 &mdash; 48px / ExtraBold / -0.02em
                </span>
              </div>
              <div className="border-b border-gray-50 pb-6">
                <p className="font-display text-3xl font-bold" style={{ color: palette.ink.hex }}>
                  Trending This Week
                </p>
                <span className="mt-2 inline-block text-[11px] font-mono text-gray-300">
                  H2 &mdash; 36px / Bold / -0.015em
                </span>
              </div>
              <div className="border-b border-gray-50 pb-6">
                <p className="text-lg leading-relaxed text-gray-500">
                  Join thousands of people discovering events, building friendships, and
                  connecting with their local community across Southern California.
                </p>
                <span className="mt-2 inline-block text-[11px] font-mono text-gray-300">
                  Body &mdash; 18px / Regular / 1.6
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: palette.sunset.hex }}>
                  Featured Event &middot; This Weekend
                </p>
                <span className="mt-2 inline-block text-[11px] font-mono text-gray-300">
                  Overline &mdash; 12px / Semibold / 0.08em
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          04 — IN USE
          ──────────────────────────────────────────────────────── */}
      <section className="px-8 py-24 md:px-16" style={{ backgroundColor: palette.midnight.hex }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.amber.hex }}>
            04 &mdash; Applications
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            In Use
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/30">
            The brand across screens, surfaces, and real-world touchpoints.
          </p>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {/* Phone */}
            <div className="flex items-center justify-center py-8">
              <PhoneMockup>
                <div style={{ backgroundColor: palette.cream.hex }} className="px-5 py-6">
                  <div className="flex items-center justify-between">
                    <ClubdWordmark color={palette.ink.hex} className="scale-75 origin-left" />
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-black tracking-tight" style={{ color: palette.ink.hex }}>
                    This Weekend
                  </h3>
                  {/* Card 1 */}
                  <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="h-28 w-full" style={{ background: `linear-gradient(135deg, ${palette.sunset.hex}25, ${palette.amber.hex}15)` }}>
                      <div className="flex h-full items-end p-3">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[9px] font-bold text-white uppercase"
                          style={{ backgroundColor: palette.sunset.hex }}
                        >
                          Social
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-display text-sm font-bold" style={{ color: palette.ink.hex }}>Sunset Mixer</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">Sat &middot; Newport Beach &middot; 42 going</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="h-28 w-full" style={{ background: `linear-gradient(135deg, ${palette.midnight.hex}15, ${palette.mist.hex})` }}>
                      <div className="flex h-full items-end p-3">
                        <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase">
                          Fitness
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-display text-sm font-bold" style={{ color: palette.ink.hex }}>Beach Run Club</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">Sun &middot; Laguna &middot; 28 going</p>
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </div>

            {/* Desktop */}
            <div className="flex items-center justify-center py-8">
              <BrowserMockup className="w-full">
                <div style={{ backgroundColor: palette.cream.hex }} className="p-6">
                  <div className="flex items-center justify-between">
                    <ClubdWordmark color={palette.ink.hex} className="scale-[0.6] origin-left" />
                    <div className="flex gap-5 text-[10px] font-medium text-gray-400">
                      <span>Explore</span>
                      <span>Events</span>
                      <span>Host</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="font-display text-3xl font-black tracking-tight" style={{ color: palette.ink.hex }}>
                      Find Your People
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Discover events and communities across SoCal</p>
                    <div
                      className="mt-4 inline-block rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: palette.sunset.hex }}
                    >
                      Explore Events
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { cat: 'Fitness', bg: `linear-gradient(135deg, ${palette.sunset.hex}18, ${palette.amber.hex}18)` },
                      { cat: 'Social', bg: `linear-gradient(135deg, ${palette.sunset.hex}18, ${palette.sunset.hex}30)` },
                      { cat: 'Outdoor', bg: `linear-gradient(135deg, ${palette.midnight.hex}12, ${palette.mist.hex})` },
                    ].map(({ cat, bg }) => (
                      <div key={cat} className="rounded-xl bg-white p-3 shadow-sm">
                        <div className="h-16 rounded-lg" style={{ background: bg }} />
                        <p className="mt-2 text-[9px] font-semibold" style={{ color: palette.ink.hex }}>{cat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserMockup>
            </div>
          </div>

          {/* Brand surfaces */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Sunset surface */}
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-3xl"
              style={{ backgroundColor: palette.sunset.hex }}
            >
              <div className="text-center text-white">
                <ClubdMark size={48} color="#FFFFFF" className="mx-auto" />
                <p className="mt-3 font-display text-xl font-bold">Find Your People</p>
                <p className="mt-1 text-xs text-white/50">clubd.com</p>
              </div>
            </div>
            {/* Sticker */}
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-3xl"
              style={{ backgroundColor: palette.amber.hex }}
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full" style={{ backgroundColor: palette.sunset.hex }}>
                <ClubdMark size={48} color="#FFFFFF" />
              </div>
            </div>
            {/* Billboard */}
            <div
              className="relative flex aspect-[4/3] items-end overflow-hidden rounded-3xl p-6"
              style={{ backgroundColor: palette.midnight.hex, border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="pointer-events-none absolute top-4 right-4 opacity-[0.07]">
                <ClubdMark size={120} color={palette.sunset.hex} />
              </div>
              <div className="relative z-10">
                <p className="font-display text-2xl font-black text-white leading-tight">
                  Together,<br />We Show Up.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <ClubdMark size={14} color={palette.sunset.hex} />
                  <span className="text-xs font-medium text-white/40">clubd.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Merch strip */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Tee concept */}
            <div className="flex items-center justify-center rounded-3xl bg-white/5 py-12 backdrop-blur-sm border border-white/5">
              <div className="text-center">
                <div className="mx-auto flex h-40 w-32 items-center justify-center rounded-lg bg-white">
                  <div className="text-center">
                    <ClubdMark size={28} color={palette.sunset.hex} className="mx-auto" />
                    <p className="mt-1.5 text-[8px] font-bold tracking-wider uppercase" style={{ color: palette.ink.hex }}>clubd</p>
                  </div>
                </div>
                <p className="mt-4 text-xs font-medium text-white/30">T-Shirt</p>
              </div>
            </div>
            {/* Tote concept */}
            <div className="flex items-center justify-center rounded-3xl bg-white/5 py-12 backdrop-blur-sm border border-white/5">
              <div className="text-center">
                <div
                  className="relative mx-auto flex h-40 w-36 items-center justify-center overflow-hidden rounded-lg"
                  style={{ backgroundColor: palette.midnight.hex }}
                >
                  {/* Diagonal color block */}
                  <div
                    className="absolute bottom-0 right-0 h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, transparent 50%, ${palette.sunset.hex} 50%)`,
                    }}
                  />
                  <ClubdMark size={32} color="#FFFFFF" className="relative z-10" />
                </div>
                <p className="mt-4 text-xs font-medium text-white/30">Tote Bag</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          05 — PHOTOGRAPHY
          ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            05 &mdash; Photography
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            Image Direction
          </h2>

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              {[
                { title: 'Lighting', desc: 'Golden hour. Warm, natural. Lifted shadows, warm highlights. Never cold or clinical.' },
                { title: 'Subjects', desc: 'Real people, groups of 2-6. Diverse. Candid over posed. Mid-laugh, mid-action, mid-conversation.' },
                { title: 'Environments', desc: 'SoCal outdoors: beaches, trails, rooftops, markets, studios. Where people actually connect.' },
                { title: 'Color Grade', desc: 'Warm tone. Skin tones natural. Should feel like it sits next to Sunset and Cream.' },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-base font-bold" style={{ color: palette.ink.hex }}>
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Group candid', bg: `linear-gradient(135deg, ${palette.cream.hex}, ${palette.sunset.hex}20)` },
                { label: 'Active / fitness', bg: `linear-gradient(135deg, ${palette.mist.hex}, ${palette.midnight.hex}15)` },
                { label: 'Beach / outdoor', bg: `linear-gradient(135deg, ${palette.amber.hex}20, ${palette.cream.hex})` },
                { label: 'Food / social', bg: `linear-gradient(135deg, ${palette.cream.hex}, ${palette.amber.hex}15)` },
              ].map((ph) => (
                <div key={ph.label} className="aspect-square rounded-2xl" style={{ background: ph.bg }}>
                  <div className="flex h-full items-center justify-center p-4 text-center text-xs text-gray-400">
                    {ph.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          06 — COMPONENTS
          ──────────────────────────────────────────────────────── */}
      <section className="px-8 py-24 md:px-16" style={{ backgroundColor: palette.cream.hex }}>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            06 &mdash; Components
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            UI Kit
          </h2>

          {/* Buttons */}
          <div className="mt-16 rounded-3xl bg-white p-10 border border-gray-100">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest" style={{ color: palette.sunset.hex }}>
              Buttons
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-[14px] px-7 py-3.5 text-sm font-semibold text-white"
                style={{ backgroundColor: palette.sunset.hex }}
              >
                Primary
              </button>
              <button
                className="rounded-[14px] px-7 py-3.5 text-sm font-semibold text-white"
                style={{ backgroundColor: palette.midnight.hex }}
              >
                Dark
              </button>
              <button
                className="rounded-[14px] px-7 py-3.5 text-sm font-semibold"
                style={{ backgroundColor: palette.mist.hex, color: palette.ink.hex }}
              >
                Secondary
              </button>
              <button
                className="rounded-[14px] border-2 px-7 py-3.5 text-sm font-semibold"
                style={{ borderColor: palette.sunset.hex, color: palette.sunset.hex }}
              >
                Outline
              </button>
              <button
                className="rounded-full px-6 py-3 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${palette.sunset.hex}, ${palette.amber.hex})` }}
              >
                Gradient Pill
              </button>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              14px radius &middot; pill for floating &middot; 44px touch target &middot; scale(0.96) on press
            </p>
          </div>

          {/* Badges */}
          <div className="mt-6 rounded-3xl bg-white p-10 border border-gray-100">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest" style={{ color: palette.sunset.hex }}>
              Badges
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-4 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: palette.sunset.hex }}>Trending</span>
              <span className="rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: palette.amber.hex, color: palette.ink.hex }}>New</span>
              <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">Free</span>
              <span className="rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: palette.mist.hex, color: palette.ink.hex }}>This Weekend</span>
              <span className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-500">Sat, Mar 15</span>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-6 rounded-3xl bg-white p-10 border border-gray-100">
            <p className="mb-8 text-xs font-semibold uppercase tracking-widest" style={{ color: palette.sunset.hex }}>
              Cards
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Light */}
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                <div className="h-32" style={{ background: `linear-gradient(135deg, ${palette.sunset.hex}18, ${palette.amber.hex}12)` }} />
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: palette.sunset.hex }}>Social</span>
                  <p className="mt-1 font-display text-base font-bold" style={{ color: palette.ink.hex }}>Sunset Mixer</p>
                  <p className="mt-1 text-xs text-gray-400">Sat &middot; Newport Beach</p>
                </div>
              </div>
              {/* Warm */}
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
                <div className="h-32" style={{ background: `linear-gradient(135deg, ${palette.amber.hex}20, ${palette.cream.hex})` }} />
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: palette.amber.hex }}>Fitness</span>
                  <p className="mt-1 font-display text-base font-bold" style={{ color: palette.ink.hex }}>Beach Run Club</p>
                  <p className="mt-1 text-xs text-gray-400">Sun &middot; Laguna Beach</p>
                </div>
              </div>
              {/* Dark */}
              <div className="overflow-hidden rounded-3xl text-white shadow-md" style={{ backgroundColor: palette.midnight.hex }}>
                <div className="h-32" style={{ background: `linear-gradient(135deg, ${palette.sunset.hex}20, ${palette.midnight.hex})` }} />
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: palette.amber.hex }}>Featured</span>
                  <p className="mt-1 font-display text-base font-bold">Night Market</p>
                  <p className="mt-1 text-xs text-white/40">Fri &middot; Downtown LA</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              24px radius &middot; subtle border &middot; soft shadow &middot; lift on hover
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          07 — VOICE
          ──────────────────────────────────────────────────────── */}
      <section className="bg-white px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: palette.sunset.hex }}>
            07 &mdash; Voice
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl" style={{ color: palette.ink.hex }}>
            How We Sound
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-500">
            Like a confident friend who knows the best spots. Direct, warm, never corporate.
          </p>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 md:grid-cols-2">
            {[
              { label: 'Hero headline', yes: "Find your people.", no: "Discover exciting community events near you!" },
              { label: 'Empty state', yes: "Nothing yet. Be the first.", no: "There are currently no events to display." },
              { label: 'CTA button', yes: "I'm in", no: "Register for this event" },
              { label: 'Social proof', yes: "42 going, 3 friends", no: "42 registered attendees including 3 connections" },
            ].map((ex) => (
              <div key={ex.label} className="bg-white p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">{ex.label}</p>
                <p className="mt-3 font-display text-lg font-bold" style={{ color: palette.ink.hex }}>{ex.yes}</p>
                <p className="mt-2 text-sm text-gray-300 line-through">{ex.no}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Confident', 'Warm', 'Direct', 'Active'].map((trait) => (
              <div key={trait} className="rounded-2xl p-6" style={{ backgroundColor: palette.sunset.hex + '10' }}>
                <p className="font-display text-lg font-bold" style={{ color: palette.sunset.hex }}>{trait}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER
          ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-8 py-32 text-center"
        style={{ backgroundColor: palette.midnight.hex }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="font-display font-black uppercase tracking-tighter text-white/[0.02]"
            style={{ fontSize: '18vw', lineHeight: 1 }}
          >
            CLUBD
          </span>
        </div>

        <div className="relative z-10">
          <ClubdMark size={48} color={palette.sunset.hex} className="mx-auto" />
          <p className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Every pixel, on brand.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/25">
            Sunset &middot; Midnight &middot; Amber &middot; Cream &middot; Mist &middot; Ink
          </p>
        </div>
      </section>
    </div>
  );
}
