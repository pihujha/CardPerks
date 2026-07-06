import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

interface CatalogCard {
  id: string;
  name: string;
  bank: string;
  network: string;
  tier: string;
}

interface Props {
  existingCardIds: string[];
  onAdd: (cardId: string) => Promise<void>;
  onClose: () => void;
}

const NETWORK_COLORS: Record<string, string> = {
  Visa:       '#1a1f71',
  Mastercard: '#eb001b',
  Amex:       '#007b5e',
  Discover:   '#f76f20',
  Diners:     '#004b87',
  Rupay:      '#1e3a8a',
};

export default function AddCardModal({ existingCardIds, onAdd, onClose }: Props) {
  const [catalog, setCatalog] = useState<CatalogCard[]>([]);
  const [search, setSearch]   = useState('');
  const [adding, setAdding]   = useState<string | null>(null);

  useEffect(() => {
    apiFetch<CatalogCard[]>('/api/cards').then(setCatalog);
  }, []);

  const filtered = catalog.filter(c =>
    !existingCardIds.includes(c.id) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.bank.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleAdd(cardId: string) {
    setAdding(cardId);
    try {
      await onAdd(cardId);
    } catch (err) {
      console.error('Failed to add card:', err);
      alert('Failed to add card. Check the console for details.');
    } finally {
      setAdding(null);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(28,26,23,0.24)', backdropFilter: 'blur(2px)' } as React.CSSProperties}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]" style={{ boxShadow: '0 32px 64px -24px rgba(28,26,23,0.28)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0eee9] dark:border-gray-700">
            <h2 className="font-bold text-[#1c1a17] dark:text-white">Add a Card</h2>
            <button
              onClick={onClose}
              className="text-[#b3ada3] hover:text-[#6f6a62] dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f4f2ee] dark:hover:bg-gray-700 transition-colors"
            >×</button>
          </div>

          <div className="px-6 py-3 border-b border-[#f0eee9] dark:border-gray-700">
            <input
              autoFocus
              type="text"
              placeholder="Search by card or bank name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-[#eceae6] dark:border-gray-600 bg-[#fbfaf8] dark:bg-gray-700 text-[#1c1a17] dark:text-gray-100 placeholder-[#b3ada3] dark:placeholder-gray-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8cfa3] dark:focus:ring-amber-700"
            />
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-3 space-y-2">
            {filtered.length === 0 && (
              <p className="text-sm text-[#8a857d] dark:text-gray-500 text-center py-8">No cards found</p>
            )}
            {filtered.map(card => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#eceae6] dark:border-gray-700 hover:border-[#e8cfa3] dark:hover:border-amber-700 hover:bg-[#fdf6e8]/30 dark:hover:bg-amber-900/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: NETWORK_COLORS[card.network] ?? '#6b7280' }}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1c1a17] dark:text-gray-100">{card.name}</p>
                    <p className="text-xs text-[#8a857d] dark:text-gray-400">{card.bank} · {card.network}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(card.id)}
                  disabled={adding === card.id}
                  className="text-sm font-semibold text-[#b45309] hover:text-[#92400e] disabled:opacity-40 transition-colors"
                >
                  {adding === card.id ? 'Adding…' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
