"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const APILink = process.env.NEXT_PUBLIC_API_URL;

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sonolusUser, setSonolusUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const checkAuthStatus = async () => {
    // Only check auth status on client side
    if (!isClient) return;
    
    setLoading(true);
    const sessionValue = localStorage.getItem("session");
    const expiry = localStorage.getItem("expiry");
    
    // Check if session is expired
    if (sessionValue && expiry) {
      const now = new Date().getTime();
      const expiryTime = parseInt(expiry, 10);
      
      console.log('Session check:', { now, expiryTime, expired: now >= expiryTime });
      
      if (isNaN(expiryTime) || now >= expiryTime) {
        // Session expired, clear localStorage
        console.log('Session expired, clearing data');
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
        const me = await fetch(`${APILink}/api/accounts/session/account/`, {
          headers: {
            "Authorization": `${sessionValue}`
          }
        });

        // Check if the API call failed due to expired session
        if (!me.ok) {
          console.log('API call failed, session might be expired:', me.status);
          if (me.status === 401 || me.status === 403) {
            // Session is invalid, clear everything
            localStorage.removeItem("session");
            localStorage.removeItem("expiry");
            setIsLoggedIn(false);
            setSonolusUser(null);
            setSession(null);
            setLoading(false);
            return;
          }
          // For other HTTP errors, don't clear localStorage
          // Just log the error and continue
          console.log('API call failed with status:', me.status);
        } else {
          // API call succeeded, process the response
          const meData = await me.json();
          console.log(meData);
          
          // TODO: we shouldn't need this anymore
          // meData now includes sonolus_username
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
        }

      } catch (error) {
        console.log('Error fetching user data:', error);
        // If there's a network error, don't clear the session
        // The user might just be offline
        // Keep the user logged in with their existing session
      }
    } else {
      setIsLoggedIn(false);
      setSonolusUser(null);
      setSession(null);
    }
    
    setLoading(false);
    setSessionReady(true); // Session evaluation is complete
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("expiry");
    setIsLoggedIn(false);
    setSonolusUser(null);
    setSession(null);
    setSessionReady(true); // Session is now in a known state (logged out)
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  const refreshUser = () => {
    checkAuthStatus();
  };

  // Function to check if session is still valid
  const isSessionValid = () => {
    // Only check session validity on client side
    if (!isClient) return false;
    
    const sessionValue = localStorage.getItem("session");
    const expiry = localStorage.getItem("expiry");
    
    if (!sessionValue || !expiry) {
      return false;
    }
    
    const now = new Date().getTime();
    const expiryTime = parseInt(expiry, 10);
    
    return !isNaN(expiryTime) && now < expiryTime;
  };

  // Function to clear expired session
  const clearExpiredSession = () => {
    console.log('Clearing expired session');
    localStorage.removeItem("session");
    localStorage.removeItem("expiry");
    setIsLoggedIn(false);
    setSonolusUser(null);
    setSession(null);
    setSessionReady(true); // Session is now in a known state (logged out)
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  useEffect(() => {
    // Set client flag to true after component mounts
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run auth checks after client-side mounting
    if (!isClient) return;
    
    checkAuthStatus();
    
    // Set up periodic session check (every 5 minutes)
    const sessionCheckInterval = setInterval(() => {
      if (isLoggedIn && !isSessionValid()) {
        clearExpiredSession();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom auth events (same tab changes)
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [isClient, isLoggedIn]);

  const value = {
    isLoggedIn,
    sonolusUser,
    loading,
    session,
    isClient,
    sessionReady,
    handleLogout,
    refreshUser,
    isSessionValid,
    clearExpiredSession
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
