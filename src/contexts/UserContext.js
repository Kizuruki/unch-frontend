"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const APILink = process.env.NEXT_PUBLIC_API_URL;

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sonolusUser, setSonolusUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const checkAuthStatus = async () => {
    setLoading(true);
    const sessionValue = localStorage.getItem("session");
    const expiry = localStorage.getItem("expiry");
    
    // Check if session is expired
    if (sessionValue && expiry) {
      const now = new Date().getTime();
      const expiryTime = parseInt(expiry, 10);
      
      if (isNaN(expiryTime) || now >= expiryTime) {
        // Session expired, clear localStorage
        localStorage.removeItem("session");
        localStorage.removeItem("expiry");
        setIsLoggedIn(false);
        setSonolusUser(null);
        setSession(null);
        setLoading(false);
        return;
      }
    }
    
    if (sessionValue) {
      setIsLoggedIn(true);
      setSession(sessionValue);
      
      try {
        const me = await fetch(`${APILink}/api/accounts/session/external/account`, {
          headers: {
            "Authorization": `${sessionValue}`
          }
        });

        const meData = await me.json();
        console.log(meData);
        
        try {
          const targetUrl = `https://service.sonolus.com/users/handle/${meData.sonolus_handle}`;
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
          const proxyResponse = await fetch(proxyUrl);
          
          if (proxyResponse.ok) {
            const proxyData = await proxyResponse.json();
            const sonolusData = JSON.parse(proxyData.contents);
            console.log('Sonolus data:', sonolusData);
            setSonolusUser(sonolusData);
          } else {
            console.log('AllOrigins failed, trying CORS Anywhere...');
            const fallbackUrl = `https://cors-anywhere.herokuapp.com/${targetUrl}`;
            const fallbackResponse = await fetch(fallbackUrl);
            if (fallbackResponse.ok) {
              const sonolusData = await fallbackResponse.json();
              console.log('Sonolus data (via CORS Anywhere):', sonolusData);
              setSonolusUser(sonolusData);
            }
          }
        } catch (error) {
          console.log('Error fetching Sonolus data:', error);
        }

      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    } else {
      setIsLoggedIn(false);
      setSonolusUser(null);
      setSession(null);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("expiry");
    setIsLoggedIn(false);
    setSonolusUser(null);
    setSession(null);
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  const refreshUser = () => {
    checkAuthStatus();
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom auth events (same tab changes)
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const value = {
    isLoggedIn,
    sonolusUser,
    loading,
    session,
    handleLogout,
    refreshUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
