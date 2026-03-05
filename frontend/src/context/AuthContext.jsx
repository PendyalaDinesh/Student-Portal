// Week 2 — AuthContext: manages Firebase auth + synced MongoDB user
import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth, googleProvider,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  sendEmailVerification, sendPasswordResetEmail,
  onAuthStateChanged, updateProfile,
} from '../services/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase user object
  const [dbUser,       setDbUser]       = useState(null); // MongoDB user object
  const [loading,      setLoading]      = useState(true);

  // Sync MongoDB user after Firebase auth state resolves
  const syncDbUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setDbUser(data);
      return data;
    } catch {
      setDbUser(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) await syncDbUser();
      else setDbUser(null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Auth methods ───────────────────────────────────────────
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await syncDbUser();
    return result;
  };

  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncDbUser();
    return result;
  };

  const registerWithEmail = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
    await syncDbUser();
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setDbUser(null);
  };

  const resetPassword    = (email) => sendPasswordResetEmail(auth, email);
  const refreshDbUser    = ()      => syncDbUser();

  const value = {
    firebaseUser, dbUser, loading,
    isLoggedIn: !!firebaseUser,
    loginWithGoogle, loginWithEmail, registerWithEmail,
    logout, resetPassword, refreshDbUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
