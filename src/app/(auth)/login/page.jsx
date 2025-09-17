"use client"

import { useEffect, useState } from "react";
import "./page.css";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Login() {
  const [isWaiting, setIsWaiting] = useState(false)

  const sonolusServerUrl = process.env['NEXT_PUBLIC_SONOLUS_SERVER_URL'];
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'];

  const onSubmit = async e => {
    e.preventDefault()
    try {
      const apiUrlNoHTTPS = apiUrl.replace("http://", "").replace("https://", "")

      const { id } = await (await fetch(`${apiUrl}/api/accounts/session/external/id`, { method: "POST" })).json()

      window.open(`https://open.sonolus.com/external-login/${sonolusServerUrl}/sonolus/authenticate_external?id=${id}`, "_blank", "noopener,noreferrer")

      setIsWaiting(true)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!isWaiting) return

    const interval = setInterval(async () => {
      const res = await fetch(`${apiUrl}/api/accounts/session/external/get?id=${id}`)

      if (res.status === 202) {
        const { session_key, expiry } = await res.json()

        localStorage.setItem("session", session_key)
        localStorage.setItem("expiry", expiry)

        setIsWaiting(false)
        redirect("/dashboard")
      } else if (res.status === 404) {
        console.error("expired")
        setIsWaiting(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isWaiting])

  return (
    <main>
      <div className="login-container">
        <div className="login-box">
          <h1>UntitledCharts</h1>
          {isWaiting ? (<p>Waiting...</p>) : (<>
            <form onSubmit={onSubmit}>

              {/* <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required /> */}
              <button type="submit" className="login-btn">Log In via Sonolus</button>
            </form>
            <p>
              Don't have an account? <span className="sucks">that sucks</span>
            </p>
          </>)}
        </div>
      </div>
    </main >
  );
}
