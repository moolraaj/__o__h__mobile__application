
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dantasurakshaks' | 'user';
  phoneNumber: string;
};

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const logout = useCallback(async (silent = false) => {
    if (!silent) {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await performLogout()
            },
          },
        ]
      )
    } else {
      await performLogout()
    }
  }, [])

  const performLogout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'user'])
    setToken(null)
    setUser(null)
  }


  useEffect(() => {
    (async () => {
      try {
        const [[, tk], [, ujson]] = await AsyncStorage.multiGet(['authToken', 'user']);
        if (tk) setToken(tk);
        if (ujson) setUser(JSON.parse(ujson));
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
