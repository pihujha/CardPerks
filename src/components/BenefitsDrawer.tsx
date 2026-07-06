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
  travel:        'bg-blue-100  dark:bg-blue-900/30  text-blue-700   dark:text-blue-400',
  dining:        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  entertainment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  shopping:      'bg-pink-100  dark:bg-pink-900/30  text-pink-700   dark:text-pink-400',
  fuel:          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  wellness:      'bg-green-100 dark:bg-green-900/30  text-green-700  dark:text-green-400',
  insurance:     'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  other:         'bg-[#f4f2ee] dark:bg-gray-700      text-[#6f6a62]  dark:text-gray-400',
};

const FREQ_LABEL: Record<string, string> = {
  monthly:    'Monthly',
  quarterly:  'Quarterly',
  annual:     'Annual',
  'one-time': 'One-time',
  ongoing:    'Always on',
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
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(28,26,23,0.24)', backdropFilter: 'blur(2px)' } as React.CSSProperties}
        onClick={onClose}
      />

      <div
        className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white dark:bg-gray-800 z-50 flex flex-col"
        style={{ boxShadow: '-24px 0 64px -32px rgba(28,26,23,0.3)' }}
      >
        <div className="flex items-start justify-between px-7 py-6 border-b border-[#f0eee9] dark:border-gray-700">
          <div>
            <h2 className="font-bold text-[#1c1a17] dark:text-white text-[19px]" style={{ letterSpacing: '-0.02em' }}>{cardName}</h2>
            {totalCredit > 0 && (
              <p className="text-sm text-[#8a857d] dark:text-gray-400 mt-1">
                Up to <span className="font-semibold font-mono text-[#059669] dark:text-green-400">${totalCredit.toLocaleString()}</span> in annual credits
              </p>
            )}
            {cardUrl && (
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#b45309] hover:underline mt-1 inline-block"
              >
                View on bank website ↗
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#b3ada3] hover:text-[#6f6a62] dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f4f2ee] dark:hover:bg-gray-700 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-3">
          {benefits.map(b => (
            <div key={b.id} className="bg-[#fbfaf8] dark:bg-gray-700 border border-[#f0eee9] dark:border-gray-600 rounded-[14px] p-4">
              <p className="text-sm font-semibold text-[#1c1a17] dark:text-gray-100">{b.title}</p>
              <p className="text-[12.5px] text-[#8a857d] dark:text-gray-400 mt-1 leading-[1.55]">{b.description}</p>
              <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CATEGORY_CLASSES[b.category] ?? CATEGORY_CLASSES.other}`}>
                  {b.category}
                </span>
                <span className="text-xs text-[#b3ada3] dark:text-gray-500">
                  {FREQ_LABEL[b.frequency] ?? b.frequency}
                </span>
                <span className="ml-auto text-sm font-semibold font-mono text-[#6f6a62] dark:text-gray-300">
                  {Number(b.value_usd) === 0
                    ? '—'
                    : `${b.currency === 'INR' ? '₹' : '$'}${Number(b.value_usd).toLocaleString()}`}
                </span>
              </div>
              {b.proof_url && b.proof_url !== cardUrl && (
                <a
                  href={b.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-[#b45309] hover:underline"
                >
                  View details ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
