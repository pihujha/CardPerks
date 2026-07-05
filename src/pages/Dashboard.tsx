import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { apiFetch } from '../lib/api';
import { NETWORK_COLORS } from '../lib/networks';

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

type Tab = 'month' | 'year' | 'onetime' | 'ongoing';

function currentPeriod(tab: Tab) {
  const now = new Date();
  if (tab === 'onetime') return 'lifetime';
  return tab === 'month'
    ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    : String(now.getFullYear());
}

function periodLabel(tab: Tab) {
  if (tab === 'onetime') return 'One-time benefits';
  if (tab === 'ongoing') return 'Always-on benefits';
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
  const [tab, setTab]         = useState<Tab>('month');
  const [rows, setRows]       = useState<BenefitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<BenefitRow[]>('/api/dashboard').then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const period = currentPeriod(tab);

  const filtered = rows.filter(r => {
    if (tab === 'onetime') return r.frequency === 'one-time';
    if (tab === 'ongoing') return r.frequency === 'ongoing';
    return r.frequency === (tab === 'month' ? 'monthly' : 'annual');
  });
  const groups = groupByCard(filtered);

  const totalCards = new Set(rows.map(r => r.user_card_id)).size;

  const isUsed  = (r: BenefitRow) => tab === 'onetime'
    ? r.usages.length > 0
    : r.usages.some(u => u.period === period);
  const usageId = (r: BenefitRow) => tab === 'onetime'
    ? r.usages[0]?.id
    : r.usages.find(u => u.period === period)?.id;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Benefits Hub</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {periodLabel(tab)}
              {!loading && totalCards > 0 && (
                <span> · {totalCards} card{totalCards !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
          {!loading && (
            <div className="text-right">
              <p className={`text-2xl font-bold font-mono ${unclaimedCount > 0 ? 'text-rose-500' : 'text-gray-300 dark:text-gray-600'}`}>
                {unclaimedCount}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">unclaimed</p>
            </div>
          )}
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mb-8">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit min-w-full sm:min-w-0">
            {(['month', 'year', 'onetime', 'ongoing'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === t
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t === 'month' ? 'This Month' : t === 'year' ? 'This Year' : t === 'onetime' ? 'One-time' : 'Always On'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {tab === 'onetime' ? 'No one-time benefits found.'
              : tab === 'ongoing' ? 'No always-on benefits found.'
              : `No ${tab === 'month' ? 'monthly' : 'annual'} benefits found.`}{' '}
            <a href="/cards" className="text-amber-600 hover:underline">Add a card</a> to get started.
          </p>
        ) : (
          <div className="space-y-5">
            {tab === 'onetime' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3 mb-2">
                These benefits don't reset on a schedule — mark them once when you've used them.
              </p>
            )}
            {tab === 'ongoing' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3 mb-2">
                These apply automatically on qualifying transactions — no action needed.
              </p>
            )}
            {groups.map(group => {
              const color   = NETWORK_COLORS[group.card_network] ?? '#6b7280';
              const claimed = group.benefits.filter(r => isUsed(r)).length;
              const total   = group.benefits.length;
              const allDone = claimed === total;

              return (
                <div
                  key={group.card_name + group.benefits[0]?.user_card_id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 dark:border-gray-800">
                    <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{group.card_name}</span>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                      allDone
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                    }`}>
                      {claimed}/{total} claimed
                    </span>
                  </div>

                  <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                    {group.benefits.map(row => {
                      const used = isUsed(row);
                      return (
                        <li key={row.benefit_id} className="flex items-center gap-4 px-5 py-3.5">
                          <button
                            onClick={() => toggle(row)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              used
                                ? 'bg-amber-500 border-amber-500'
                                : 'border-gray-300 dark:border-gray-600 hover:border-amber-400'
                            }`}
                          >
                            {used && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${used ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>
                              {row.title}
                            </p>
                            {row.description && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{row.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-sm font-semibold font-mono ${used ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'}`}>
                              {Number(row.value_usd) === 0
                                ? 'N/A'
                                : `${currencySymbol(row.currency)}${Number(row.value_usd).toLocaleString()}`}
                            </span>
                            {row.proof_url && !used && (
                              <a
                                href={row.proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 dark:text-gray-600 hover:text-amber-500 transition-colors"
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
