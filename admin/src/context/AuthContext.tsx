'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/api';

export interface SectionPermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  publish: boolean;
}

export interface RoleData {
  _id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Record<string, SectionPermissions>;
}

export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  avatar?: string;
  roleId?: RoleData;
}

interface AuthContextType {
  fbUser: FirebaseUser | null;
  user: UserProfile | null;
  role: RoleData | null;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginDevSuperAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (section: string, action?: keyof SectionPermissions) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Failed to load user profile');
    } catch (err) {
      console.error('Failed to load user profile from backend:', err);
      setUser(null);
      throw err;
    }
  };

  useEffect(() => {
    // Check if dev session is active
    if (typeof window !== 'undefined' && localStorage.getItem('dev_admin_token')) {
      fetchProfile().finally(() => setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFbUser(currentUser);
      if (currentUser) {
        await fetchProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const loginDevSuperAdmin = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_admin_token', 'dev-superadmin-token');
      }
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dev_admin_token');
    }
    await fbSignOut(auth).catch(() => {});
    setUser(null);
    setFbUser(null);
  };

  const isSuperAdmin = Boolean(user?.isSuperAdmin);
  const role = (user?.roleId as RoleData) || null;

  const hasPermission = (section: string, action: keyof SectionPermissions = 'view'): boolean => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    if (!role || !role.permissions) return false;

    const sectionPerm = role.permissions[section];
    if (!sectionPerm) return false;
    return Boolean(sectionPerm[action]);
  };

  return (
    <AuthContext.Provider
      value={{
        fbUser,
        user,
        role,
        isSuperAdmin,
        loading,
        login,
        loginWithGoogle,
        loginDevSuperAdmin,
        logout,
        hasPermission,
        refreshUser: fetchProfile,
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

