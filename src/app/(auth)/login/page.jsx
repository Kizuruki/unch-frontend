"use client"

import { useEffect } from "react";
import "./page.css";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Login() {
  const [isWaiting, setIsWaiting] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    try {
      const { id } = await (await fetch(`${process.env.API_URL}/api/accounts/session/external/id`, { method: "POST" })).json()

      window.open(`https://open.sonolus.com/external-login/${process.env.API_URL_NO_HTTPS}/sonolus/authenticate_external?id=${id}`, "_blank", "noopener,noreferrer")

      setIsWaiting(true)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!isWaiting) return

    const interval = setInterval(async () => {
      const res = await fetch(`${process.env.API_URL}/api/accounts/session/external/get?id=${id}`)

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
            <p>Login function hasn't been implemented yet (sorry)<br></br>
              but let's pretend like the button actually does something</p>
            <form onSubmit={onSubmit}>

              {/* <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required /> */}
              <button type="submit" className="login-btn">Log In</button>
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
