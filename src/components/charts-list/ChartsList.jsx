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
  onEdit,
  sonolusUser,
  onVisibilityChange,
  onDelete
}) {
  console.log(posts, sonolusUser);
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading charts...</p>
      </div>
    );
  }



  return (
    <ul className="songlist">
      {posts.map((post) => {
          const canSeeVisibilityChange = 
          (sonolusUser && sonolusUser.sonolus_id === post.authorId && post.status && onVisibilityChange) ||
          (sonolusUser && sonolusUser.mod === true);
        return <li
          key={post.id}
          className="dashboard-li"
          style={{
            backgroundImage: post.backgroundUrl
              ? `url(${post.backgroundUrl})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Link
            href={`/levels/UnCh-${encodeURIComponent(post.id)}`}
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
            <div className="chart-content">
              <div className="chart-data">
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
              </div>

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
            </div>

            <div className="metadata-section">
              <div className="chart-actions">
                {sonolusUser && sonolusUser.sonolus_id === post.authorId && (
                  <>
                    <button
                      className="edit-btn"
                      type="button"
                      onClick={() => onEdit(post)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button className="delete-btn" type="button" title="Delete" onClick={() => onDelete(post)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>

              <div className="chart-metadata">
                {post.status && (
                  <span
                    className={`metadata-item status status-${post.status.toLowerCase()}`}
                  >
                    {post.status === "PUBLIC" && "🌐"}
                    {post.status === "PRIVATE" && "🔒"}
                    {post.status === "UNLISTED" && "🔗"}
                    {post.status}
                  </span>
                )}
                {post.likeCount !== undefined && (
                  <span className="metadata-item likes">
                    ❤️ {post.likeCount}
                  </span>
                )}
                {post.createdAt && (
                  <span className="metadata-item created">
                    📅 {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                )}
                {post.updatedAt && (
                  <span className="metadata-item updated">
                    🔄 {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Visibility Toggle Button */}
              <div className="visibility-toggles">
                {canSeeVisibilityChange && post.status != "PUBLIC" && (
                  <ChartAction post={post} onVisibilityChange={onVisibilityChange} intent={"PUBLIC"}></ChartAction>
                )}
                {canSeeVisibilityChange && post.status != "PRIVATE" && (
                  <ChartAction post={post} onVisibilityChange={onVisibilityChange} intent={"PRIVATE"}></ChartAction>
                )}  
                {canSeeVisibilityChange && post.status != "UNLISTED" && (
                  <ChartAction post={post} onVisibilityChange={onVisibilityChange} intent={"UNLISTED"}></ChartAction>
                )}
              </div>
            </div>
          </div>
          </li>
        }
      )}
    </ul>
  );
}

function ChartAction({ post, onVisibilityChange, intent }) {
  return (
    <button
      className={`visibility-toggle-btn status-${intent.toLowerCase()}`}
      onClick={() => onVisibilityChange(post.id, post.status, intent)}
      title={`Change visibility (currently ${post.status})`}
    >
      <span className="visibility-icon">
        {intent === "PUBLIC" && "🌐"}
        {intent === "PRIVATE" && "🔒"}
        {intent === "UNLISTED" && "🔗"}
      </span>
      <span className="visibility-text">
        {intent === "PUBLIC" && "Make Public"}
        {intent === "PRIVATE" && "Make Private"}
        {intent === "UNLISTED" && "Make Unlisted"}
      </span>
    </button>
  );
}
