// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { initSeedData } from '../services/authService';
import profileService from '../services/profileService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        initSeedData();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const loggedIn = await authService.login({ email, password });
      setUser(loggedIn);
      toast.success(`Welcome back, ${loggedIn.name}!`);
      return loggedIn;
    } catch (err) {
      toast.error(err.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const registered = await authService.register(userData);
      setUser(registered);
      toast.success(`Account created! Welcome, ${registered.name}`);
      return registered;
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Not logged in');
      const updated = await profileService.updateProfile(user.id, profileData);
      setUser(updated);
      toast.success('Profile updated successfully.');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
