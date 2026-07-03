import { NavLink } from 'react-router-dom';
import { useSession, signOut, useSetSession } from '../lib/auth';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cards',     label: 'My Cards' },
  { to: '/insights',  label: 'Insights' },
  { to: '/import',    label: 'AI Import' },
];

export default function Nav() {
  const { data: session } = useSession();
  const setSession = useSetSession();

  async function handleSignOut() {
    await signOut();
    setSession(null);
    window.location.replace('/');
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <NavLink to="/" className="font-bold text-lg text-gray-900 tracking-tight">
        CardPerks
      </NavLink>

      {session && (
        <div className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button onClick={handleSignOut}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
