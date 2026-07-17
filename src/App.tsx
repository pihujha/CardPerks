import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from './lib/auth';
import Landing    from './pages/Landing';
import Dashboard  from './pages/Dashboard';
import Cards      from './pages/Cards';
import Insights   from './pages/Insights';
import Analysis   from './pages/Analysis';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  if (isPending) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading…
    </div>
  );
  if (!session) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Landing />} />
      <Route path="/sign-in"  element={<SignInPage />} />
      <Route path="/sign-up"  element={<SignUpPage />} />

      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/cards"     element={<RequireAuth><Cards /></RequireAuth>} />
      <Route path="/insights"  element={<RequireAuth><Insights /></RequireAuth>} />
      <Route path="/analysis"  element={<RequireAuth><Analysis /></RequireAuth>} />
    </Routes>
  );
}
