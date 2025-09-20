"use client";
import { useRouter } from "next/navigation";

export default function LevelPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main>
      <div className="not-implemented-container">
        <h1>Not Implemented</h1>
        <p>This page is not yet implemented.</p>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    </main>
  );
}
