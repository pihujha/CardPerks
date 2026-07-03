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

interface Props {
  cardName: string;
  network: string;
  benefits: Benefit[];
  onClose: () => void;
}

const CATEGORY_CLASSES: Record<string, string> = {
  travel:        'bg-blue-100 text-blue-700',
  dining:        'bg-orange-100 text-orange-700',
  entertainment: 'bg-purple-100 text-purple-700',
  shopping:      'bg-pink-100 text-pink-700',
  fuel:          'bg-yellow-100 text-yellow-700',
  wellness:      'bg-green-100 text-green-700',
  other:         'bg-gray-100 text-gray-600',
};

const FREQ_LABEL: Record<string, string> = {
  monthly:   'Monthly',
  quarterly: 'Quarterly',
  annual:    'Annual',
  'one-time': 'One-time',
};

const TYPE_ICON: Record<string, string> = {
  credit:      '💳',
  reward_rate: '📊',
  perk:        '🎁',
  insurance:   '🛡️',
};

export default function BenefitsDrawer({ cardName, benefits, onClose }: Props) {
  const totalCredit = benefits
    .filter(b => b.benefit_type === 'credit' && b.value_usd > 0)
    .reduce((sum, b) => sum + Number(b.value_usd), 0);

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{cardName}</h2>
            {totalCredit > 0 && (
              <p className="text-sm text-gray-500">
                Up to <span className="font-semibold text-green-600">${totalCredit.toLocaleString()}</span> in annual credits
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* benefits list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {benefits.map(b => (
            <div key={b.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{TYPE_ICON[b.benefit_type] ?? '•'}</span>
                    <span className="font-medium text-gray-900 text-sm">{b.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{b.description}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_CLASSES[b.category] ?? CATEGORY_CLASSES.other}`}>
                      {b.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {FREQ_LABEL[b.frequency] ?? b.frequency}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {Number(b.value_usd) === 0
                        ? 'N/A'
                        : `${b.currency === 'INR' ? '₹' : '$'}${Number(b.value_usd).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {b.proof_url && (
                <a
                  href={b.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-indigo-600 hover:underline"
                >
                  View on bank website ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
