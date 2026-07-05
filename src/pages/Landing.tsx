import { Link } from 'react-router-dom';
import { useSession } from '../lib/auth';

export default function Landing() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-6">💳</span>
        <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-3">Get the most out of every swipe</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight max-w-2xl leading-tight">
          Never miss a card benefit again.
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl">
          Track your credit card perks, see what you haven't claimed this month, and always know which card to use.
        </p>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/sign-up"
                className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
              >
                Get started free
              </Link>
              <Link
                to="/sign-in"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Feature pills */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { emoji: '📅', title: 'Monthly Tracker', desc: 'See exactly what credits you have left this month.' },
            { emoji: '🏆', title: 'Card Rankings', desc: 'Know which card to swipe for dining, travel, shopping.' },
            { emoji: '🤖', title: 'AI Import', desc: "Paste any bank page and we'll parse the benefits instantly." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
