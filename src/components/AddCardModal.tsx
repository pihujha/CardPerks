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
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">Add a Card</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">×</button>
          </div>

          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
            <input
              autoFocus
              type="text"
              placeholder="Search by card or bank name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-3 space-y-2">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No cards found</p>
            )}
            {filtered.map(card => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: NETWORK_COLORS[card.network] ?? '#6b7280' }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{card.bank} · {card.network}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(card.id)}
                  disabled={adding === card.id}
                  className="text-sm font-medium text-amber-600 hover:text-amber-800 disabled:opacity-40"
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
