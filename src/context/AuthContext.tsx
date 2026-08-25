import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  registerWithEmail as apiRegister,
  loginWithEmail as apiLogin,
  signUpWithGoogle as apiSignUpGoogle,
  signInWithGoogle as apiSignInGoogle,
  logoutUser as apiLogout,
  checkGoogleRedirectResult,
  getUserProfileDoc,
  updateUserProfileDoc,
  createUserProfile as createUserProfileDoc,
  UserProfileData
} from '../services/firebase';

export type UserMode = 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'DEMO_MODE';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfileData | null;
  userMode: UserMode;
  loading: boolean;
  register: (email: string, pass: string, name: string, age: number, gender: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signUpGoogle: (useRedirectOnMobile?: boolean) => Promise<{ user: FirebaseUser | null; isNewUser: boolean; existingUser: boolean; profileCompleted: boolean }>;
  signInGoogle: (useRedirectOnMobile?: boolean) => Promise<{ user: FirebaseUser | null; notRegistered: boolean; profileCompleted: boolean }>;
  loginGoogle: (useRedirectOnMobile?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [userMode, setUserMode] = useState<UserMode>('UNAUTHENTICATED');
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Real Firebase Auth State (Source of Truth)
  useEffect(() => {
    // Check for Google Redirect Result on Mobile
    checkGoogleRedirectResult().catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[AUTH] Firebase Auth State Changed -> UID:', currentUser?.uid || 'NONE', '| Email:', currentUser?.email || 'NONE');
      setUser(currentUser);
      if (currentUser) {
        setUserMode('AUTHENTICATED');
        try {
          const profile = await getUserProfileDoc(currentUser.uid);
          setUserProfile(profile);
        } catch (err) {
          console.warn('[AUTH] Profile fetch notice:', err);
        }
      } else {
        setUserProfile(null);
        setUserMode((prev) => (prev === 'DEMO_MODE' ? 'DEMO_MODE' : 'UNAUTHENTICATED'));
      }
      setLoading(false);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfileDoc(user.uid);
        if (profile) setUserProfile(profile);
      } catch (e) {
        console.warn('[AUTH] Refresh profile notice:', e);
      }
    }
  };

  const register = async (email: string, pass: string, name: string, age: number, gender: string) => {
    setLoading(true);
    try {
      const newUser = await apiRegister(email, pass, name, age, gender);
      setUser(newUser);
      setUserMode('AUTHENTICATED');
      await refreshProfile();
    } catch (err: any) {
      console.error('[AUTH] Firebase Register Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const loggedUser = await apiLogin(email, pass);
      setUser(loggedUser);
      setUserMode('AUTHENTICATED');
      await refreshProfile();
    } catch (err: any) {
      console.error('[AUTH] Firebase Login Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpGoogle = async (useRedirectOnMobile = false) => {
    setLoading(true);
    try {
      console.log('[AUTH] Initiating Google Sign-Up...');
      const res = await apiSignUpGoogle(useRedirectOnMobile);
      if (res.user) {
        setUser(res.user);
        setUserMode('AUTHENTICATED');
        await refreshProfile();
      }
      return res;
    } catch (err: any) {
      console.error('[AUTH] Google Sign-Up Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async (useRedirectOnMobile = false) => {
    setLoading(true);
    try {
      console.log('[AUTH] Initiating Google Sign-In...');
      const res = await apiSignInGoogle(useRedirectOnMobile);
      if (res.user) {
        setUser(res.user);
        setUserMode('AUTHENTICATED');
        await refreshProfile();
      }
      return res;
    } catch (err: any) {
      console.error('[AUTH] Google Sign-In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async (useRedirectOnMobile = false): Promise<boolean> => {
    const res = await signUpGoogle(useRedirectOnMobile);
    return res.isNewUser;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (e) {
      console.warn('[AUTH] Logout notice:', e);
    } finally {
      setUser(null);
      setUserProfile(null);
      setUserMode('UNAUTHENTICATED');
      setLoading(false);
    }
  };

  const enterDemoMode = () => {
    setUser(null);
    setUserProfile(null);
    setUserMode('DEMO_MODE');
  };

  const exitDemoMode = () => {
    setUserMode('UNAUTHENTICATED');
  };

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    if (!user) return;
    try {
      await updateUserProfileDoc(user.uid, updates);
    } catch (e) {
      console.warn('[AUTH] Update profile doc notice:', e);
    }
    setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const effectiveUserProfile: UserProfileData = userProfile || {
    uid: user?.uid || 'guest_user_123',
    name: user?.displayName || 'Patient User',
    email: user?.email || 'patient@dermavision.ai',
    age: 28,
    gender: 'Prefer not to say',
    authProvider: 'email',
    role: 'patient',
    profileCompleted: true,
    preferredLanguage: 'en'
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile: effectiveUserProfile,
        userMode: user ? 'AUTHENTICATED' : 'DEMO_MODE',
        loading,
        register,
        login,
        signUpGoogle,
        signInGoogle,
        loginGoogle,
        logout,
        enterDemoMode,
        exitDemoMode,
        refreshProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
