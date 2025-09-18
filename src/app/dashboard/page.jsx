"use client";
import "./page.css";
import { useState, useEffect, useRef, useCallback } from "react";
import ChartsList from "../../components/charts-list/ChartsList";
import PaginationControls from "../../components/pagination-controls/PaginationControls";
import ChartModal from "../../components/chart-modal/ChartModal";
import { useUser } from "../../contexts/UserContext";

const APILink = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const { sonolusUser, session, isSessionValid, clearExpiredSession } = useUser();
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
    preview: null,
    background: null,
  });

  const handleMyCharts = async (page = 0) => {
    setLoading(true);
    setError(null);
    
    // Check if session is still valid before making API call
    if (!isSessionValid()) {
      console.log('Session expired, clearing data');
      clearExpiredSession();
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(
        `${APILink}/api/charts?page=${page}&type=advanced&status=ALL`, {
          headers: {
            "Authorization": `${session}`
          }
        }
      );
      
      // Check if the API call failed due to expired session
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.log('API call failed due to expired session');
          clearExpiredSession();
          setLoading(false);
          return;
        }
        throw new Error(`Network error: ${res.status}`);
      }
      
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
        backgroundUrl: item.background_file_hash ? `${BASE}/${item.author}/${item.id}/${item.background_file_hash}` : "",
        chartUrl: item.chart_file_hash ? `${BASE}/${item.author}/${item.id}/${item.chart_file_hash}` : "",
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
        preview: null,
        background: null,
    });
    setError(null); // Clear any previous errors
    setIsOpen(true);
  };

  const openEdit = (post) => {
    setMode("edit");
    setForm({
        title: post.title,
        artists: post.artists,
        author: post.author,
        rating: String(post.rating ?? ""),
        description: post.description || "",
        tags: post.tags || "",
        jacket: null,
        bgm: null,
        chart: null,
        preview: null,
        background: null,
    });
    setError(null); // Clear any previous errors
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    setMode(null);
    setError(null); // Clear any errors when closing
    // Reset form to clean state
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
      preview: null,
      background: null,
    });
  };

  const update = (key) => (e) => {
    const value =
    e.target.type === "file" ? e.target.files?.[0] ?? null : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value}));
    // Clear any errors when user starts interacting with the form
    if (error) {
      setError(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === "upload") {
      await handleUpload();
    } else if (mode === "edit") {
      // TODO: Implement edit functionality
      console.log("Edit mode not implemented yet", form);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if session is still valid
      if (!isSessionValid()) {
        console.log('Session expired, clearing data');
        clearExpiredSession();
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!form.title || !form.artists || !form.author || !form.rating || !form.chart || !form.bgm || !form.jacket) {
        setError("Please fill in all required fields and upload all required files.");
        setLoading(false);
        return;
      }

      // Prepare chart data
      const chartData = {
        rating: parseInt(form.rating),
        title: form.title,
        artists: form.artists,
        author: form.author,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [],
        includes_background: !!form.background,
        includes_preview: !!form.preview,
      };

      // Add description if provided
      if (form.description) {
        chartData.description = form.description;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('data', JSON.stringify(chartData));

      // Add required files
      formData.append('jacket_image', form.jacket);
      formData.append('chart_file', form.chart);
      formData.append('audio_file', form.bgm);

      // Add optional files
      if (form.preview) {
        formData.append('preview_file', form.preview);
      }
      if (form.background) {
        formData.append('background_image', form.background);
      }

      // Make the upload request
      const response = await fetch(`${APILink}/api/charts/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': session
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Upload failed due to expired session');
          clearExpiredSession();
          setLoading(false);
          return;
        }
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      // Close modal, clear form, and refresh chart list
      setIsOpen(false);
      setMode(null);
      setError(null);
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
        preview: null,
        background: null,
      });
      await handleMyCharts(currentPage);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              {error && (
                <div style={{ 
                  backgroundColor: '#fee', 
                  color: '#c00', 
                  padding: '10px', 
                  margin: '10px', 
                  borderRadius: '5px',
                  border: '1px solid #fcc'
                }}>
                  {error}
                </div>
              )}
      <div className="dashboard-container">
        <div className="my-charts">
          <div className="upload-section">
            <h2>My Charts</h2>
            <button 
              className="upload-btn" 
              type="button" 
              onClick={openUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload New Level"}
            </button>
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
              sonolusUser={sonolusUser}
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
                  loading={loading}
                />
      </div>
    </main>
  );
}
