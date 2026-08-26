import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, FileText, Calendar, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userMode } = useAuth();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'home',
      label: t.nav.home || 'Home',
      icon: Home,
      path: '/home'
    },
    {
      id: 'scan',
      label: t.nav.scanner || 'Scan',
      icon: Camera,
      path: '/scanner'
    },
    {
      id: 'reports',
      label: t.nav.history || 'Reports',
      icon: FileText,
      path: '/history'
    },
    {
      id: 'appointments',
      label: t.nav.appointments || 'Appointments',
      icon: Calendar,
      path: '/appointments'
    },
    {
      id: 'profile',
      label: t.nav.profile || 'Profile',
      icon: User,
      path: userMode === 'AUTHENTICATED' ? '/profile' : '/signin'
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-2 py-1.5 font-sans">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.id === 'reports' && (currentPath.startsWith('/report') || currentPath === '/history' || currentPath === '/reports')) ||
            (item.id === 'home' && (currentPath === '/' || currentPath === '/home' || currentPath === '/dashboard'));

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-sky-400 bg-sky-500/10 font-bold scale-105 border border-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] font-medium mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
