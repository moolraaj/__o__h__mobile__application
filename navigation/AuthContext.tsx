 
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  role: 'admin' | 'dantasurakshaks' | 'user';
  phoneNumber: string;
};

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser]   = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    (async () => {
      try {
        const [[, tk], [, ujson]] = await AsyncStorage.multiGet(['authToken', 'user']);
        if (tk)    setToken(tk);
        if (ujson) setUser(JSON.parse(ujson));
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
