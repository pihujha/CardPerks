import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSession } from '../lib/auth';

const INSIGHT_DATA = {
  dining: [
    { rank: '1', name: 'American Express Gold',    value: '$444', rankBg: '#f59e0b', rankColor: '#ffffff', bold: true  },
    { rank: '2', name: 'Chase Sapphire Preferred', value: '$240', rankBg: '#e5e1da', rankColor: '#6f6a62', bold: false },
    { rank: '3', name: 'Citi Double Cash',         value: '$0',   rankBg: '#f4f2ee', rankColor: '#8a857d', bold: false, dim: true },
  ],
  travel: [
    { rank: '1', name: 'Amex Platinum',            value: '$599', rankBg: '#f59e0b', rankColor: '#ffffff', bold: true  },
    { rank: '2', name: 'Chase Sapphire Preferred', value: '$220', rankBg: '#e5e1da', rankColor: '#6f6a62', bold: false },
    { rank: '3', name: 'American Express Gold',    value: '$120', rankBg: '#f4f2ee', rankColor: '#8a857d', bold: false, dim: true },
  ],
  shopping: [
    { rank: '1', name: 'Amex Platinum',            value: '$255', rankBg: '#f59e0b', rankColor: '#ffffff', bold: true  },
    { rank: '2', name: 'American Express Gold',    value: '$0',   rankBg: '#e5e1da', rankColor: '#6f6a62', bold: false },
    { rank: '3', name: 'Chase Sapphire Preferred', value: '$0',   rankBg: '#f4f2ee', rankColor: '#8a857d', bold: false, dim: true },
  ],
} as const;

type InsightCat = keyof typeof INSIGHT_DATA;

export default function Landing() {
  const { data: session, isPending } = useSession();
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Interactive hub demo
  const [hubChecked, setHubChecked] = useState<Record<string, boolean>>({ uber: true });
  function toggleHub(key: string) {
    setHubChecked(p => ({ ...p, [key]: !p[key] }));
  }

  // Interactive insights demo
  const [insightCat, setInsightCat] = useState<InsightCat>('dining');

  useEffect(() => {
    const cards = [
      { ref: card1Ref, speed: -0.52, rot: 'rotate(-12deg)' },
      { ref: card2Ref, speed: -0.28, rot: 'rotate(9deg)'  },
      { ref: card3Ref, speed: -0.72, rot: 'rotate(-6deg)' },
    ];

    let ticking = false;
    function update() {
      ticking = false;
      const y = window.scrollY;
      for (const c of cards) {
        if (c.ref.current) {
          c.ref.current.style.transform = `translateY(${y * c.speed}px) ${c.rot}`;
        }
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.translate = '0 0';
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.18 });
    for (const el of reveals) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.style.opacity = '0';
        el.style.translate = '0 28px';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.2,0.6,0.2,1), translate 0.8s cubic-bezier(0.2,0.6,0.2,1)';
        io.observe(el);
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  if (isPending) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  const hubBenefits = [
    { key: 'uber',   label: '$10 Uber Cash',     value: '$10' },
    { key: 'dining', label: '$10 Dining Credit',  value: '$10' },
    { key: 'dunkin', label: "$7 Dunkin' Credit",  value: '$7'  },
  ];

  const insightRows = INSIGHT_DATA[insightCat];

  return (
    <div style={{ minHeight: '100vh', background: '#fbfaf8', color: '#1c1a17', overflowX: 'clip' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(20px, 5vw, 56px)', height: 60, background: 'rgba(251,250,248,0.72)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderBottom: '1px solid rgba(28,26,23,0.06)' }}>
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>CardPerks</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/sign-in" style={{ fontSize: 14, fontWeight: 500, color: '#6f6a62', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/sign-up" style={{ fontSize: 14, fontWeight: 600, color: '#fbfaf8', background: '#1c1a17', padding: '9px 18px', borderRadius: 999, textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '140px 24px 80px' }}>

        {/* Floating card 1 — dark, top-left */}
        <div ref={card1Ref} style={{ position: 'absolute', top: '10%', left: 'max(-90px, calc(50vw - 810px))', width: 340, height: 213, borderRadius: 22, background: 'linear-gradient(135deg, #2b2a2e 0%, #131316 100%)', boxShadow: '0 48px 96px -28px rgba(28,26,23,0.55)', transform: 'rotate(-12deg)', animation: 'floatA 9s ease-in-out infinite', zIndex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ position: 'absolute', top: 24, left: 26, width: 42, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, #e8cfa3, #c9a76a)' }} />
          <div style={{ position: 'absolute', bottom: 50, left: 26, fontFamily: "'JetBrains Mono', monospace", fontSize: 15, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.85)' }}>•••• 1234</div>
          <div style={{ position: 'absolute', bottom: 24, left: 26, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>John Appleseed</div>
          <div style={{ position: 'absolute', bottom: 24, right: 26, display: 'flex' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563EB', opacity: 0.9, display: 'inline-block' }} />
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', marginLeft: -9, display: 'inline-block' }} />
          </div>
        </div>

        {/* Floating card 2 — gold, right */}
        <div ref={card2Ref} style={{ position: 'absolute', top: '54%', right: 'max(-100px, calc(50vw - 820px))', width: 360, height: 225, borderRadius: 24, background: 'linear-gradient(135deg, #f7ead2 0%, #d4a84b 100%)', boxShadow: '0 48px 96px -28px rgba(180,100,20,0.45)', transform: 'rotate(9deg)', animation: 'floatB 11s ease-in-out infinite', zIndex: 1, border: '1px solid rgba(180,130,50,0.25)' }}>
          <div style={{ position: 'absolute', top: 26, left: 28, width: 42, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, #fdf6e8, #d9b877)' }} />
          <div style={{ position: 'absolute', bottom: 52, left: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 15, letterSpacing: '0.14em', color: 'rgba(80,50,10,0.75)' }}>•••• 5678</div>
          <div style={{ position: 'absolute', bottom: 26, left: 28, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(80,50,10,0.45)' }}>John Appleseed</div>
          <div style={{ position: 'absolute', bottom: 26, right: 28, width: 28, height: 28, borderRadius: '50%', background: '#059669', opacity: 0.85 }} />
        </div>

        {/* Floating card 3 — navy, bottom-left */}
        <div ref={card3Ref} style={{ position: 'absolute', bottom: '4%', left: 'max(-60px, calc(50vw - 770px))', width: 300, height: 188, borderRadius: 20, background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #101d2e 100%)', boxShadow: '0 40px 80px -24px rgba(30,64,175,0.55)', transform: 'rotate(-6deg)', animation: 'floatC 10s ease-in-out infinite', zIndex: 1, opacity: 0.95, border: '1px solid rgba(96,165,250,0.15)' }}>
          <div style={{ position: 'absolute', top: 22, left: 24, width: 38, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #e8cfa3, #c9a76a)' }} />
          <div style={{ position: 'absolute', bottom: 44, left: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)' }}>•••• 9012</div>
          <div style={{ position: 'absolute', bottom: 22, right: 24, width: 24, height: 24, borderRadius: '50%', background: '#DC2626', opacity: 0.85 }} />
        </div>

        {/* Hero copy */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 880, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 40px', background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(251,250,248,0.92) 40%, rgba(251,250,248,0) 100%)' }}>
          <p style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b45309' }}>Get the most out of every swipe</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(52px, 9vw, 112px)', lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.045em' }}>Every perk.<br />Claimed.</h1>
          <p style={{ margin: '28px 0 0', fontSize: 'clamp(18px, 2.2vw, 22px)', lineHeight: 1.5, color: '#6f6a62', maxWidth: 520 }}>Your cards owe you money. CardPerks keeps score — every credit, on every card, checked off before it expires.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/sign-up" style={{ fontSize: 16, fontWeight: 600, color: '#fbfaf8', background: '#1c1a17', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>Get started free</Link>
            <a href="#how" style={{ fontSize: 16, fontWeight: 600, color: '#1c1a17', background: 'transparent', border: '1px solid rgba(28,26,23,0.16)', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>See how it works</a>
          </div>
        </div>
      </header>

      {/* Section 1: Benefits Hub — interactive */}
      <section id="how" style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 56px)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
          <div data-reveal="">
            <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b45309' }}>Benefits Hub</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 }}>Know what's left.</h2>
            <p style={{ margin: '20px 0 0', fontSize: 18, lineHeight: 1.6, color: '#6f6a62', maxWidth: 420 }}>Monthly credits, annual credits, one-time bonuses — one list, checked off as you go. What's unclaimed stays loud until it isn't.</p>
          </div>

          {/* Interactive hub demo */}
          <div data-reveal="" style={{ background: '#ffffff', border: '1px solid #eceae6', borderRadius: 24, padding: 24, boxShadow: '0 32px 64px -32px rgba(28,26,23,0.14)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 4, height: 24, borderRadius: 999, background: '#059669', flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>American Express Gold</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#8a857d', background: '#f4f2ee', padding: '4px 10px', borderRadius: 999 }}>
                {Object.values(hubChecked).filter(Boolean).length}/{hubBenefits.length} claimed
              </span>
            </div>
            <p style={{ margin: '4px 0 12px', fontSize: 11, color: '#b3ada3', letterSpacing: '0.04em' }}>Try checking them off ↓</p>
            {hubBenefits.map(b => {
              const done = !!hubChecked[b.key];
              return (
                <button
                  key={b.key}
                  onClick={() => toggleHub(b.key)}
                  style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 4px', borderTop: '1px solid #f4f2ee', fontFamily: 'inherit', textAlign: 'left', transition: 'opacity 0.15s ease' }}
                >
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: done ? '#f59e0b' : 'transparent', border: done ? 'none' : '2px solid #d5d1ca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s ease' }}>{done ? '✓' : ''}</span>
                  <span style={{ flex: 1, fontSize: 14, color: done ? '#b3ada3' : '#1c1a17', textDecoration: done ? 'line-through' : 'none', fontWeight: done ? 400 : 500, transition: 'all 0.2s ease' }}>{b.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: done ? '#d5d1ca' : '#1c1a17', fontWeight: done ? 400 : 600, transition: 'color 0.2s ease' }}>{b.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Insights — interactive */}
      <section style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 56px)', background: '#ffffff', borderTop: '1px solid #f0eee9', borderBottom: '1px solid #f0eee9' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>

          {/* Interactive insights demo */}
          <div data-reveal="" style={{ order: 0, background: '#fbfaf8', border: '1px solid #eceae6', borderRadius: 24, padding: 24, boxShadow: '0 32px 64px -32px rgba(28,26,23,0.12)' }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['dining', 'travel', 'shopping'] as InsightCat[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setInsightCat(cat)}
                  style={{ border: `1px solid ${insightCat === cat ? '#1c1a17' : '#e5e1da'}`, cursor: 'pointer', fontFamily: 'inherit', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, color: insightCat === cat ? '#ffffff' : '#6f6a62', background: insightCat === cat ? '#1c1a17' : '#ffffff', transition: 'all 0.15s ease' }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#8a857d' }}>Best for <span style={{ color: '#b45309' }}>{insightCat.charAt(0).toUpperCase() + insightCat.slice(1)}</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {insightRows.map(r => (
                <div key={r.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', border: '1px solid #eceae6', borderRadius: 14, padding: '14px 16px', opacity: (r as any).dim ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: r.rankBg, color: r.rankColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.rank}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: r.bold ? 600 : 500, color: r.bold ? '#1c1a17' : '#4a463f' }}>{r.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: r.bold ? 600 : 400, color: r.bold ? '#1c1a17' : '#6f6a62' }}>{r.value}<span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, fontWeight: 400, color: '#b3ada3' }}>/yr</span></span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="" style={{ order: 1 }}>
            <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b45309' }}>Insights</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 }}>Swipe the right card.</h2>
            <p style={{ margin: '20px 0 0', fontSize: 18, lineHeight: 1.6, color: '#6f6a62', maxWidth: 420 }}>Every category, ranked by real annual value. Dining out? You'll know which card earns the most before the check arrives.</p>
          </div>
        </div>
      </section>

      {/* Section 3: My Cards */}
      <section style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 56px)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
          <div data-reveal="">
            <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b45309' }}>My Cards</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px, 4.5vw, 52px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.05 }}>Fees, meet receipts.</h2>
            <p style={{ margin: '20px 0 0', fontSize: 18, lineHeight: 1.6, color: '#6f6a62', maxWidth: 420 }}>Annual credits stacked against annual fees, card by card. Keep the ones that pay for themselves. Drop the ones that don't.</p>
          </div>
          <div data-reveal="" style={{ background: '#ffffff', border: '1px solid #eceae6', borderRadius: 24, padding: 24, boxShadow: '0 32px 64px -32px rgba(28,26,23,0.14)' }}>
            <div style={{ borderLeft: '3px solid #059669', paddingLeft: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>American Express Platinum</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#8a857d' }}>American Express</p>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
              <div>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: '#059669' }}>$1,679</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8a857d' }}>annual credits</p>
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: '#b3ada3' }}>$695</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8a857d' }}>annual fee</p>
              </div>
            </div>
            <div style={{ marginTop: 20, height: 8, borderRadius: 999, background: '#f4f2ee', overflow: 'hidden', display: 'flex' }}>
              <span style={{ width: '71%', background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: 999, display: 'inline-block' }} />
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#8a857d' }}>Credits cover the fee <span style={{ fontWeight: 600, color: '#059669' }}>2.4×</span> over</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(100px, 14vw, 200px) 24px', background: '#1c1a17', color: '#fbfaf8', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div data-reveal="" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.02, maxWidth: 720 }}>Stop leaving money on the table.</h2>
          <p style={{ margin: '20px 0 0', fontSize: 18, color: 'rgba(251,250,248,0.55)', maxWidth: 440 }}>Free to use. Takes two minutes to add your cards.</p>
          <Link to="/sign-up" style={{ marginTop: 36, fontSize: 16, fontWeight: 600, color: '#1c1a17', background: '#fbfaf8', padding: '16px 36px', borderRadius: 999, textDecoration: 'none' }}>Get started free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px clamp(20px, 5vw, 56px)', background: '#1c1a17', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(251,250,248,0.8)' }}>CardPerks</span>
        <span style={{ fontSize: 13, color: 'rgba(251,250,248,0.35)' }}>© 2026</span>
      </footer>
    </div>
  );
}
