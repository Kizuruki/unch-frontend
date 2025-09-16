"use client";
import "./page.css";
import { useState, useEffect } from "react";
import Link from "next/link";

const APILink = process.env.NEXT_PUBLIC_LEVELAPI;

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); 

  const [form, setForm] = useState({
    title: "",
    artists: "",
    author: "",
    rating: "",
    description: "",
    tags: "",
    jacket: null,
    bgm: null,
    chart: null,
  });

  const handleMyCharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${APILink}/sonolus/levels/list/`
      );
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();

      const BASE = `${APILink}`;
      const items = Array.isArray(data?.items) ? data.items : [];

      const normalized = items.map((item) => ({
        id: item.name,
        title: item.title,
        artists: item.artists,
        author: item.author,
        rating: item.rating,
        coverUrl: item.cover ? BASE + item.cover.url : "",
        bgmUrl: item.bgm ? BASE + item.bgm.url : "",
      }));

      setPosts(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleMyCharts();
  }, []);

  const openUpload = () => {
    setMode("upload");
    setForm({
        title: "",
        artists: "",
        author: "",
        rating: "",
        description: "",
        tags: "",
        jacket: null,
        bgm: null,
        chart: null,
    });
    setIsOpen(true);
  };

  const openEdit = (post) => {
    setMode("edit");
    setForm((f) => ({
        ...f,
        title: post.title,
        artists: post.artists,
        author: post.author,
        rating: String(post.rating ?? ""),
        description: "",
        tags: "",
        jacket: null,
        bgm: null,
        chart: null,
    }));
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    setMode(null);
  };

  const update = (key) => (e) => {
    const value =
    e.target.type === "file" ? e.target.files?.[0] ?? null : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value}));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // get API from yum
    console.log("Submit", mode, form);
  };

  if (loading) return <main><p>Loading...</p></main>;
  if (error) return <main><p>Error: {error}</p></main>

  return (
    <main>
      <div className="dashboard-container">
        <div className="my-charts">
          <div className="upload-section">
            <h2>My Charts</h2>
            <button className="upload-btn" type="button" onClick={openUpload}>Upload New Level</button>
          </div>
          <div className="charts-section">
            <ul className="songlist">
              {posts.map((post) => (
                <li key={post.id} className="dashboard-li">
                  <Link
                    href={`/levels/${encodeURIComponent(post.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="dashboard-img"
                      src={post.coverUrl}
                      alt={post.title}
                    />
                  </Link>
                  <div className="song-info">
                    <span className="song-title-dashboard">
                      {post.title.length > 25
                        ? post.title.substring(0, 25) + "..."
                        : post.title}
                    </span>
                    <span className="rating-dashboard">Lv.{post.rating}</span>
                    <button className="edit-btn" type="button" onClick={() => openEdit(post)}>Edit</button>
                    <button className="delete-btn" type="button">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`edit-container ${isOpen ? "open" : ""}`} hidden={!isOpen}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
            <strong>{mode === "edit" ? "Edit data" : "Upload New Level"}</strong>
            <button type="button" onClick={closePanel} aria-label="Close">✕</button>
          </div>
          <div className="meta-form" hidden={mode !== "edit"}>
            <form onSubmit={onSubmit}>
              <label className="label-title" htmlFor="title">Song title:</label>
              <input id="title" className="input-title" type="text" value={form.title} onChange={update("title")} />

              <label className="label-artist" htmlFor="artists">Artist(s):</label>
              <input id="artists" className="input-artist" type="text" value={form.artists} onChange={update("artists")} />

              <label className="label-charter" htmlFor="author">Chart Designer:</label>
              <input id="author" className="input-charter" type="text" value={form.author} onChange={update("author")} />

              <label className="label-rating" htmlFor="rating">Lv:</label>
              <input id="rating" className="input-rating" type="number" inputMode="numeric" value={form.rating} onChange={update("rating")} />

              <label className="label-description" htmlFor="description">Description:</label>
              <input id="description" className="input-description" type="text" value={form.description} onChange={update("description")} />

              <label className="label-tags" htmlFor="tags">Tags:</label>
              <input id="tags" className="input-tags" type="text" value={form.tags} onChange={update("tags")} />

              <label className="label-jacket" htmlFor="jacket">Cover Image (png, jpg, jpeg):</label>
              <input id="jacket" className="input-jacket" type="file" accept="image/*" onChange={update("jacket")} />

              <label className="label-bgm" htmlFor="bgm">Audio:</label>
              <input id="bgm" className="input-bgm" type="file" accept="audio/*" onChange={update("bgm")} />

              <label className="label-chart" htmlFor="chart">Chart (.SUS or .USC):</label>
              <input id="chart" className="input-chart" type="file" accept=".sus,.usc" onChange={update("chart")} />

              <button className="edit-save-btn" type="submit">Save</button>
            </form>
          </div>
          <div className="upload-form" hidden={mode !== "upload"}>
            {/* placeholder  */}
            <div style={{ padding: 16, opacity: 0.7 }}>Upload form goes here… eventually</div>
          </div>
        </div>
      </div>
    </main>
  );
}
