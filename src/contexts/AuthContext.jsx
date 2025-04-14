import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

// Simulated user data
const MOCK_USER = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

// Hard-coded authentication code
const VALID_CODE = '123456';

// Storage keys
const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
const ADMIN_USER_KEY = 'admin_user';
const ADMIN_TOKEN_KEY = 'admin_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user was previously authenticated
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedAdminUser = localStorage.getItem(ADMIN_USER_KEY);
    const savedAdminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdminUser && savedAdminToken) {
      setAdminUser(JSON.parse(savedAdminUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    adminUser,
    loading,
    error,
    signIn: async ({ code }) => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code === VALID_CODE) {
          // Generate a simple token (in a real app, this would come from your backend)
          const token = btoa(Date.now().toString());
          
          // Save both user and token
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(MOCK_USER));
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          
          setUser(MOCK_USER);
          return MOCK_USER;
        } else {
          throw new Error('Invalid code');
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    adminSignIn: async ({ email, password }) => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Admin credentials
        const validAdmins = {
          'admin@brainiup.com': 'Enigma3579dol!@#'
        };

        // Check admin credentials
        if (validAdmins[email] && validAdmins[email] === password) {
          const adminData = {
            email,
            role: 'admin'
          };

          // Generate admin token
          const token = btoa(Date.now().toString());
          
          // Save admin data and token
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
          localStorage.setItem(ADMIN_TOKEN_KEY, token);
          
          setAdminUser(adminData);
          return adminData;
        } else {
          throw new Error('Credențiale invalide');
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear all auth data
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    adminSignOut: async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear admin auth data
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAdminUser(null);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 