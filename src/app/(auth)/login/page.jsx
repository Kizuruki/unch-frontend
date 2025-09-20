"use client"

import { useEffect, useState } from "react";
import "./page.css";
import { useUser } from "../../../contexts/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isWaiting, setIsWaiting] = useState(false);
  const [externalLoginId, setExternalLoginId] = useState(null); // Track external login id
  const {
    sonolusUser,
    session,
    isSessionValid,
    clearExpiredSession,
    isClient,
    sessionReady,
  } = useUser();

  useEffect(() => {
    if (!sessionReady) return;

    if (sonolusUser && isSessionValid()) {
      router.push("/dashboard");
    } else {
      setIsWaiting(false);
    }
  }, [sessionReady, sonolusUser, isSessionValid, router]);

  const sonolusServerUrl = process.env['NEXT_PUBLIC_SONOLUS_SERVER_URL'];
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'];

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsWaiting(true); // Set to waiting when the user clicks
    try {
      const { id } = await (await fetch(`${apiUrl}/api/accounts/session/external/id`, { method: "POST" })).json();
      const [_proto, host] = sonolusServerUrl.split("://");

      // Set the external login ID
      setExternalLoginId(id);

      // Open the window directly
      window.open(`https://open.sonolus.com/external-login/${host}/sonolus/authenticate_external?id=${id}`, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.log(e);
      setIsWaiting(false); // Stop waiting in case of error
    }
  };

  useEffect(() => {
    if (!isWaiting || !externalLoginId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${apiUrl}/api/accounts/session/external/get?id=${externalLoginId}`);

      if (res.status === 202) {
        const { session_key, expiry } = await res.json();

        localStorage.setItem("session", session_key);
        localStorage.setItem("expiry", expiry);

        // Dispatch custom event to notify layout of auth change
        window.dispatchEvent(new CustomEvent('authChange'));

        setIsWaiting(false);
        router.push("/dashboard");
      } else if (res.status === 404) {
        console.error("Session expired");
        setIsWaiting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWaiting, externalLoginId]);

  return (
    <main>
      <div className="login-container">
        <div className="login-box">
          <h1>UntitledCharts</h1>
          {isWaiting ? (
            <div>
              <p>Waiting for authentication response...</p>
              {externalLoginId && ( // Only show the button if externalLoginId is not null
                <button
                  onClick={() => {
                    const [_proto, host] = sonolusServerUrl.split("://");
                    window.open(`https://open.sonolus.com/external-login/${host}/sonolus/authenticate_external?id=${externalLoginId}`, "_blank", "noopener,noreferrer");
                  }}
                  className="login-btn"
                >
                  Open Sonolus Login Link
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <button type="submit" className="login-btn">
                Log In via Sonolus
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}