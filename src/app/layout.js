import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import "./layout.css";
import NavLinks from "./NavLinks";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Untitled Charts",
  description: "UntitledCharts Sonolus Server",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <div className="left">
            <img src="/636a8f1e76b38cb1b9eb0a3d88d7df6f.png" alt="UntitledCharts Logo" />
            <h2>UntitledCharts</h2>
          </div>
          <NavLinks />
          <div className="right">
            <a href="/login">
            <button>Login</button>
            </a>
          </div>
        </header>
        {children}
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