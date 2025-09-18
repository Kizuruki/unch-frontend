"use client";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import AudioControls from "../audio-control/AudioControls";
import AudioVisualizer from "../audio-visualizer/AudioVisualizer";
import "./ChartsList.css";

export default function ChartsList({ 
  posts, 
  loading, 
  currentlyPlaying, 
  audioRefs,
  onPlay, 
  onStop, 
  onAudioRef, 
  onEdit 
}) {
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading charts...</p>
      </div>
    );
  }

  return (
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
            <span className="song-title-dashboard">
              {post.title.length > 25
                ? post.title.substring(0, 25) + "..."
                : post.title}
            </span>
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
                onPlay={() => onPlay(post.id)}
                onStop={() => onStop(post.id)}
                isPlaying={currentlyPlaying === post.id}
                isActive={currentlyPlaying === post.id}
                audioRef={(ref) => onAudioRef(post.id, ref)}
              />
              {currentlyPlaying === post.id && (
                <AudioVisualizer
                  audioRef={audioRefs[post.id]}
                  isPlaying={currentlyPlaying === post.id}
                />
              )}
            </div>
            
            <div className="chart-actions">
              <button className="edit-btn" type="button" onClick={() => onEdit(post)} title="Edit">
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
  );
}
