import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { apiFetch } from '../lib/api';

type Step = 'idle' | 'loading' | 'preview' | 'saving' | 'done';

type ExtractedBenefit = {
  title: string;
  description: string;
  category: string;
  frequency: string;
  value_usd: number;
  benefit_type: string;
  currency: string;
};

type CatalogCard = {
  id: string;
  name: string;
  bank: string;
  network: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  travel:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  dining:        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  shopping:      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  entertainment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  wellness:      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  fuel:          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  insurance:     'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  other:         'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

function currencySymbol(currency: string) {
  return currency === 'INR' ? '₹' : '$';
}

export default function Import() {
  const [step, setStep]         = useState<Step>('idle');
  const [catalog, setCatalog]   = useState<CatalogCard[]>([]);
  const [cardId, setCardId]     = useState('');
  const [text, setText]         = useState('');
  const [benefits, setBenefits] = useState<ExtractedBenefit[]>([]);
  const [error, setError]       = useState('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    apiFetch<CatalogCard[]>('/api/cards').then(setCatalog);
  }, []);

  const selectedCard = catalog.find(c => c.id === cardId);

  async function handleExtract() {
    if (!cardId || !text.trim()) return;
    setStep('loading');
    setError('');
    try {
      const result = await apiFetch<{ benefits: ExtractedBenefit[] }>('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_name: selectedCard!.name, text }),
      });
      setBenefits(result.benefits);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setStep('idle');
    }
  }

  async function handleSave() {
    setStep('saving');
    try {
      const result = await apiFetch<{ count: number }>('/api/import-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId, benefits }),
      });
      setSavedCount(result.count);
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      setStep('preview');
    }
  }

  function removeBenefit(idx: number) {
    setBenefits(prev => prev.filter((_, i) => i !== idx));
  }

  function reset() {
    setStep('idle');
    setText('');
    setBenefits([]);
    setCardId('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">AI Import</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Paste a card's benefits page and we'll extract all the perks automatically
          </p>
        </div>

        {/* ── Done state ── */}
        {step === 'done' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {savedCount} benefit{savedCount !== 1 ? 's' : ''} saved
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {selectedCard?.name} has been updated.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <a
                href="/cards"
                className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
              >
                View My Cards
              </a>
              <button
                onClick={reset}
                className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Import Another
              </button>
            </div>
          </div>
        )}

        {/* ── Preview state ── */}
        {(step === 'preview' || step === 'saving') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Found {benefits.length} benefit{benefits.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500">{selectedCard?.name}</p>
              </div>
              <button
                onClick={() => setStep('idle')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ← Back
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-5 py-2.5 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                <span>Benefit</span>
                <span>Category</span>
                <span>Frequency</span>
                <span>Value</span>
                <span></span>
              </div>

              {benefits.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                  All benefits removed. Go back and try again.
                </p>
              ) : (
                <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                  {benefits.map((b, idx) => (
                    <li key={idx} className="flex sm:grid sm:grid-cols-[1fr,auto,auto,auto,auto] items-start sm:items-center gap-3 sm:gap-4 px-5 py-3.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.title}</p>
                        {b.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{b.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${CATEGORY_COLORS[b.category] ?? CATEGORY_COLORS.other}`}>
                        {b.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap capitalize flex-shrink-0">
                        {b.frequency}
                      </span>
                      <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0">
                        {Number(b.value_usd) === 0
                          ? <span className="text-gray-300 dark:text-gray-600">—</span>
                          : `${currencySymbol(b.currency)}${Number(b.value_usd).toLocaleString()}`}
                      </span>
                      <button
                        onClick={() => removeBenefit(idx)}
                        className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 text-lg leading-none flex-shrink-0 transition-colors"
                        title="Remove this benefit"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 3.5V9M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Saving will replace <strong>all existing benefits</strong> for {selectedCard?.name}.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={step === 'saving' || benefits.length === 0}
                className="bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 'saving'
                  ? 'Saving…'
                  : `Save ${benefits.length} Benefit${benefits.length !== 1 ? 's' : ''} →`}
              </button>
            </div>
          </div>
        )}

        {/* ── Idle / Loading state ── */}
        {(step === 'idle' || step === 'loading') && (
          <div className="space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">

              {/* Step 1: card picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  1. Select a card
                </label>
                <select
                  value={cardId}
                  onChange={e => setCardId(e.target.value)}
                  disabled={step === 'loading'}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
                >
                  <option value="">Choose a card…</option>
                  {catalog.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.bank}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: text paste */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  2. Paste the benefits page text
                </label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={step === 'loading'}
                  placeholder="Go to your card's official benefits page → select all text (Cmd+A) → paste here"
                  rows={10}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  On the bank's page press{' '}
                  <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-xs">Cmd+A</kbd>
                  {' '}then{' '}
                  <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-xs">Cmd+C</kbd>
                  {' '}to copy everything
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}

              <button
                onClick={handleExtract}
                disabled={!cardId || !text.trim() || step === 'loading'}
                className="w-full bg-amber-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {step === 'loading' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Extracting benefits…
                  </>
                ) : '✨ Extract Benefits'}
              </button>
            </div>

            {/* How it works */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">How it works</h3>
              <ol className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                {[
                  'Go to your card\'s official benefits page on the bank\'s website',
                  'Select all the text on the page (Cmd+A on Mac, Ctrl+A on Windows)',
                  'Copy it (Cmd+C) and paste into the box above',
                  'Click Extract — Gemini AI reads the text and structures the benefits',
                  'Review the results, remove anything that looks wrong, then save',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="text-amber-500 font-semibold flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
