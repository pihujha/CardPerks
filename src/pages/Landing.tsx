import { Link } from 'react-router-dom';
import { useSession } from '../lib/auth';

export default function Landing() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-6">💳</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight max-w-2xl leading-tight">
          Never miss a card benefit again.
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl">
          Track your credit card perks, see what you haven't claimed this month, and always know which card to use.
        </p>
        <div className="mt-8 flex gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/sign-up"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get started free
              </Link>
              <Link
                to="/sign-in"
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Feature pills */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { emoji: '📅', title: 'Monthly Tracker', desc: 'See exactly what credits you have left this month.' },
            { emoji: '🏆', title: 'Card Rankings', desc: 'Know which card to swipe for dining, travel, shopping.' },
            { emoji: '🤖', title: 'AI Import', desc: "Paste any bank page and we'll parse the benefits instantly." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-semibold text-gray-900">{title}</div>
              <div className="text-sm text-gray-500 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
