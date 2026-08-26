import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ScanLine, LogOut, User, Eye, UserPlus, LogIn, Stethoscope } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, userMode, logout, exitDemoMode } = useAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/dashboard': return 'Overview';
      case '/scanner': return 'Scan Skin';
      case '/results': return 'AI Results';
      case '/report': return 'Clinical Report';
      case '/history': return 'Reports History';
      case '/doctor': return 'Doctor Hub';
      case '/profile': return 'Profile';
      case '/about': return 'About AI';
      default: return 'DermaVision AI';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      
      {/* DESKTOP NAVBAR (hidden md:flex) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400">
              <ScanLine className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-white">
              DermaVision <span className="text-sky-400">AI</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">ResNet50 Cutaneous Classifier</p>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/home"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive('/home') || isActive('/') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.nav.home}
          </Link>

          {userMode === 'AUTHENTICATED' && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/dashboard') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {t.nav.dashboard}
            </Link>
          )}

          <Link
            to="/scanner"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive('/scanner') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.nav.scanner}
          </Link>

          <Link
            to="/history"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive('/history') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.nav.history}
          </Link>

          <Link
            to="/appointments"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive('/appointments') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {(t.nav as any).appointments || 'Appointments'}
          </Link>

          <Link
            to="/about"
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive('/about') ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.nav.about}
          </Link>
        </nav>

        {/* Right Actions & Global Language Selector */}
        <div className="flex items-center gap-3">
          
          {userMode === 'DEMO_MODE' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>{t.nav.demoBadge}</span>
            </div>
          )}

          <LanguageSelector />



          {userMode === 'AUTHENTICATED' && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-sky-500/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">
                  {(userProfile?.name?.trim() || user?.displayName?.trim() || 'User')[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200">{userProfile?.name?.trim() || user?.displayName?.trim() || 'User'}</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/signin');
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title={t.nav.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : userMode === 'DEMO_MODE' ? (
            <button
              onClick={() => {
                exitDemoMode();
                navigate('/signin');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.45)] flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span>EXIT DEMO MODE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav.signIn}</span>
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.nav.register}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* COMPACT MOBILE HEADER (md:hidden) */}
      <div className="flex md:hidden h-14 px-4 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <ScanLine className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-white">{getPageTitle()}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          <Link to="/profile" className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <User className="w-4 h-4" />
          </Link>

          {(userMode === 'AUTHENTICATED' || user) && (
            <button
              onClick={logout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

    </header>
  );
};
