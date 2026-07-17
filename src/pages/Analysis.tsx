import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import ParallaxBackground from '../components/ParallaxBackground';

// ─── Card reward rates ────────────────────────────────────────────────────────
const CARDS = [
  { name: 'Amex Gold Card',           bank: 'American Express', rates: { dining: 4, travel: 2, groceries: 4, gas: 1, entertainment: 1, other: 1 }, cpp: 0.02,   unit: 'pts'   },
  { name: 'Chase Sapphire Reserve',   bank: 'Chase',            rates: { dining: 3, travel: 3, groceries: 1, gas: 1, entertainment: 1, other: 1 }, cpp: 0.015,  unit: 'pts'   },
  { name: 'Chase Sapphire Preferred', bank: 'Chase',            rates: { dining: 3, travel: 3, groceries: 2, gas: 1, entertainment: 1, other: 1 }, cpp: 0.0125, unit: 'pts'   },
  { name: 'Amex Platinum',            bank: 'American Express', rates: { dining: 1, travel: 5, groceries: 1, gas: 1, entertainment: 1, other: 1 }, cpp: 0.02,   unit: 'pts'   },
  { name: 'Amex Blue Cash Preferred', bank: 'American Express', rates: { dining: 1, travel: 1, groceries: 6, gas: 3, entertainment: 3, other: 1 }, cpp: 0.01,   unit: '%'     },
  { name: 'Chase Freedom Unlimited',  bank: 'Chase',            rates: { dining: 3, travel: 5, groceries: 1.5, gas: 1.5, entertainment: 1.5, other: 1.5 }, cpp: 0.01, unit: '%' },
  { name: 'Citi Double Cash',         bank: 'Citi',             rates: { dining: 2, travel: 2, groceries: 2, gas: 2, entertainment: 2, other: 2 }, cpp: 0.01,   unit: '%'     },
  { name: 'Capital One Venture',      bank: 'Capital One',      rates: { dining: 2, travel: 5, groceries: 2, gas: 2, entertainment: 2, other: 2 }, cpp: 0.01,   unit: 'miles' },
  { name: 'Wells Fargo Active Cash',  bank: 'Wells Fargo',      rates: { dining: 2, travel: 2, groceries: 2, gas: 2, entertainment: 2, other: 2 }, cpp: 0.01,   unit: '%'     },
  { name: 'Discover it Cash Back',    bank: 'Discover',         rates: { dining: 1, travel: 1, groceries: 1, gas: 1, entertainment: 1, other: 1 }, cpp: 0.01,   unit: '%'     },
] as const;

type Category = 'dining' | 'travel' | 'groceries' | 'gas' | 'entertainment' | 'other';

const CATEGORY_COLORS: Record<Category, string> = {
  dining: '#f59e0b', travel: '#3b82f6', groceries: '#10b981',
  gas: '#ef4444', entertainment: '#8b5cf6', other: '#8a857d',
};
const CATEGORY_LABEL: Record<Category, string> = {
  dining: 'Dining', travel: 'Travel', groceries: 'Groceries',
  gas: 'Gas', entertainment: 'Entertainment', other: 'Other',
};

type Transaction = { description: string; amount: number; category: Category };

type AnalysisFolder = {
  id: string;
  name: string;
  period: string;
  card_name: string | null;
  created_at: string;
  transaction_count: number;
  total_spend: string;
  spend_by_category: Record<string, string>;
};

type DetailData = {
  id: string;
  name: string;
  period: string;
  card_name: string | null;
  created_at: string;
  transactions: Transaction[];
};

type UserCard = { id: string; name: string; bank: string; nickname: string | null };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseCSV(text: string): { description: string; amount: number }[] {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].toLowerCase().split(',').map(h => h.replace(/"/g, '').trim());
  const descIdx = headers.findIndex(h => ['description', 'merchant', 'payee', 'name', 'transaction'].some(k => h.includes(k)));
  const amtIdx  = headers.findIndex(h => ['amount', 'debit', 'charge', 'transaction amount'].some(k => h.includes(k)));
  if (descIdx === -1 || amtIdx === -1) return [];
  const rows: { description: string; amount: number }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/"/g, '').trim()) ?? [];
    const desc  = cols[descIdx];
    const amt   = parseFloat((cols[amtIdx] ?? '').replace(/[$,]/g, ''));
    if (!desc || isNaN(amt)) continue;
    const amount = Math.abs(amt);
    if (amount < 0.01) continue;
    rows.push({ description: desc, amount });
  }
  return rows;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = e => res(e.target?.result as string ?? ''); r.onerror = rej; r.readAsText(file);
  });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res((e.target?.result as string).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function parsePDFViaServer(file: File): Promise<{ description: string; amount: number }[]> {
  const pdf = await readFileAsBase64(file);
  const res = await fetch('/api/parse-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pdf }) });
  if (!res.ok) throw new Error('PDF parsing failed on server.');
  const { transactions } = await res.json() as { transactions: { description: string; amount: number }[] };
  return transactions;
}

function cardValue(card: typeof CARDS[number], spend: Record<string, number>): number {
  return (Object.keys(spend) as Category[]).reduce((sum, cat) => {
    return sum + spend[cat] * ((card.rates as Record<string, number>)[cat] ?? 1) * card.cpp;
  }, 0);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Analysis results panel (shared between live results and saved detail) ────
function AnalysisResults({ transactions }: { transactions: Transaction[] }) {
  const spend = transactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount; return acc;
  }, {});
  const totalSpend = Object.values(spend).reduce((s, v) => s + v, 0);
  const maxSpend   = Math.max(...Object.values(spend), 1);
  const rankedCards = [...CARDS].map(c => ({ ...c, value: cardValue(c, spend) })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Spending breakdown */}
      <div className="rounded-[20px] p-6" style={{ background: '#fff', border: '1px solid #eceae6' }}>
        <h3 className="font-semibold text-base mb-5" style={{ color: '#1c1a17' }}>
          Spending Breakdown · <span style={{ color: '#8a857d' }}>${totalSpend.toFixed(2)} total</span>
        </h3>
        <div className="space-y-3">
          {(Object.entries(spend) as [Category, number][]).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-24 text-xs shrink-0" style={{ color: '#6f6a62' }}>{CATEGORY_LABEL[cat]}</span>
              <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: '#f0eee9' }}>
                <div className="h-2 rounded-full" style={{ width: `${(amt / maxSpend) * 100}%`, background: CATEGORY_COLORS[cat] }} />
              </div>
              <span className="w-20 text-xs text-right font-medium" style={{ color: '#1c1a17' }}>${amt.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card gap analysis */}
      <div className="rounded-[20px] p-6" style={{ background: '#fff', border: '1px solid #eceae6' }}>
        <h3 className="font-semibold text-base mb-1" style={{ color: '#1c1a17' }}>Card Gap Analysis</h3>
        <p className="text-xs mb-5" style={{ color: '#8a857d' }}>Estimated rewards value based on your spending, ranked best to worst.</p>
        <div className="space-y-2">
          {rankedCards.map((card, i) => (
            <div key={card.name} className="rounded-[14px] px-4 py-3 flex items-center justify-between"
              style={{ background: i === 0 ? '#fdf3e3' : '#fafaf8', border: `1px solid ${i === 0 ? '#fde68a' : '#eceae6'}` }}>
              <div className="flex items-center gap-3">
                {i < 3
                  ? <span className="text-xs font-bold w-5 text-center" style={{ color: i === 0 ? '#b45309' : '#8a857d' }}>{['🥇','🥈','🥉'][i]}</span>
                  : <span className="text-xs w-5 text-center" style={{ color: '#8a857d' }}>{i + 1}</span>
                }
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1c1a17' }}>{card.name}</p>
                  <p className="text-xs" style={{ color: '#8a857d' }}>{card.bank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: i === 0 ? '#b45309' : '#1c1a17' }}>${card.value.toFixed(2)}</p>
                <p className="text-xs" style={{ color: '#8a857d' }}>est. value</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction table */}
      <div className="rounded-[20px] p-6" style={{ background: '#fff', border: '1px solid #eceae6' }}>
        <h3 className="font-semibold text-base mb-4" style={{ color: '#1c1a17' }}>
          Transactions <span style={{ color: '#8a857d' }}>({transactions.length})</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #f0eee9' }}>
                <th className="text-left pb-2 font-medium text-xs" style={{ color: '#8a857d' }}>Description</th>
                <th className="text-left pb-2 font-medium text-xs" style={{ color: '#8a857d' }}>Category</th>
                <th className="text-right pb-2 font-medium text-xs" style={{ color: '#8a857d' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8f7f5' }}>
                  <td className="py-2 pr-4 text-xs max-w-xs truncate" style={{ color: '#1c1a17' }}>{t.description}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: CATEGORY_COLORS[t.category] + '22', color: CATEGORY_COLORS[t.category] }}>
                      {CATEGORY_LABEL[t.category]}
                    </span>
                  </td>
                  <td className="py-2 text-right text-xs font-medium" style={{ color: '#1c1a17' }}>${t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Analysis() {
  const [view, setView]               = useState<'list' | 'new' | 'detail'>('list');
  const [folders, setFolders]         = useState<AnalysisFolder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [detail, setDetail]           = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);
  const [userCards, setUserCards]     = useState<UserCard[]>([]);

  // New-analysis form state
  const [period, setPeriod]           = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [analysisName, setAnalysisName] = useState('');
  const [nameEdited, setNameEdited]   = useState(false);
  const [newStep, setNewStep]         = useState<'form' | 'upload' | 'processing'>('form');

  // Upload state
  const [dragging, setDragging]       = useState(false);
  const [fileName, setFileName]       = useState('');
  const [isPDF, setIsPDF]             = useState(false);
  const [progress, setProgress]       = useState(0);
  const [total, setTotal]             = useState(0);
  const [error, setError]             = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function refreshFolders() {
    setLoadingFolders(true);
    fetch('/api/analyses').then(r => r.json()).then(setFolders).finally(() => setLoadingFolders(false));
  }

  useEffect(() => { refreshFolders(); }, []);

  useEffect(() => {
    fetch('/api/user-cards').then(r => r.json()).then((cards: UserCard[]) => setUserCards(cards ?? []));
  }, []);

  // Auto-generate name from period + card (unless user edited it manually)
  useEffect(() => {
    if (nameEdited) return;
    const parts = [selectedCard, period].filter(Boolean);
    setAnalysisName(parts.join(' · '));
  }, [period, selectedCard, nameEdited]);

  function openFolder(folder: AnalysisFolder) {
    setLoadingDetail(true);
    setDetail(null);
    setView('detail');
    fetch(`/api/analyses/${folder.id}`)
      .then(r => r.json())
      .then(setDetail)
      .finally(() => setLoadingDetail(false));
  }

  async function deleteFolder(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this analysis?')) return;
    await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
    setFolders(f => f.filter(x => x.id !== id));
  }

  function startNew() {
    setPeriod('');
    setSelectedCard('');
    setAnalysisName('');
    setNameEdited(false);
    setNewStep('form');
    setFileName('');
    setError('');
    setProgress(0);
    setTotal(0);
    setView('new');
  }

  function closeNew() {
    setView('list');
    setNewStep('form');
  }

  const processFile = useCallback(async (file: File, meta: { name: string; period: string; card_name: string }) => {
    setError('');
    setProgress(0);
    setFileName(file.name);
    const pdf = file.name.toLowerCase().endsWith('.pdf');
    setIsPDF(pdf);
    setNewStep('processing');
    setTotal(0);

    try {
      const raw = pdf
        ? await parsePDFViaServer(file)
        : parseCSV(await readFileAsText(file));

      if (raw.length === 0) {
        setError(pdf
          ? 'Could not extract transactions from this PDF. Try exporting as CSV from your bank portal.'
          : 'Could not parse CSV — make sure it has Description and Amount columns.');
        setNewStep('upload');
        return;
      }

      setTotal(raw.length);

      const CHUNK = 10;
      const txns: Transaction[] = [];
      for (let i = 0; i < raw.length; i += CHUNK) {
        const chunk = raw.slice(i, i + CHUNK);
        const res = await fetch('/api/analyze-statement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descriptions: chunk.map(r => r.description) }),
        });
        if (!res.ok) throw new Error('Categorization server error. Make sure the LLM server is running.');
        const { categories } = await res.json() as { categories: string[] };
        chunk.forEach((r, j) => txns.push({ ...r, category: (categories[j] as Category) || 'other' }));
        setProgress(Math.min(i + CHUNK, raw.length));
      }

      // Save to DB
      const saveRes = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, transactions: txns }),
      });
      if (!saveRes.ok) throw new Error('Failed to save analysis.');
      const saved = await saveRes.json() as { id: string };

      // Navigate to detail view
      setDetail({ ...meta, id: saved.id, created_at: new Date().toISOString(), transactions: txns });
      setView('detail');
      refreshFolders();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setNewStep('upload');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, { name: analysisName, period, card_name: selectedCard });
  }, [processFile, analysisName, period, selectedCard]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, { name: analysisName, period, card_name: selectedCard });
  }, [processFile, analysisName, period, selectedCard]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: '#fbfaf8' }}>
      <ParallaxBackground />
      <Nav />

      <main className="relative pt-24 pb-20 px-4 max-w-4xl mx-auto" style={{ zIndex: 1 }}>

        {/* ── Detail view ── */}
        {view === 'detail' && (
          <div style={{ animation: 'slideUp 0.35s ease both' }}>
            <button
              onClick={() => { setView('list'); setDetail(null); }}
              className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors"
              style={{ color: '#8a857d' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1c1a17')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8a857d')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All Analyses
            </button>

            {loadingDetail && !detail && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-[#b45309] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {detail && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold" style={{ color: '#1c1a17' }}>{detail.name || 'Analysis'}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    {detail.period && <span className="text-sm" style={{ color: '#8a857d' }}>{detail.period}</span>}
                    {detail.card_name && (
                      <>
                        <span style={{ color: '#eceae6' }}>·</span>
                        <span className="text-sm" style={{ color: '#8a857d' }}>{detail.card_name}</span>
                      </>
                    )}
                    <span style={{ color: '#eceae6' }}>·</span>
                    <span className="text-sm" style={{ color: '#8a857d' }}>{formatDate(detail.created_at)}</span>
                  </div>
                </div>
                <AnalysisResults transactions={detail.transactions} />
              </>
            )}
          </div>
        )}

        {/* ── List view ── */}
        {view === 'list' && (
          <div style={{ animation: 'slideUp 0.35s ease both' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: '#1c1a17' }}>Statement Analysis</h1>
                <p className="mt-1 text-sm" style={{ color: '#8a857d' }}>
                  Upload statements to track spending and find better cards.
                </p>
              </div>
              <button
                onClick={startNew}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: '#1c1a17', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2e2b26')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1c1a17')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                New Analysis
              </button>
            </div>

            {/* ── Overall summary banner ── */}
            {!loadingFolders && folders.length > 0 && (() => {
              const totalSpend = folders.reduce((s, f) => s + parseFloat(f.total_spend), 0);
              const totalTxns  = folders.reduce((s, f) => s + f.transaction_count, 0);
              const allCats = {} as Record<string, number>;
              for (const f of folders) {
                for (const [cat, amt] of Object.entries(f.spend_by_category ?? {})) {
                  allCats[cat] = (allCats[cat] ?? 0) + parseFloat(amt);
                }
              }
              const maxCat = Math.max(...Object.values(allCats), 1);
              return (
                <div className="rounded-[20px] p-6 mb-6" style={{ background: '#fff', border: '1px solid #eceae6', animation: 'slideUp 0.35s ease both' }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#8a857d', letterSpacing: '0.07em' }}>All-time spend</p>
                      <p className="text-3xl font-bold tracking-tight" style={{ color: '#1c1a17' }}>${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex gap-5 text-right">
                      <div>
                        <p className="text-xl font-bold" style={{ color: '#1c1a17' }}>{folders.length}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8a857d' }}>statement{folders.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold" style={{ color: '#1c1a17' }}>{totalTxns}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8a857d' }}>transaction{totalTxns !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {Object.keys(allCats).length > 0 && (
                    <div className="space-y-2.5 pt-4" style={{ borderTop: '1px solid #f0eee9' }}>
                      {(Object.entries(allCats) as [Category, number][])
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, amt]) => (
                          <div key={cat} className="flex items-center gap-3">
                            <span className="w-24 text-xs shrink-0" style={{ color: '#6f6a62' }}>{CATEGORY_LABEL[cat]}</span>
                            <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: '#f0eee9' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${(amt / maxCat) * 100}%`, background: CATEGORY_COLORS[cat] }} />
                            </div>
                            <span className="w-20 text-xs text-right font-medium" style={{ color: '#1c1a17' }}>${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {loadingFolders ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-[#b45309] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f4f2ee' }}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" style={{ color: '#b3ada3' }}>
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <p className="font-medium text-sm" style={{ color: '#1c1a17' }}>No analyses yet</p>
                <p className="text-xs mt-1 mb-5" style={{ color: '#8a857d' }}>Upload a statement to get started</p>
                <button
                  onClick={startNew}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#b45309', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#92400e')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#b45309')}
                >
                  New Analysis
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={() => openFolder(f)}
                    className="text-left rounded-[20px] p-5 transition-all duration-150 group relative"
                    style={{ background: '#fff', border: '1px solid #eceae6' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#b45309'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(180,83,9,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#eceae6'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    {/* Delete button */}
                    <button
                      onClick={e => deleteFolder(f.id, e)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: '#fef2f2', color: '#ef4444' }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                        <path d="M2 3h10M5 3V2h4v1M4 3l.5 8h5L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#fdf3e3' }}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" style={{ color: '#b45309' }}>
                          <path d="M3 6a2 2 0 012-2h3l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate pr-6" style={{ color: '#1c1a17' }}>{f.name || 'Analysis'}</p>
                        {f.period && <p className="text-xs mt-0.5 truncate" style={{ color: '#8a857d' }}>{f.period}{f.card_name ? ` · ${f.card_name}` : ''}</p>}
                        <div className="flex items-center gap-3 mt-2.5">
                          <span className="text-xs font-medium" style={{ color: '#1c1a17' }}>${parseFloat(f.total_spend).toFixed(2)}</span>
                          <span className="text-xs" style={{ color: '#b3ada3' }}>·</span>
                          <span className="text-xs" style={{ color: '#8a857d' }}>{f.transaction_count} txn{f.transaction_count !== 1 ? 's' : ''}</span>
                          <span className="text-xs" style={{ color: '#b3ada3' }}>·</span>
                          <span className="text-xs" style={{ color: '#8a857d' }}>{formatDate(f.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── New analysis modal overlay ── */}
        {view === 'new' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(28,26,23,0.32)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden"
              style={{ animation: 'slideUp 0.3s ease both', background: '#fff', border: '1px solid #eceae6' } as React.CSSProperties}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f0eee9' }}>
                <div>
                  <h2 className="font-semibold text-base" style={{ color: '#1c1a17' }}>
                    {newStep === 'form' ? 'New Analysis' : newStep === 'upload' ? 'Upload Statement' : 'Analyzing…'}
                  </h2>
                  {analysisName && newStep !== 'form' && (
                    <p className="text-xs mt-0.5 truncate max-w-[260px]" style={{ color: '#8a857d' }}>{analysisName}</p>
                  )}
                </div>
                <button
                  onClick={closeNew}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xl leading-none"
                  style={{ color: '#b3ada3' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f4f2ee')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >×</button>
              </div>

              {/* Step: form */}
              {newStep === 'form' && (
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6f6a62' }}>Time period</label>
                    <input
                      type="text"
                      placeholder="e.g. May 2026"
                      value={period}
                      onChange={e => setPeriod(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      style={{ border: '1.5px solid #eceae6', color: '#1c1a17', background: '#fafaf8' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#b45309')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#eceae6')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6f6a62' }}>Card used</label>
                    <select
                      value={selectedCard}
                      onChange={e => setSelectedCard(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all appearance-none"
                      style={{ border: '1.5px solid #eceae6', color: selectedCard ? '#1c1a17' : '#b3ada3', background: '#fafaf8' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#b45309')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#eceae6')}
                    >
                      <option value="">No specific card / multiple cards</option>
                      {userCards.map(c => (
                        <option key={c.id} value={c.nickname || c.name}>{c.nickname || c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#6f6a62' }}>Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chase Freedom May 2026"
                      value={analysisName}
                      onChange={e => { setAnalysisName(e.target.value); setNameEdited(true); }}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      style={{ border: '1.5px solid #eceae6', color: '#1c1a17', background: '#fafaf8' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#b45309')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#eceae6')}
                    />
                  </div>

                  <button
                    onClick={() => { if (!analysisName.trim()) { setAnalysisName('My Analysis'); } setNewStep('upload'); }}
                    className="w-full rounded-xl py-3 text-sm font-semibold transition-all mt-2"
                    style={{ background: '#1c1a17', color: '#fff' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2e2b26')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#1c1a17')}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step: upload */}
              {newStep === 'upload' && (
                <div className="px-6 py-5">
                  {error && (
                    <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                      {error}
                    </div>
                  )}
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className="cursor-pointer rounded-[18px] border-2 border-dashed flex flex-col items-center justify-center py-12 px-6 transition-all duration-150"
                    style={{ borderColor: dragging ? '#b45309' : '#eceae6', background: dragging ? '#fdf3e3' : '#fafaf8' }}
                  >
                    <input ref={fileRef} type="file" accept=".csv,.pdf" className="hidden" onChange={onFileChange} />
                    <div className="text-3xl mb-3">📄</div>
                    <p className="font-medium text-sm text-center" style={{ color: '#1c1a17' }}>Drop your statement here, or click to browse</p>
                    <p className="text-xs mt-1" style={{ color: '#8a857d' }}>CSV or PDF · CSV gives the most accurate results</p>
                  </div>
                  <button
                    onClick={() => setNewStep('form')}
                    className="w-full mt-3 py-2 text-sm rounded-xl transition-colors"
                    style={{ color: '#8a857d' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1c1a17')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8a857d')}
                  >← Back</button>
                </div>
              )}

              {/* Step: processing */}
              {newStep === 'processing' && (
                <div className="px-6 py-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 border-2 border-[#b45309] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <p className="text-sm font-medium" style={{ color: '#1c1a17' }}>
                      {total === 0
                        ? `Reading ${isPDF ? 'PDF' : 'CSV'}…`
                        : `Categorizing… ${progress} / ${total} transactions`}
                    </p>
                  </div>
                  {total > 0 && (
                    <div className="rounded-full h-2 overflow-hidden" style={{ background: '#f0eee9' }}>
                      <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${(progress / total) * 100}%`, background: '#b45309' }} />
                    </div>
                  )}
                  {fileName && (
                    <p className="text-xs mt-3" style={{ color: '#8a857d' }}>{fileName}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
