import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { LevelUpModal } from './components/LevelUpModal';
import { FloatingXP } from './components/FloatingXP';
import { FocusTimerModal } from './components/FocusTimerModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Quests } from './pages/Quests';
import { Character } from './pages/Character';
import { Streak } from './pages/Streak';
import { Shop } from './pages/Shop';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Progress } from './pages/Progress';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase animate-pulse">
            SYNCHRONIZING REALM DATA...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Only Route (for login/signup when already authenticated)
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      {!isAuthPage && <Navbar />}

      <main className="flex-grow pb-16 md:pb-0">
        <Routes>
          {/* Root Route: Dashboard if authenticated, else direct Login */}
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quests"
            element={
              <ProtectedRoute>
                <Quests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/character"
            element={
              <ProtectedRoute>
                <Character />
              </ProtectedRoute>
            }
          />

          <Route
            path="/streak"
            element={
              <ProtectedRoute>
                <Streak />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Character />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile One-Thumb Bottom Navigation */}
      <MobileBottomNav />

      {/* Global RPG Overlays */}
      <LevelUpModal />
      <FloatingXP />
      <FocusTimerModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}
