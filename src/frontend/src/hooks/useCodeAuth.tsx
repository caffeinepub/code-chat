import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useActor } from './useActor';

interface CodeAuthContextType {
  userId: bigint | null;
  authCode: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
  setAuth: (userId: bigint, code: string) => void;
}

const CodeAuthContext = createContext<CodeAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'code_auth';

interface StoredAuth {
  userId: string;
  authCode: string;
}

export function CodeAuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<bigint | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { actor } = useActor();

  // Restore session from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredAuth = JSON.parse(stored);
        setUserId(BigInt(parsed.userId));
        setAuthCode(parsed.authCode);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (code: string) => {
    if (!actor) throw new Error('Actor not initialized');
    
    const authenticatedUserId = await actor.authenticateWithCode(code);
    
    // Store in state
    setUserId(authenticatedUserId);
    setAuthCode(code);
    
    // Persist to local storage
    const authData: StoredAuth = {
      userId: authenticatedUserId.toString(),
      authCode: code,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  };

  const logout = () => {
    setUserId(null);
    setAuthCode(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const setAuth = (newUserId: bigint, code: string) => {
    setUserId(newUserId);
    setAuthCode(code);
    
    const authData: StoredAuth = {
      userId: newUserId.toString(),
      authCode: code,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  };

  const value: CodeAuthContextType = {
    userId,
    authCode,
    isAuthenticated: userId !== null,
    isInitializing,
    login,
    logout,
    setAuth,
  };

  return <CodeAuthContext.Provider value={value}>{children}</CodeAuthContext.Provider>;
}

export function useCodeAuth() {
  const context = useContext(CodeAuthContext);
  if (context === undefined) {
    throw new Error('useCodeAuth must be used within a CodeAuthProvider');
  }
  return context;
}
