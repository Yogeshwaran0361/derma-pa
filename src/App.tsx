import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Register } from './pages/Register';
import { OtpVerification } from './pages/OtpVerification';
import { CreatePassword } from './pages/CreatePassword';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Scanner } from './pages/Scanner';
import { Results } from './pages/Results';
import { Report } from './pages/Report';
import { History } from './pages/History';
import { Appointments } from './pages/Appointments';
import { DoctorHub } from './pages/DoctorHub';
import { Messages } from './pages/Messages';
import { About } from './pages/About';
import { PredictionResponse } from './types';
import { AppointmentNotificationBanner } from './components/AppointmentNotificationBanner';
import { ShieldAlert } from 'lucide-react';

// Demo Restriction Notice Modal
const DemoRestrictionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Feature Restricted in Demo Mode</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Demo users can test the AI Skin Scanner and view basic findings. Downloading full PDF reports, viewing scan history, and booking doctor consultations require a registered patient account.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/signup');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs cursor-pointer"
          >
            Create Free Patient Account
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/signin');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Sign In to Patient Account
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component with Demo & Login OTP Authorization Checks
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowDemo?: boolean }> = ({ children, allowDemo = false }) => {
  const { user, userMode, loginOtpVerified, loading, accountStatus } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Securing Patient Portal...</p>
        </div>
      </div>
    );
  }

  // Handle Unauthenticated Visitors
  if (userMode === 'UNAUTHENTICATED' && !user) {
    return <Navigate to="/signin" replace />;
  }

  // Handle Authenticated Users who have NOT completed Login OTP Verification
  if (userMode === 'AUTHENTICATED' && !loginOtpVerified) {
    return <Navigate to="/signin" replace />;
  }

  // Handle Unverified Accounts
  if (user && accountStatus === 'PENDING_VERIFICATION') {
    return <Navigate to="/signup" replace />;
  }

  // Handle Demo Mode Visitors attempting to access restricted features
  if (userMode === 'DEMO_MODE' && !allowDemo) {
    return (
      <>
        <DemoRestrictionModal isOpen={true} onClose={() => setShowDemoModal(false)} />
        <Navigate to="/home" replace />
      </>
    );
  }

  return <>{children}</>;
};

// Demo Mode Route Handler
const DemoRouteHandler: React.FC = () => {
  const navigate = useNavigate();
  const { enterDemoMode } = useAuth();

  useEffect(() => {
    enterDemoMode();
    navigate('/home', { replace: true });
  }, [enterDemoMode, navigate]);

  return null;
};

// Root Landing Route Evaluator (Renders Home for registered patients, or redirects visitors to /signin)
const RootLandingHandler: React.FC = () => {
  const { userMode, loginOtpVerified } = useAuth();
  if (userMode === 'AUTHENTICATED' && loginOtpVerified) {
    return <Home />;
  }
  return <Navigate to="/signin" replace />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const isAuthPage = ['/signin', '/login', '/signup', '/register', '/otp-verification', '/create-password'].includes(location.pathname.toLowerCase());

  const handlePredictionComplete = (result: PredictionResponse, previewUrl: string) => {
    setPredictionData(result);
    setImagePreviewUrl(previewUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-x-hidden relative">
      
      {/* Hide Navbar & BottomNav on standalone Sign In / Sign Up / OTP pages for clean full-page experience */}
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <AppointmentNotificationBanner />}

      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Default Root Path Evaluator */}
          <Route path="/" element={<RootLandingHandler />} />

          {/* Standalone Full-Page Auth Routes (No Navbar) */}
          <Route path="/signin" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/demo" element={<DemoRouteHandler />} />

          {/* Real Showcase Home Page (Model of Real Homepage) */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* AI Scanner & Results (Allowed in Demo Mode) */}
          <Route
            path="/scanner"
            element={
              <ProtectedRoute allowDemo={true}>
                <Scanner onPredictionComplete={handlePredictionComplete} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute allowDemo={true}>
                <Results predictionData={predictionData} imagePreviewUrl={imagePreviewUrl} />
              </ProtectedRoute>
            }
          />

          {/* Protected Patient Routes (Allowed in Demo Mode for full viewing) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowDemo={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowDemo={true}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute allowDemo={true}>
                <Report predictionData={predictionData} imagePreviewUrl={imagePreviewUrl} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute allowDemo={true}>
                <Report predictionData={predictionData} imagePreviewUrl={imagePreviewUrl} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute allowDemo={true}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowDemo={true}>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowDemo={true}>
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowDemo={true}>
                <DoctorHub />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute allowDemo={true}>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <AppContent />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
