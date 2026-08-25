import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
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

// Protected Route Wrapper Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Loading DermaVision AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Demo Route Helper
const DemoRouteHandler: React.FC = () => {
  const navigate = useNavigate();
  const { enterDemoMode } = useAuth();

  useEffect(() => {
    enterDemoMode();
    navigate('/scanner', { replace: true });
  }, [enterDemoMode, navigate]);

  return null;
};

const AppContent: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handlePredictionComplete = (result: PredictionResponse, previewUrl: string) => {
    setPredictionData(result);
    setImagePreviewUrl(previewUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-x-hidden relative">
      <Navbar />
      <AppointmentNotificationBanner />

      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<DemoRouteHandler />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/scanner"
            element={
              <Scanner
                onPredictionComplete={handlePredictionComplete}
              />
            }
          />

          <Route
            path="/results"
            element={
              <Results
                predictionData={predictionData}
                imagePreviewUrl={imagePreviewUrl}
              />
            }
          />

          <Route
            path="/report"
            element={
              <Report
                predictionData={predictionData}
                imagePreviewUrl={imagePreviewUrl}
              />
            }
          />
          <Route
            path="/report/:id"
            element={
              <Report
                predictionData={predictionData}
                imagePreviewUrl={imagePreviewUrl}
              />
            }
          />

          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<History />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor" element={<DoctorHub />} />
          <Route path="/messages" element={<Messages />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <BottomNav />
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
