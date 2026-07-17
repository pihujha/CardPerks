import { useEffect, useRef } from 'react';

export default function ParallaxBackground() {
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = [
      { ref: c1, speed: 0.09,  rot: -10 },
      { ref: c2, speed: 0.055, rot:   9 },
      { ref: c3, speed: 0.13,  rot:  -6 },
    ];

    let ticking = false;
    function update() {
      ticking = false;
      const y = window.scrollY;
      for (const item of items) {
        if (item.ref.current) {
          item.ref.current.style.transform = `translateY(${-y * item.speed}px) rotate(${item.rot}deg)`;
        }
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

      {/* Dark card — peeks from right near top */}
      <div ref={c1} style={{
        position: 'absolute', top: '12%', right: -100,
        width: 300, height: 188, borderRadius: 20,
        background: 'linear-gradient(135deg, #2b2a2e 0%, #131316 100%)',
        transform: 'rotate(-10deg)',
        animation: 'floatA 9s ease-in-out infinite',
        opacity: 0.22,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)',
      }}>
        <div style={{ position: 'absolute', top: 20, left: 22, width: 34, height: 26, borderRadius: 5, background: 'linear-gradient(135deg, #e8cfa3, #c9a76a)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: 38, left: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)' }}>•••• 1234</div>
      </div>

      {/* Gold card — peeks from left mid-page */}
      <div ref={c2} style={{
        position: 'absolute', top: '52%', left: -90,
        width: 280, height: 175, borderRadius: 18,
        background: 'linear-gradient(135deg, #f7ead2 0%, #d4a84b 100%)',
        transform: 'rotate(9deg)',
        animation: 'floatB 11s ease-in-out infinite',
        opacity: 0.30,
        border: '1px solid rgba(180,130,50,0.3)',
        boxShadow: '0 24px 48px -12px rgba(180,100,20,0.4)',
      }}>
        <div style={{ position: 'absolute', top: 22, left: 24, width: 34, height: 26, borderRadius: 5, background: 'linear-gradient(135deg, #fdf6e8, #c9a76a)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', bottom: 40, left: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', color: 'rgba(80,50,10,0.5)' }}>•••• 5678</div>
      </div>

      {/* Navy card — peeks from right near bottom */}
      <div ref={c3} style={{
        position: 'absolute', bottom: '18%', right: -70,
        width: 240, height: 150, borderRadius: 16,
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #101d2e 100%)',
        transform: 'rotate(-6deg)',
        animation: 'floatC 10s ease-in-out infinite',
        opacity: 0.20,
        border: '1px solid rgba(96,165,250,0.2)',
        boxShadow: '0 20px 40px -10px rgba(30,64,175,0.5)',
      }}>
        <div style={{ position: 'absolute', top: 18, left: 20, width: 30, height: 22, borderRadius: 4, background: 'linear-gradient(135deg, #e8cfa3, #c9a76a)', opacity: 0.65 }} />
        <div style={{ position: 'absolute', bottom: 34, left: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>•••• 9012</div>
      </div>

    </div>
  );
}
