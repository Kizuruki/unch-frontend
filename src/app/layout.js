"use client";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import "./layout.css";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const APILink = process.env.NEXT_PUBLIC_API_URL;

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sonolusUser, setSonolusUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const session = localStorage.getItem("session");
      const expiry = localStorage.getItem("expiry");
      
      // Check if session is expired
      if (session && expiry) {
        const now = new Date().getTime();
        const expiryTime = parseInt(expiry, 10);
        
        if (isNaN(expiryTime) || now >= expiryTime) {
          // Session expired, clear localStorage
          localStorage.removeItem("session");
          localStorage.removeItem("expiry");
          setIsLoggedIn(false);
          setSonolusUser(null);
          setShowDropdown(false);
          return;
        }
      }
      
      if (session) {
        setIsLoggedIn(true);
        
        try {
          const me = await fetch(`${APILink}/api/accounts/session/external/account`, {
            headers: {
              "Authorization": `${session}`
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
      }
    };
    
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

  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("expiry");
    setIsLoggedIn(false);
    setSonolusUser(null);
    setShowDropdown(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('authChange'));
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-profile-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <html lang="en">
      <Head>
        <title>Untitled Charts</title>
        <meta name="description" content="UntitledCharts Sonolus Server" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <div className="left">
            <Link href="/">
            <img src="/636a8f1e76b38cb1b9eb0a3d88d7df6f.png" alt="UntitledCharts Logo" />
            <h2>UntitledCharts</h2>
            </Link>
          </div>
          <NavLinks user={sonolusUser} />
          <div className="right">
            {isLoggedIn && sonolusUser ? (
              <div className="user-profile-container">
                <div 
                  className="user-profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="user-avatar">
                    {sonolusUser.avatarType === 'default' ? (
                      <div 
                        className="default-avatar"
                        style={{
                          backgroundColor: sonolusUser.avatarBackgroundColor,
                          color: sonolusUser.avatarForegroundColor
                        }}
                      >
                        {sonolusUser.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <img 
                        src={`https://service.sonolus.com/users/${sonolusUser.id}/avatar`} 
                        alt={sonolusUser.name}
                        className="user-avatar-img"
                      />
                    )}
                  </div>
                  <span className="user-name">{sonolusUser.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login">
                <button>Login</button>
              </a>
            )}
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer>
          <div className="footer-left"></div>
          <div className="footer-center">
          <span>Connect using the server link "https://sonolus.untitledcharts.com"</span>
          </div>
          <div className="footer-right">
          <ul>
            <li>
              <p>Follow Us</p>
              <a href="https://www.youtube.com/@UntitledCharts" target="_blank" rel="noopener noreferrer">Youtube</a>
               <a href="https://www.tiktok.com/@untitledcharts" target="_blank" rel="noopener noreferrer">TikTok</a>
                <a href="https://discord.gg/mH3xWPPdEY" target="_blank" rel="noopener noreferrer">Discord</a>
            </li>
          </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}