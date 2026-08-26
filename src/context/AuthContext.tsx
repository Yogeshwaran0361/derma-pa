import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, deleteUser, User as FirebaseUser } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
import {
  auth,
  db,
  registerWithEmail as apiRegister,
  loginWithEmail as apiLogin,
  logoutUser as apiLogout,
  getUserProfileDoc,
  updateUserProfileDoc,
  createUserProfile,
  UserProfileData,
  reloadUserAuth,
  signUpWithGoogle as apiSignUpGoogle,
  signInWithGoogle as apiSignInGoogle
} from '../services/firebase';

export type UserMode = 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'DEMO_MODE';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfileData | null;
  userMode: UserMode;
  setUserMode: React.Dispatch<React.SetStateAction<UserMode>>;
  loginOtpVerified: boolean;
  setLoginOtpVerified: (verified: boolean) => void;
  loading: boolean;
  accountStatus: 'PENDING_VERIFICATION' | 'ACTIVE' | 'DISABLED' | 'UNAUTHENTICATED';
  login: (email: string, pass: string) => Promise<void>;
  signUpGoogle: (useRedirectOnMobile?: boolean) => Promise<{ user: FirebaseUser | null; isNewUser: boolean; existingUser: boolean; profileCompleted: boolean }>;
  signInGoogle: (useRedirectOnMobile?: boolean) => Promise<{ user: FirebaseUser | null; notRegistered: boolean; profileCompleted: boolean }>;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfileData>) => Promise<void>;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [userMode, setUserMode] = useState<UserMode>('UNAUTHENTICATED');
  const [loginOtpVerified, setLoginOtpVerifiedState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('dermavision_login_otp_verified') === 'true';
    } catch (e) {
      return false;
    }
  });

  const setLoginOtpVerified = (verified: boolean) => {
    setLoginOtpVerifiedState(verified);
    try {
      if (verified) {
        sessionStorage.setItem('dermavision_login_otp_verified', 'true');
      } else {
        sessionStorage.removeItem('dermavision_login_otp_verified');
      }
    } catch (e) {}
  };

  const [loading, setLoading] = useState<boolean>(true);

  // Sync Real Firebase Auth State (Source of Truth)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[AUTH] Firebase Auth State Changed -> UID:', currentUser?.uid || 'NONE', '| Email:', currentUser?.email || 'NONE');
      if (currentUser) {
        try {
          let profile = await getUserProfileDoc(currentUser.uid);
          if (!profile && currentUser.email) {
            try {
              const q = query(collection(db, 'users'), where('email', '==', currentUser.email.toLowerCase()));
              const snap = await getDocs(q);
              if (!snap.empty) {
                profile = snap.docs[0].data() as UserProfileData;
              }
            } catch (e) {}
          }

          if (profile && profile.profileCompleted === true) {
            // VERIFIED REGISTERED USER WHO COMPLETED STEP 3 PASSWORD CREATION!
            setUser(currentUser);
            setUserProfile(profile);
            setUserMode('AUTHENTICATED');
          } else {
            // IN-PROGRESS / UNCOMPLETED REGISTRATION — DO NOT GRANT AUTHENTICATED MODE!
            console.log('[AUTH] User registration in-progress. Firestore profile deferred until Step 3 Password Creation.');
            setUser(currentUser);
            setUserProfile(null);
            setUserMode((prev) => (prev === 'DEMO_MODE' ? 'DEMO_MODE' : 'UNAUTHENTICATED'));
          }
        } catch (err) {
          console.warn('[AUTH] Profile check error:', err);
          await signOut(auth);
          setUser(null);
          setUserProfile(null);
          setUserMode((prev) => (prev === 'DEMO_MODE' ? 'DEMO_MODE' : 'UNAUTHENTICATED'));
        }
      } else {
        setUser(null);
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
        await reloadUserAuth();
        const profile = await getUserProfileDoc(user.uid);
        if (profile) setUserProfile(profile);
      } catch (e) {
        console.warn('[AUTH] Refresh profile notice:', e);
      }
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
        // Do not set AUTHENTICATED mode during sign-up registration wizard!
        // User must fill out patient details and complete OTP verification first!
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
      if (res.user && !res.notRegistered) {
        setUser(res.user);
        setUserMode('AUTHENTICATED');
        await refreshProfile();
      } else {
        setUser(null);
        setUserProfile(null);
        setUserMode((prev) => (prev === 'DEMO_MODE' ? 'DEMO_MODE' : 'UNAUTHENTICATED'));
      }
      return res;
    } catch (err: any) {
      console.error('[AUTH] Google Sign-In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
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
      setLoginOtpVerified(false);
      setLoading(false);
    }
  };

  const enterDemoMode = () => {
    setUser({
      uid: 'demo_visitor_id',
      email: 'demo@dermavision.ai',
      displayName: 'Demo Visitor',
      emailVerified: true
    } as any);
    setUserProfile({
      uid: 'demo_visitor_id',
      name: 'Demo Visitor',
      email: 'demo@dermavision.ai',
      role: 'patient',
      profileCompleted: true,
      age: 30,
      gender: 'other',
      preferredLanguage: 'en',
      authProvider: 'demo'
    } as any);
    setUserMode('DEMO_MODE');
    setLoginOtpVerified(true);
    try {
      localStorage.setItem('dermavision_user_mode', 'DEMO_MODE');
    } catch (e) {}
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

  // Determine Exact Account Status
  const isEmailVerified = Boolean(user?.emailVerified || userProfile?.emailVerified);
  let accountStatus: 'PENDING_VERIFICATION' | 'ACTIVE' | 'DISABLED' | 'UNAUTHENTICATED' = 'UNAUTHENTICATED';
  
  if (user) {
    if (!isEmailVerified) {
      accountStatus = 'PENDING_VERIFICATION';
    } else if (userProfile?.accountStatus === 'DISABLED') {
      accountStatus = 'DISABLED';
    } else {
      accountStatus = 'ACTIVE';
    }
  }

  const effectiveUserProfile: UserProfileData | null = userProfile || (user ? {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Patient User',
    email: user.email || '',
    age: 28,
    gender: 'Prefer not to say',
    authProvider: 'email',
    emailVerified: isEmailVerified,
    role: 'patient',
    accountStatus,
    profileCompleted: true,
    preferredLanguage: 'en'
  } : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile: effectiveUserProfile,
        userMode,
        setUserMode,
        loginOtpVerified,
        setLoginOtpVerified,
        loading,
        accountStatus,
        login,
        signUpGoogle,
        signInGoogle,
        logout,
        enterDemoMode,
        exitDemoMode,
        refreshProfile,
        updateProfile,
        isEmailVerified
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
