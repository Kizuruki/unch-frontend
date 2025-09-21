"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LevelPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isValid, setIsValid] = useState(false);
  const sonolusServerUrl = process.env.NEXT_PUBLIC_SONOLUS_SERVER_URL;

  useEffect(() => {
    if (id) {
      const validId = /^UnCh-[a-zA-Z0-9]{32}$/.test(id);

      setIsValid(validId);

      if (!validId) {
        router.push('/');
      }
    }
  }, [id, router]);

  const handleGoBack = () => {
    router.back();
  };

  const getSonolusLink = () => {
    if (!sonolusServerUrl || !isValid) return '';
    const serverWithoutSchema = sonolusServerUrl.replace(/^https?:\/\//, '');
    return `https://open.sonolus.com/${serverWithoutSchema}/levels/${id}`;
  };

  return (
    <main>
      <div className="level-container">
        {isValid ? (
          <>
            <h1>Level ID: {id}</h1>
            <button onClick={() => window.open(getSonolusLink(), '_blank')}>
              Open In Sonolus
            </button>
          </>
        ) : (
          <p>Redirecting...</p>
        )}
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    </main>
  );
}