// src/app/levels/[id]/page.jsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LevelPage() {
  const router = useRouter();
  const { id } = useParams(); // Correct way to get dynamic `id` in Next.js 13+
  const [isValid, setIsValid] = useState(false);
  const sonolusServerUrl = process.env.NEXT_PUBLIC_SONOLUS_SERVER_URL;

  useEffect(() => {
    if (id) {
      // Validate the ID using regex
      const validId = /^UnCh-[a-zA-Z0-9]{32}$/.test(id);
      setIsValid(validId);

      if (!validId) {
        setTimeout(() => {
          router.push("/"); // Redirect if ID is invalid
        }, 500);
      }
    }
  }, [id, router]);

  const handleGoBack = () => {
    router.back(); // Go back to the previous page
  };

  const getSonolusLink = () => {
    if (!sonolusServerUrl || !isValid) return '';
    const serverWithoutSchema = sonolusServerUrl.replace(/^https?:\/\//, '');
    return `https://open.sonolus.com/${serverWithoutSchema}/levels/${id}`;
  };

  return (
    <main>
      <div className="level-container">
        {id ? (
          isValid ? (
            <>
              <h1>Level ID: {id}</h1>
<button 
  onClick={() => window.open(getSonolusLink(), "_blank")} 
  style={{
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }}
>
  Open In Sonolus
</button>
            </>
          ) : (
            <p>Redirecting...</p>
          )
        ) : (
          <p>Loading...</p> // Handle loading state until the ID is available
        )}
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    </main>
  );
}