import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import BenefitsDrawer from '../components/BenefitsDrawer';
import AddCardModal   from '../components/AddCardModal';
import { apiFetch }  from '../lib/api';
import { NETWORK_COLORS } from '../lib/networks';

interface Benefit {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  value_usd: number;
  currency: string;
  benefit_type: string;
  proof_url: string | null;
}

interface UserCard {
  id: string;
  card_id: string;
  nickname: string | null;
  added_at: string;
  name: string;
  bank: string;
  network: string;
  tier: string;
  annual_fee: number;
  fee_currency: string;
  benefits: Benefit[];
}

const TIER_LABEL: Record<string, string> = {
  basic:   'Basic',
  mid:     'Mid-tier',
  premium: 'Premium',
};

export default function Cards() {
  const [userCards, setUserCards]       = useState<UserCard[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);
  const [showModal, setShowModal]       = useState(false);

  async function loadUserCards() {
    const data = await apiFetch<UserCard[]>('/api/user-cards');
    setUserCards(data);
    setLoading(false);
  }

  useEffect(() => { loadUserCards(); }, []);

  async function handleAdd(cardId: string) {
    await apiFetch('/api/user-cards', {
      method: 'POST',
      body: JSON.stringify({ card_id: cardId }),
    });
    setShowModal(false);
    await loadUserCards();
  }

  async function handleRemove(userCardId: string) {
    await apiFetch(`/api/user-cards/${userCardId}`, { method: 'DELETE' });
    if (selectedCard?.id === userCardId) setSelectedCard(null);
    setUserCards(prev => prev.filter(c => c.id !== userCardId));
  }

  const totalAnnualValue = userCards.reduce((sum, uc) =>
    sum + uc.benefits
      .filter(b => b.benefit_type === 'credit' && b.value_usd > 0)
      .reduce((s, b) => s + Number(b.value_usd), 0)
  , 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Cards</h1>
            {userCards.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {userCards.length} card{userCards.length !== 1 ? 's' : ''} ·{' '}
                <span className="text-green-600 dark:text-green-400 font-medium font-mono">
                  ${totalAnnualValue.toLocaleString()}
                </span>
                <span className="text-gray-400 dark:text-gray-500"> in annual credits</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            + Add Card
          </button>
        </div>

        {/* empty state */}
        {!loading && userCards.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💳</div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No cards yet</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first card to start tracking benefits.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              + Add Card
            </button>
          </div>
        )}

        {/* card grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-36 animate-pulse border border-gray-100 dark:border-gray-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCards.map(uc => {
              const annualValue = uc.benefits
                .filter(b => b.benefit_type === 'credit' && b.value_usd > 0)
                .reduce((s, b) => s + Number(b.value_usd), 0);
              const color = NETWORK_COLORS[uc.network] ?? '#6b7280';

              return (
                <div
                  key={uc.id}
                  onClick={() => setSelectedCard(uc)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 cursor-pointer hover:shadow-md transition-shadow relative group"
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <button
                    onClick={e => { e.stopPropagation(); handleRemove(uc.id); }}
                    className="absolute top-3 right-3 text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none"
                    title="Remove card"
                  >
                    ×
                  </button>

                  <p className="font-bold text-gray-900 dark:text-white pr-6 leading-snug">{uc.nickname ?? uc.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{uc.bank}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{TIER_LABEL[uc.tier]}</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: color }}
                    >
                      {uc.network}
                    </span>
                  </div>

                  <div className="mt-3 space-y-0.5">
                    {annualValue > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        <span className="font-mono">
                          {uc.fee_currency === 'INR' ? '₹' : '$'}{annualValue.toLocaleString()}
                        </span>
                        {' '}in annual credits
                      </p>
                    )}
                    {Number(uc.annual_fee) > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        <span className="font-mono">
                          {uc.fee_currency === 'INR' ? '₹' : '$'}{Number(uc.annual_fee).toLocaleString()}
                        </span>
                        {' '}annual fee
                      </p>
                    )}
                    {Number(uc.annual_fee) === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No annual fee</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {uc.benefits.length} benefit{uc.benefits.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedCard && (
        <BenefitsDrawer
          cardName={selectedCard.nickname ?? selectedCard.name}
          network={selectedCard.network}
          benefits={selectedCard.benefits}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {showModal && (
        <AddCardModal
          existingCardIds={userCards.map(c => c.card_id)}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
