"use client";
import "./page.css";
import { useState, useEffect, useRef, useCallback } from "react";
import ChartsList from "../../components/charts-list/ChartsList";
import PaginationControls from "../../components/pagination-controls/PaginationControls";
import ChartModal from "../../components/chart-modal/ChartModal";

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
            <ChartsList
              posts={posts}
              loading={loading}
              currentlyPlaying={currentlyPlaying}
              audioRefs={audioRefs.current}
              onPlay={handlePlay}
              onStop={handleStop}
              onAudioRef={handleAudioRef}
              onEdit={openEdit}
            />
          </div>
        </div>
        
        <PaginationControls
          pageCount={pageCount}
          currentPage={currentPage}
          posts={posts}
          onPageChange={handleMyCharts}
        />
        <ChartModal
          isOpen={isOpen}
          mode={mode}
          form={form}
          onClose={closePanel}
          onSubmit={onSubmit}
          onUpdate={update}
        />
      </div>
    </main>
  );
}
