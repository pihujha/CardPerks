import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut, useSetSession } from '../lib/auth';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cards',     label: 'My Cards'  },
  { to: '/insights',  label: 'Insights'  },
  { to: '/analysis',  label: 'Analysis'  },
];

function useDarkMode() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }
  return { dark, toggle };
}

export default function Nav() {
  const { data: session } = useSession();
  const setSession = useSetSession();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  async function handleSignOut() {
    await signOut();
    setSession(null);
    window.location.replace('/');
  }

  const firstName = session?.user.name.split(' ')[0] ?? 'Account';

  return (
    <>
      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-px z-[101] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(180,83,9,0.35) 25%, rgba(180,83,9,0.5) 50%, rgba(180,83,9,0.35) 75%, transparent 100%)' }} />

      <nav
        className="sticky top-0 z-50 px-4 sm:px-6"
        style={{ background: 'rgba(251,250,248,0.82)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderBottom: '1px solid rgba(28,26,23,0.07)' } as React.CSSProperties}
      >
        <div className="flex items-center justify-between h-[58px]">
          <NavLink to="/" className="font-bold text-[17px] tracking-[-0.02em] text-[#1c1a17] dark:text-gray-100 no-underline">
            CardPerks
          </NavLink>

          {session && (
            <>
              {/* Desktop nav */}
              <div className="hidden sm:flex items-center gap-6">
                {links.map(({ to, label }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) =>
                      `text-sm transition-colors no-underline ${
                        isActive
                          ? 'font-semibold text-[#1c1a17] dark:text-gray-100'
                          : 'font-medium text-[#8a857d] dark:text-gray-400 hover:text-[#1c1a17] dark:hover:text-gray-100'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {/* AI Import — coming soon */}
                <span className="flex items-center gap-1.5 text-sm font-medium text-[#b3ada3]">
                  AI Import
                  <span className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[#b45309] bg-[#fdf3e3] px-1.5 py-0.5 rounded-full">Soon</span>
                </span>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#4a463f] dark:text-gray-300 hover:text-[#1c1a17] dark:hover:text-white transition-colors"
                  >
                    <span className="w-[30px] h-[30px] rounded-full bg-[#fdf3e3] text-[#b45309] flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                      {firstName[0].toUpperCase()}
                    </span>
                    {firstName}
                    <svg className={`w-3.5 h-3.5 text-[#b3ada3] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 12 12">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[#eceae6] dark:border-gray-700 py-1.5 z-50">
                      <button
                        onClick={() => { setSettingsOpen(true); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#4a463f] dark:text-gray-300 hover:bg-[#f8f7f4] dark:hover:bg-gray-700/60 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Settings
                      </button>
                      <a
                        href="mailto:pijha@calpoly.edu?subject=CardPerks%20Bug%20Report"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#4a463f] dark:text-gray-300 hover:bg-[#f8f7f4] dark:hover:bg-gray-700/60 transition-colors"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                          <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 3.5V9M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Report a Bug
                      </a>
                      <div className="border-t border-[#f0eee9] dark:border-gray-700 my-1" />
                      <button
                        onClick={() => { setDropdownOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden p-1.5 rounded-lg text-[#8a857d] hover:bg-[#f4f2ee] dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {session && mobileOpen && (
          <div className="sm:hidden border-t border-[#f0eee9] dark:border-gray-800 mt-0 pt-3 pb-2 space-y-0.5">
            {links.map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#1c1a17] dark:text-gray-100 bg-[#f4f2ee] dark:bg-gray-800'
                      : 'text-[#6f6a62] dark:text-gray-400 hover:bg-[#f8f7f4] dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <span className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#b3ada3]">
              AI Import
              <span className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[#b45309] bg-[#fdf3e3] px-1.5 py-0.5 rounded-full">Soon</span>
            </span>
            <div className="border-t border-[#f0eee9] dark:border-gray-800 mt-2 pt-2 space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-[#8a857d]">
                <span className="w-5 h-5 rounded-full bg-[#fdf3e3] text-[#b45309] flex items-center justify-center text-xs font-bold">
                  {firstName[0].toUpperCase()}
                </span>
                <span className="font-medium text-[#4a463f] dark:text-gray-300">{session.user.name}</span>
              </div>
              <button
                onClick={() => { setSettingsOpen(true); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#6f6a62] dark:text-gray-400 hover:bg-[#f8f7f4] dark:hover:bg-gray-800 transition-colors"
              >
                Settings
              </button>
              <a
                href="mailto:pijha@calpoly.edu?subject=CardPerks%20Bug%20Report"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[#6f6a62] dark:text-gray-400 hover:bg-[#f8f7f4] dark:hover:bg-gray-800 transition-colors"
              >
                Report a Bug
              </a>
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Settings modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(28,26,23,0.24)', backdropFilter: 'blur(2px)' } as React.CSSProperties}
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#1c1a17] dark:text-white text-lg">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-[#b3ada3] hover:text-[#6f6a62] dark:hover:text-gray-300 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f4f2ee] dark:hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-[#f0eee9] dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-[#1c1a17] dark:text-gray-200">Dark mode</p>
                <p className="text-xs text-[#8a857d] dark:text-gray-500 mt-0.5">Switch to a darker color scheme</p>
              </div>
              <button
                onClick={toggleDark}
                role="switch"
                aria-checked={dark}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none ${dark ? 'bg-[#b45309]' : 'bg-[#e5e1da] dark:bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${dark ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
