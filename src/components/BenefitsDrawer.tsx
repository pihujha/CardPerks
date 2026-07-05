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
  travel:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  dining:        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  entertainment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  shopping:      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  fuel:          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  wellness:      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  insurance:     'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  other:         'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

const FREQ_LABEL: Record<string, string> = {
  monthly:    'Monthly',
  quarterly:  'Quarterly',
  annual:     'Annual',
  'one-time': 'One-time',
  ongoing:    'Always on',
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

  const urlCounts = new Map<string, number>();
  for (const b of benefits) {
    if (b.proof_url) urlCounts.set(b.proof_url, (urlCounts.get(b.proof_url) ?? 0) + 1);
  }
  const cardUrl = [...urlCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{cardName}</h2>
            {totalCredit > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Up to <span className="font-semibold font-mono text-green-600 dark:text-green-400">${totalCredit.toLocaleString()}</span> in annual credits
              </p>
            )}
            {cardUrl && (
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-600 hover:underline mt-0.5 inline-block"
              >
                View on bank website ↗
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {benefits.map(b => (
            <div key={b.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{TYPE_ICON[b.benefit_type] ?? '•'}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{b.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{b.description}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_CLASSES[b.category] ?? CATEGORY_CLASSES.other}`}>
                      {b.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {FREQ_LABEL[b.frequency] ?? b.frequency}
                    </span>
                    <span className="text-xs font-semibold font-mono text-gray-700 dark:text-gray-300">
                      {Number(b.value_usd) === 0
                        ? 'N/A'
                        : `${b.currency === 'INR' ? '₹' : '$'}${Number(b.value_usd).toLocaleString()}`}
                    </span>
                  </div>

                  {b.proof_url && b.proof_url !== cardUrl && (
                    <a
                      href={b.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-amber-600 hover:underline"
                    >
                      View details ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
