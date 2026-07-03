import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { apiFetch } from '../lib/api';

type Usage = { id: string; period: string };

type BenefitRow = {
  user_card_id: string;
  card_name: string;
  card_network: string;
  benefit_id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  value_usd: number;
  currency: string;
  benefit_type: string;
  proof_url: string | null;
  usages: Usage[];
};

type Tab = 'month' | 'year';

const NETWORK_COLOR: Record<string, string> = {
  Visa:       '#1a1f71',
  Mastercard: '#eb001b',
  Amex:       '#007b5e',
  Discover:   '#f76f20',
  Diners:     '#004b87',
  Rupay:      '#1e3a8a',
};

function currentPeriod(tab: Tab) {
  const now = new Date();
  return tab === 'month'
    ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    : String(now.getFullYear());
}

function periodLabel(tab: Tab) {
  const now = new Date();
  return tab === 'month'
    ? now.toLocaleString('default', { month: 'long', year: 'numeric' })
    : String(now.getFullYear());
}

function groupByCard(rows: BenefitRow[]) {
  const map = new Map<string, { card_name: string; card_network: string; benefits: BenefitRow[] }>();
  for (const r of rows) {
    if (!map.has(r.user_card_id)) {
      map.set(r.user_card_id, { card_name: r.card_name, card_network: r.card_network, benefits: [] });
    }
    map.get(r.user_card_id)!.benefits.push(r);
  }
  return [...map.values()];
}

function currencySymbol(currency: string) {
  return currency === 'INR' ? '₹' : '$';
}

export default function Dashboard() {
  const [tab, setTab]     = useState<Tab>('month');
  const [rows, setRows]   = useState<BenefitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<BenefitRow[]>('/api/dashboard').then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const period   = currentPeriod(tab);
  const freq     = tab === 'month' ? 'monthly' : 'annual';
  const filtered = rows.filter(r => r.frequency === freq);
  const groups   = groupByCard(filtered);

  const isUsed    = (r: BenefitRow) => r.usages.some(u => u.period === period);
  const usageId   = (r: BenefitRow) => r.usages.find(u => u.period === period)?.id;

  // Count unclaimed (mixed currencies — just show count)
  const unclaimedCount = filtered.filter(r => !isUsed(r)).length;

  async function toggle(row: BenefitRow) {
    if (isUsed(row)) {
      const uid = usageId(row)!;
      await apiFetch(`/api/benefit-usage?usage_id=${uid}`, { method: 'DELETE' });
      setRows(prev => prev.map(r =>
        r.benefit_id === row.benefit_id && r.user_card_id === row.user_card_id
          ? { ...r, usages: r.usages.filter(u => u.id !== uid) }
          : r
      ));
    } else {
      const created = await apiFetch<{ id: string; period: string }>('/api/benefit-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ benefit_id: row.benefit_id, user_card_id: row.user_card_id, period }),
      });
      setRows(prev => prev.map(r =>
        r.benefit_id === row.benefit_id && r.user_card_id === row.user_card_id
          ? { ...r, usages: [...r.usages, { id: created.id, period: created.period }] }
          : r
      ));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Benefits Hub</h1>
            <p className="text-sm text-gray-400 mt-0.5">{periodLabel(tab)}</p>
          </div>
          {!loading && (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{unclaimedCount}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">unclaimed</p>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
          {(['month', 'year'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'month' ? 'This Month' : 'This Year'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No {freq} benefits found. <a href="/cards" className="text-blue-500 hover:underline">Add a card</a> to get started.
          </p>
        ) : (
          <div className="space-y-5">
            {groups.map(group => {
              const color   = NETWORK_COLOR[group.card_network] ?? '#6b7280';
              const claimed = group.benefits.filter(r => isUsed(r)).length;
              const total   = group.benefits.length;
              const allDone = claimed === total;

              return (
                <div
                  key={group.card_name + group.benefits[0]?.user_card_id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                    <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-semibold text-gray-800 text-sm">{group.card_name}</span>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                      allDone ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {claimed}/{total} claimed
                    </span>
                  </div>

                  {/* Benefits list */}
                  <ul className="divide-y divide-gray-50">
                    {group.benefits.map(row => {
                      const used = isUsed(row);
                      return (
                        <li key={row.benefit_id} className="flex items-center gap-4 px-5 py-3.5">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggle(row)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              used
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {used && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${used ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {row.title}
                            </p>
                            {row.description && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">{row.description}</p>
                            )}
                          </div>

                          {/* Value + proof link */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-sm font-semibold ${used ? 'text-gray-300' : 'text-gray-700'}`}>
                              {Number(row.value_usd) === 0
                                ? 'N/A'
                                : `${currencySymbol(row.currency)}${Number(row.value_usd).toLocaleString()}`}
                            </span>
                            {row.proof_url && !used && (
                              <a
                                href={row.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-indigo-500 transition-colors"
                                title="View on bank website"
                                onClick={e => e.stopPropagation()}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                                  <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
