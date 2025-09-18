"use client";
import "./page.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import AudioControls from "./AudioControls";
import AudioVisualizer from "./AudioVisualizer";

const APILink = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null);
  
  // Audio state management
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});

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

  const handleMyCharts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${APILink}/api/charts?page=${page}&type=quick`
      );
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();

      const BASE = data.asset_base_url || `${APILink}`;
      const items = Array.isArray(data?.data) ? data.data : [];

      const normalized = items.map((item) => ({
        id: item.id,
        title: item.title,
        artists: item.artists,
        author: item.author_full || item.author,
        rating: item.rating,
        description: item.description,
        tags: item.tags,
        coverUrl: item.jacket_file_hash ? `${BASE}/${item.author}/${item.id}/${item.jacket_file_hash}` : "",
        bgmUrl: item.music_file_hash ? `${BASE}/${item.author}/${item.id}/${item.music_file_hash}` : "",
        likeCount: item.like_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      console.log(normalized);

      setPosts(normalized);
      setPageCount(data.pageCount || 0);
      setTotalCount(data.data?.[0]?.total_count || 0);
      setCurrentPage(page);
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

  // Audio control functions
  const handlePlay = (postId) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== postId) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }
    
    setCurrentlyPlaying(postId);
  };

  const handleStop = (postId) => {
    if (currentlyPlaying === postId) {
      setCurrentlyPlaying(null);
    }
  };

  const handleAudioRef = useCallback((postId, audioElement) => {
    audioRefs.current[postId] = audioElement;
  }, []);




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
            {loading ? (
              <div className="loading-container">
                <p>Loading charts...</p>
              </div>
            ) : (
              <ul className="songlist">
                {posts.map((post) => (
                <li 
                  key={post.id} 
                  className="dashboard-li"
                >
                  <Link
                    href={`/levels?id=${encodeURIComponent(post.id)}`}
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
                  <Link
                    href={`/levels?id=${encodeURIComponent(post.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="song-title-dashboard">
                      {post.title.length > 25
                        ? post.title.substring(0, 25) + "..."
                        : post.title}
                    </span>
                  </Link>
                    <span className="song-artist-dashboard">
                      {post.artists.length > 30
                        ? post.artists.substring(0, 30) + "..."
                        : post.artists}
                    </span>
                    <span className="rating-dashboard">Lv.{post.rating}</span>
                    <span className="author-dashboard">by {post.author}</span>
                    
                    {/* Audio Components */}
                    <div className="audio-section">
                      <AudioControls
                        bgmUrl={post.bgmUrl}
                        onPlay={() => handlePlay(post.id)}
                        onStop={() => handleStop(post.id)}
                        isPlaying={currentlyPlaying === post.id}
                        isActive={currentlyPlaying === post.id}
                        audioRef={(ref) => handleAudioRef(post.id, ref)}
                      />
                      {currentlyPlaying === post.id && (
                        <AudioVisualizer
                          audioRef={audioRefs.current[post.id]}
                          isPlaying={currentlyPlaying === post.id}
                        />
                      )}
                    </div>
                    
                    <div className="chart-actions">
                      <button className="edit-btn" type="button" onClick={() => openEdit(post)} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button className="delete-btn" type="button" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Pagination Card - Separate at bottom */}
        {pageCount > 1 && (
          <div className="pagination-card">
            <div className="pagination-info">
              <p>Page {currentPage + 1} of {pageCount} • Showing {posts.length} charts</p>
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => handleMyCharts(currentPage - 1)}
                disabled={currentPage <= 0}
              >
                Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: pageCount }, (_, i) => i).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handleMyCharts(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => handleMyCharts(currentPage + 1)}
                disabled={currentPage >= pageCount - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
