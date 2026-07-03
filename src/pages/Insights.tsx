import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { apiFetch } from '../lib/api';

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

const CATEGORIES = ['travel', 'dining', 'shopping', 'entertainment', 'wellness', 'fuel', 'other'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABEL: Record<string, string> = {
  travel:        'Travel',
  dining:        'Dining',
  shopping:      'Shopping',
  entertainment: 'Entertainment',
  wellness:      'Wellness',
  fuel:          'Fuel',
  other:         'Other',
};

const NETWORK_COLOR: Record<string, string> = {
  Visa:       '#1a1f71',
  Mastercard: '#eb001b',
  Amex:       '#007b5e',
  Discover:   '#f76f20',
  Diners:     '#004b87',
  Rupay:      '#1e3a8a',
};

function currencySymbol(c: string) {
  return c === 'INR' ? '₹' : '$';
}

export default function Insights() {
  const [rows, setRows]       = useState<BenefitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Category>('travel');

  useEffect(() => {
    apiFetch<BenefitRow[]>('/api/insights').then(data => {
      setRows(data);
      setLoading(false);

      // Auto-select the category with most total value
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
        card_id: r.card_id,
        card_name: r.card_name,
        card_network: r.card_network,
        currency: r.currency,
        total: 0,
        benefits: [],
      });
    }
    const g = grouped.get(r.card_id)!;
    g.total += Number(r.annual_value);
    g.benefits.push(r);
  }

  const cards = [...grouped.values()].sort((a, b) => b.total - a.total);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your cards ranked by annual benefit value per category</p>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : availableCategories.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No benefits found.{' '}
            <a href="/cards" className="text-blue-500 hover:underline">Add a card</a> to get started.
          </p>
        ) : (
          <>
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap mb-8">
              {availableCategories.map(c => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tab === c
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {CATEGORY_LABEL[c] ?? c}
                </button>
              ))}
            </div>

            {cards.length === 0 ? (
              <p className="text-gray-400 text-sm">
                None of your cards have {CATEGORY_LABEL[tab]?.toLowerCase() ?? tab} benefits.
              </p>
            ) : (
              <div className="space-y-4">
                {cards.map((card, idx) => {
                  const color = NETWORK_COLOR[card.card_network] ?? '#6b7280';
                  const sym   = currencySymbol(card.currency);
                  return (
                    <div key={card.card_id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      {/* Card header with rank */}
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          idx === 0 ? 'bg-amber-400 text-white' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-orange-300 text-white' :
                                      'bg-gray-100 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="font-semibold text-gray-800 text-sm flex-1">{card.card_name}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {sym}{Number(card.total).toLocaleString()}
                          <span className="text-xs font-normal text-gray-400">/yr</span>
                        </span>
                      </div>

                      {/* Individual benefits in this category */}
                      <ul className="divide-y divide-gray-50">
                        {card.benefits.map(b => (
                          <li key={b.benefit_id} className="flex items-center gap-3 px-5 py-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700">{b.title}</p>
                              <p className="text-xs text-gray-400 capitalize">{b.frequency}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-medium text-gray-600">
                                {sym}{Number(b.value_usd).toLocaleString()}
                              </span>
                              {b.proof_url && (
                                <a
                                  href={b.proof_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                                  title="View on bank website"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                                    <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
