"use client";
import "./page.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const BASE = "https://sonolus.untitledcharts.com";
const APILink = process.env.NEXT_PUBLIC_API_URL;

export default function LevelPage() {
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const levelId = searchParams.get('id');

  useEffect(() => {
    if (!levelId) {
      setError("No level ID provided");
      setLoading(false);
      return;
    }

    const fetchLevel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${APILink}/sonolus/levels/list/`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch levels: ${res.status}`);
        }
        
        const data = await res.json();
        const item = (data.items || []).find((x) => x.name === levelId);
        
        if (!item) {
          setError("Level not found");
        } else {
          setLevel(item);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [levelId]);

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <p>Loading level...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  if (!level) {
    return (
      <main>
        <div className="error-container">
          <p>Level not found</p>
        </div>
      </main>
    );
  }

  const coverUrl = level.cover ? BASE + level.cover.url : "";
  const bgmUrl = level.bgm ? BASE + level.bgm.url : "";

  return (
    <main>
      <div className="detail-container">
        <h1>{level.title}</h1>
        <span><p className="label">Artists</p><p className="item">{level.artists}</p></span>
        <span><p className="label">Charter</p><p className="item">{level.author}</p></span>
        <span><p className="label">Level</p><p className="item">{level.rating}</p></span>
      </div>
      <div className="media-container">
        {coverUrl && <img className="level-detail-img" src={coverUrl} alt={level.title} />}
        {bgmUrl && (
          <audio controls>
            <source src={bgmUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    </main>
  );
}
