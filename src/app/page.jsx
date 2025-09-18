"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import "./page.css"
import Link from "next/link";
import tempData from "./temp-data/levels.json"
import dotenv from "dotenv";
import ChartsList from "../components/charts-list/ChartsList";
import PaginationControls from "../components/pagination-controls/PaginationControls";
import { useUser } from "../contexts/UserContext";


export default function Home() {
  const { sonolusUser, session, isSessionValid, clearExpiredSession } = useUser();
  
  // Unified section state
  const [sectionMode, setSectionMode] = useState("myCharts"); // "myCharts" or "search"
  
  // Search parameters
  const [searchType, setSearchType] = useState("random");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Advanced search parameters
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [tags, setTags] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [maxLikes, setMaxLikes] = useState("");
  const [likedBy, setLikedBy] = useState(false);
  const [titleIncludes, setTitleIncludes] = useState("");
  const [descriptionIncludes, setDescriptionIncludes] = useState("");
  const [artistsIncludes, setArtistsIncludes] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("PUBLIC");
  const [metaIncludes, setMetaIncludes] = useState("");

  // Unified posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Audio state management
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});

  const handleSearch = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
      
      // Build query parameters based on search type
      const params = new URLSearchParams();
      params.append('type', searchType);
      params.append('page', page.toString());
      
      if (searchType === 'quick') {
        // For quick search, only meta_includes, sort_by, and sort_order take effect
        if (metaIncludes) params.append('meta_includes', metaIncludes);
        params.append('sort_by', sortBy);
        params.append('sort_order', sortOrder);
      } else if (searchType === 'advanced') {
        // For advanced search, all parameters take effect
        if (minRating) params.append('min_rating', minRating);
        if (maxRating) params.append('max_rating', maxRating);
        if (tags) params.append('tags', tags);
        if (minLikes) params.append('min_likes', minLikes);
        if (maxLikes) params.append('max_likes', maxLikes);
        if (likedBy) params.append('liked_by', 'true');
        if (titleIncludes) params.append('title_includes', titleIncludes);
        if (descriptionIncludes) params.append('description_includes', descriptionIncludes);
        if (artistsIncludes) params.append('artists_includes', artistsIncludes);
        params.append('sort_by', sortBy);
        params.append('sort_order', sortOrder);
        params.append('status', status);
        if (metaIncludes) params.append('meta_includes', metaIncludes);
      }
      
      const res = await fetch(`${apiUrl}/api/charts?${params.toString()}`);
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();

      const BASE = data.asset_base_url || `${apiUrl}`;
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
      setCurrentPage(page);
      
      // Set pagination info (only for quick and advanced, not random)
      if (searchType !== 'random') {
        setPageCount(data.pageCount || 0);
      } else {
        setPageCount(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }  
  };

  const handleMyCharts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const APILink = process.env.NEXT_PUBLIC_API_URL;
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

  // Unified function to handle both modes
  const handleModeChange = (mode) => {
    setSectionMode(mode);
    if (mode === "myCharts") {
      handleMyCharts(0);
    } else if (mode === "search") {
      handleSearch(0);
    }
  };

  // Unified pagination handler
  const handlePageChange = (page) => {
    if (sectionMode === "myCharts") {
      handleMyCharts(page);
    } else if (sectionMode === "search") {
      handleSearch(page);
    }
  };

  useEffect(() => {
    handleMyCharts(); // Start with MyCharts by default
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <div className="dashboard-container">
        <div className="my-charts">
          <div className="upload-section">
            <div className="mode-selector">
              <button 
                className={`mode-btn ${sectionMode === 'myCharts' ? 'active' : ''}`}
                onClick={() => handleModeChange('myCharts')}
              >
                All Charts
              </button>
              <button 
                className={`mode-btn ${sectionMode === 'search' ? 'active' : ''}`}
                onClick={() => handleModeChange('search')}
              >
                Search Charts
              </button>
            </div>
          </div>

          {/* Search Controls - Only show when in search mode */}
          {sectionMode === 'search' && (
            <div className="search-controls-container">
              <div className="search-controls">
                {/* Search Type */}
                <div className="search-type-group">
                  <label>Search Type:</label>
                  <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="random">Random</option>
                    <option value="quick">Quick</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Quick Search Fields */}
                {(searchType === 'quick' || searchType === 'advanced') && (
                  <>
                    <div className="search-field">
                      <label>Keywords (meta_includes):</label>
                      <input
                        type="text"
                        value={metaIncludes}
                        onChange={(e) => setMetaIncludes(e.target.value)}
                        placeholder="Search in metadata..."
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Sort By:</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="created_at">Created Date</option>
                        <option value="rating">Rating</option>
                        <option value="likes">Likes</option>
                        <option value="decaying_likes">Decaying Likes</option>
                        <option value="abc">Alphabetical</option>
                      </select>
                    </div>
                    
                    <div className="search-field">
                      <label>Sort Order:</label>
                      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Advanced Search Fields */}
                {searchType === 'advanced' && (
                  <>
                    <div className="search-field">
                      <label>Min Rating:</label>
                      <input
                        type="number"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        placeholder="Minimum level"
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Max Rating:</label>
                      <input
                        type="number"
                        value={maxRating}
                        onChange={(e) => setMaxRating(e.target.value)}
                        placeholder="Maximum level"
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Tags:</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Comma-separated tags"
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Min Likes:</label>
                      <input
                        type="number"
                        value={minLikes}
                        onChange={(e) => setMinLikes(e.target.value)}
                        placeholder="Minimum likes"
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Max Likes:</label>
                      <input
                        type="number"
                        value={maxLikes}
                        onChange={(e) => setMaxLikes(e.target.value)}
                        placeholder="Maximum likes"
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>
                        <input
                          type="checkbox"
                          checked={likedBy}
                          onChange={(e) => setLikedBy(e.target.checked)}
                        />
                        Liked by me
                      </label>
                    </div>
                    
                    <div className="search-field">
                      <label>Title Includes:</label>
                      <input
                        type="text"
                        value={titleIncludes}
                        onChange={(e) => setTitleIncludes(e.target.value)}
                        placeholder="Search in titles..."
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Description Includes:</label>
                      <input
                        type="text"
                        value={descriptionIncludes}
                        onChange={(e) => setDescriptionIncludes(e.target.value)}
                        placeholder="Search in descriptions..."
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Artists Includes:</label>
                      <input
                        type="text"
                        value={artistsIncludes}
                        onChange={(e) => setArtistsIncludes(e.target.value)}
                        placeholder="Search in artists..."
                      />
                    </div>
                    
                    <div className="search-field">
                      <label>Status:</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="PUBLIC">Public</option>
                        <option value="UNLISTED">Unlisted</option>
                        <option value="PRIVATE">Private</option>
                        <option value="ALL">All</option>
                      </select>
                    </div>
                  </>
                )}

                <button className="search-btn" onClick={() => handleSearch(0)}>
                  Search
                </button>
              </div>
            </div>
          )}

          <div className="charts-section">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <ChartsList
                posts={posts}
                loading={loading}
                currentlyPlaying={currentlyPlaying}
                audioRefs={audioRefs.current}
                onPlay={handlePlay}
                onStop={handleStop}
                onAudioRef={handleAudioRef}
                onEdit={() => {}} // No edit functionality on home page
                sonolusUser={sonolusUser}
              />
            )}
          </div>
        </div>
        
        {/* Unified Pagination */}
        {pageCount > 1 && (
          <PaginationControls
            pageCount={pageCount}
            currentPage={currentPage}
            posts={posts}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
