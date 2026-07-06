import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { apiFetch } from '../lib/api';
import { NETWORK_COLORS } from '../lib/networks';

type BenefitRow = {
  card_id: string;
  card_name: string;
  card_network: string;
  benefit_id: string;
  title: string;
  category: string;
  frequency: string;
  benefit_type: string;
  value_usd: number;
  currency: string;
  proof_url: string | null;
  annual_value: number;
};

const CATEGORIES = ['travel', 'dining', 'shopping', 'entertainment', 'wellness', 'fuel', 'insurance', 'other'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABEL: Record<string, string> = {
  travel:        'Travel',
  dining:        'Dining',
  shopping:      'Shopping',
  entertainment: 'Entertainment',
  wellness:      'Wellness',
  fuel:          'Fuel',
  insurance:     'Insurance',
  other:         'Other',
};

function currencySymbol(c: string) {
  return c === 'INR' ? '₹' : '$';
}

export default function Insights() {
  const [rows, setRows]         = useState<BenefitRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Category>('travel');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch<BenefitRow[]>('/api/insights').then(data => {
      setRows(data);
      setLoading(false);

      if (data.length > 0) {
        const totals: Record<string, number> = {};
        for (const r of data) {
          totals[r.category] = (totals[r.category] ?? 0) + Number(r.annual_value);
        }
        const best = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] as Category;
        if (best) setTab(best);
      }
    });
  }, []);

  function toggleExpand(key: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const availableCategories = CATEGORIES.filter(c => rows.some(r => r.category === c));
  const tabRows = rows.filter(r => r.category === tab);

  type CardGroup = {
    card_id: string;
    card_name: string;
    card_network: string;
    currency: string;
    total: number;
    benefits: BenefitRow[];
  };

  const grouped = new Map<string, CardGroup>();
  for (const r of tabRows) {
    if (!grouped.has(r.card_id)) {
      grouped.set(r.card_id, {
        card_id: r.card_id, card_name: r.card_name, card_network: r.card_network,
        currency: r.currency, total: 0, benefits: [],
      });
    }
    const g = grouped.get(r.card_id)!;
    g.total += Number(r.annual_value);
    g.benefits.push(r);
  }

  const allCards = [...grouped.values()];
  const usdCards = allCards.filter(c => c.currency === 'USD').sort((a, b) => b.total - a.total);
  const inrCards = allCards.filter(c => c.currency === 'INR').sort((a, b) => b.total - a.total);
  const cards = [...usdCards, ...inrCards];
  const mixedCurrencies = usdCards.length > 0 && inrCards.length > 0;

  const allCardsInData = new Map<string, { card_name: string; card_network: string }>();
  for (const r of rows) {
    if (!allCardsInData.has(r.card_id)) {
      allCardsInData.set(r.card_id, { card_name: r.card_name, card_network: r.card_network });
    }
  }
  const rankedIds = new Set(cards.map(c => c.card_id));
  const emptyCards = [...allCardsInData.entries()]
    .filter(([id]) => !rankedIds.has(id))
    .map(([_, info]) => info);

  function CardRow({ card, idx, expandKey }: { card: CardGroup; idx: number; expandKey: string }) {
    const color  = NETWORK_COLORS[card.card_network] ?? '#6b7280';
    const sym    = currencySymbol(card.currency);
    const isOpen = expanded.has(expandKey);

    const rankStyles = [
      { bg: '#f59e0b', color: '#ffffff' },
      { bg: '#e5e1da', color: '#6f6a62' },
      { bg: '#e8b48a', color: '#ffffff' },
      { bg: '#f4f2ee', color: '#8a857d' },
    ];
    const { bg: rankBg, color: rankColor } = rankStyles[Math.min(idx, 3)];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-[16px] border border-[#eceae6] dark:border-gray-700 overflow-hidden"
        style={{ boxShadow: '0 1px 2px rgba(28,26,23,0.03)' }}>
        <button
          onClick={() => toggleExpand(expandKey)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#fbfaf8] dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: rankBg, color: rankColor }}>
            {idx + 1}
          </span>
          <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="font-semibold text-[#1c1a17] dark:text-gray-200 text-sm flex-1 text-left">{card.card_name}</span>
          <span className="text-sm font-bold font-mono text-[#1c1a17] dark:text-white">
            {sym}{Number(card.total).toLocaleString()}
            <span className="text-xs font-normal font-sans text-[#b3ada3] dark:text-gray-500">/yr</span>
          </span>
          <span className="text-[#b3ada3] text-xs transition-transform inline-flex" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>

        {isOpen && (
          <div className="border-t border-[#f4f2ee] dark:border-gray-700">
            {card.benefits.map(b => (
              <div key={b.benefit_id} className="flex items-center gap-3 px-5 py-3 border-t border-[#f8f7f4] dark:border-gray-700 first:border-t-0" style={{ paddingLeft: 62 }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#4a463f] dark:text-gray-300">{b.title}</p>
                  <p className="text-xs text-[#b3ada3] dark:text-gray-500 capitalize mt-0.5">{b.frequency}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-medium font-mono text-[#6f6a62] dark:text-gray-400">
                    {sym}{Number(b.value_usd).toLocaleString()}
                  </span>
                  {b.proof_url && (
                    <a
                      href={b.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d5d1ca] dark:text-gray-600 hover:text-[#b45309] transition-colors"
                      title="View on bank website"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                        <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-gray-900">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1a17] dark:text-gray-100" style={{ letterSpacing: '-0.03em' }}>Insights</h1>
          <p className="text-sm text-[#8a857d] dark:text-gray-500 mt-0.5">Your cards ranked by annual benefit value per category</p>
        </div>

        {loading ? (
          <p className="text-[#8a857d] dark:text-gray-500 text-sm">Loading…</p>
        ) : availableCategories.length === 0 ? (
          <p className="text-[#8a857d] dark:text-gray-500 text-sm">
            No benefits found.{' '}
            <a href="/cards" className="text-[#b45309] hover:underline">Add a card</a> to get started.
          </p>
        ) : (
          <>
            {/* Category pills — dark active per brief */}
            <div className="flex gap-2 flex-wrap mb-8">
              {availableCategories.map(c => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    tab === c
                      ? 'bg-[#1c1a17] text-white border border-[#1c1a17] dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
                      : 'bg-white dark:bg-gray-800 border border-[#e5e1da] dark:border-gray-600 text-[#6f6a62] dark:text-gray-400 hover:border-[#f0c37a] dark:hover:border-amber-700'
                  }`}
                >
                  {CATEGORY_LABEL[c] ?? c}
                </button>
              ))}
            </div>

            {cards.length === 0 && emptyCards.length === 0 ? (
              <p className="text-[#8a857d] dark:text-gray-500 text-sm">
                None of your cards have {CATEGORY_LABEL[tab]?.toLowerCase() ?? tab} benefits.
              </p>
            ) : (
              <div className="space-y-3">
                {mixedCurrencies && usdCards.length > 0 && (
                  <p className="text-xs font-semibold text-[#b3ada3] dark:text-gray-500 uppercase tracking-wide px-1">US Cards</p>
                )}

                {(mixedCurrencies ? usdCards : cards).map((card, idx) => (
                  <CardRow key={card.card_id} card={card} idx={idx} expandKey={card.card_id} />
                ))}

                {mixedCurrencies && inrCards.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-[#b3ada3] dark:text-gray-500 uppercase tracking-wide px-1 pt-2">Indian Cards</p>
                    {inrCards.map((card, idx) => (
                      <CardRow key={card.card_id + '-inr'} card={card} idx={idx} expandKey={card.card_id + '-inr'} />
                    ))}
                  </>
                )}

                {emptyCards.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-[#b3ada3] dark:text-gray-500 uppercase tracking-wide font-semibold px-1">
                      No known {CATEGORY_LABEL[tab]?.toLowerCase() ?? tab} benefits
                    </p>
                    {emptyCards.map(card => {
                      const color = NETWORK_COLORS[card.card_network] ?? '#6b7280';
                      return (
                        <div
                          key={card.card_name}
                          className="bg-white dark:bg-gray-800 rounded-[16px] border border-[#eceae6] dark:border-gray-700 flex items-center gap-3 px-5 py-3.5 opacity-55"
                        >
                          <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-sm text-[#6f6a62] dark:text-gray-400">{card.card_name}</span>
                          <span className="ml-auto text-xs text-[#b3ada3] dark:text-gray-600">—</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
