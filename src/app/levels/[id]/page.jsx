"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";

const APILink = process.env.NEXT_PUBLIC_API_URL;

export default function LevelPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState(null);
  const sonolusServerUrl = process.env.NEXT_PUBLIC_SONOLUS_SERVER_URL;

  useEffect(() => {
    if (!id) return;

    const validId = /^UnCh-[a-zA-Z0-9]{32}$/.test(id);
    setIsValid(validId);

    if (!validId) {
      setTimeout(() => router.push("/"), 500);
      setLoading(false);
      return;
    }

    const cleanId = id.replace(/^UnCh-/, "");
    const controller = new AbortController();

    async function fetchLevel() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${APILink}/api/charts/${cleanId}/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const json = await res.json();
        const data = json.data;
        const base = json.asset_base_url;

        const buildAssetUrl = (hash) =>
          hash && base && data.author
            ? `${base}/${data.author}/${data.id}/${hash}`
            : null;

        const normalized = {
          title: data.title || "Untitled Level",
          description: data.description || "No description provided.",
          thumbnail: buildAssetUrl(data.jacket_file_hash),
          audio: buildAssetUrl(data.music_file_hash),
          chart: buildAssetUrl(data.chart_file_hash),
          background: buildAssetUrl(
            data.background_v3_file_hash || data.background_v1_file_hash
          ),
          author: data.author_full || data.author || "Unknown",
          rating: data.rating || 0,
          tags: data.tags || [],
        };

        setLevel(normalized);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLevel(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLevel();
    return () => controller.abort();
  }, [id, router]);

  const handleGoBack = () => router.back();

  const getSonolusLink = () => {
    if (!sonolusServerUrl || !isValid) return "";
    const serverWithoutSchema = sonolusServerUrl.replace(/^https?:\/\//, "");
    return `https://open.sonolus.com/${serverWithoutSchema}/levels/${id}`;
  };

  const handleCopyEmbed = async () => {
    if (!level) return;
    const embedMarkdown = `**${level.title}**\n\n${level.description}\n\n![thumbnail](${level.thumbnail || ""})`;
    try {
      await navigator.clipboard.writeText(embedMarkdown);
      alert("Embed markdown copied to clipboard");
    } catch (e) {
      alert("Failed to copy: " + e.message);
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(getSonolusLink() || window.location.href);
    const text = encodeURIComponent(
      `${level?.title ?? "Level"} — ${level?.description ? level.description.slice(0, 120) : "Play this level"}`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <main style={{ padding: 20 }}>
      {level && (
        <Head>
          <title>{`[${level.rating}] ${level.title}`}</title>
          <meta property="og:title" content={`[${level.rating}] ${level.title}`} />
          <meta property="og:description" content={level.description} />
          {level.thumbnail && <meta property="og:image" content={level.thumbnail} />}
        </Head>
      )}

      <div className="level-container" style={{ maxWidth: 900, margin: "0 auto" }}>
        {loading ? (
          <p>Loading...</p>
        ) : !isValid ? (
          <p>Invalid ID — redirecting...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : level ? (
          <>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 120, height: 120, borderRadius: 8, overflow: "hidden", background: "#111" }}>
                {level.thumbnail ? (
                  <img src={level.thumbnail} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>No Image</div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ borderRadius: 8, border: "1px solid #2f3136", background: "#2b2d31", padding: 12, color: "#e6edf3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>{`[${level.rating}] ${level.title}`}</h2>
                    <div style={{ fontSize: 12, color: "#b9bbbe" }}>by {level.author}</div>
                  </div>

                  <p style={{ marginTop: 8, marginBottom: 8, color: "#cfd6da" }}>{level.description}</p>

                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => window.open(getSonolusLink(), "_blank")} style={{ background: "#5865f2", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", color: "white" }}>Open in Sonolus</button>
                    <button onClick={handleCopyEmbed} style={{ background: "transparent", border: "1px solid #4b4f56", padding: "8px 12px", borderRadius: 6, cursor: "pointer", color: "white" }}>Copy Embed</button>
                    <button onClick={handleShareTwitter} style={{ background: "#1da1f2", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", color: "white" }}>Share on Twitter</button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <button onClick={handleGoBack} style={{ background: "#222", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", color: "white" }}>Go Back</button>
            </div>
          </>
        ) : (
          <p>No level data found.</p>
        )}
      </div>
    </main>
  );
}