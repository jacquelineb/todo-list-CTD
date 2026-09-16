import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  // State for authentication
  const [email, setEmail] = useState(JSON.parse(localStorage.getItem('email')));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));

  useEffect(() => {
    localStorage.setItem('email', JSON.stringify(email));
    localStorage.setItem('token', JSON.stringify(token));
  }, [email, token]);

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      };

      const res = await fetch('/api/users/logon', options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
        setEmail(data.name);
        setToken(data.csrfToken);

        return { success: true };
      } else {
        // Failure: Return error
        return {
          success: false,
          error: `Authentication failed: ${data?.message}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error during login',
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      };

      const res = await fetch('/api/users/logoff', options);
      if (res.status === 200 || res.status === 401) {
        setEmail('');
        setToken('');
      }
      return { success: true };
    } catch (error) {
      setEmail('');
      setToken('');
      return {
        success: false,
        error: 'Network error during logout',
      };
    }
  };

  // Context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
