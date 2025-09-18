"use client";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import "./layout.css";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import { UserProvider, useUser } from "../contexts/UserContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function HeaderContent() {
  const { isLoggedIn, sonolusUser, handleLogout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);


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
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Untitled Charts</title>
        <meta name="description" content="UntitledCharts Sonolus Server" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <HeaderContent />
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
        </UserProvider>
      </body>
    </html>
  );
}