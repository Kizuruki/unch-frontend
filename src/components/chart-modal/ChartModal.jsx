"use client";
import { useState, useRef } from "react";
import "./ChartModal.css";
import AudioControls from "../audio-control/AudioControls";
import AudioVisualizer from "../audio-visualizer/AudioVisualizer";

export default function ChartModal({ 
  isOpen, 
  mode, 
  form, 
  onClose, 
  onSubmit, 
  onUpdate,
  loading = false,
  editData = null
}) {
  // Audio state for edit mode previews
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});

  const handlePlay = (audioId) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== audioId) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }
    setCurrentlyPlaying(audioId);
  };

  const handleStop = (audioId) => {
    setCurrentlyPlaying(null);
  };

  const handleAudioRef = (audioId, ref) => {
    audioRefs.current[audioId] = ref;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-container">
        <div className="modal-header">
          <strong>
            {mode === "edit" 
              ? (editData && editData.title ? `Edit: ${editData.title}` : "Edit Chart") 
              : "Upload New Level"
            }
          </strong>
          <button type="button" onClick={onClose} aria-label="Close" className="close-btn">✕</button>
        </div>
        <div className="modal-content">
          <div className="meta-form" hidden={mode !== "edit"}>
            <form onSubmit={onSubmit}>
              <label className="label-title" htmlFor="title">Song title (max 50 chars):</label>
              <input 
                id="title" 
                className="input-title" 
                type="text" 
                value={form.title} 
                onChange={onUpdate("title")} 
                maxLength={50}
              />

              <label className="label-artist" htmlFor="artists">Artist(s) (max 50 chars):</label>
              <input 
                id="artists" 
                className="input-artist" 
                type="text" 
                value={form.artists} 
                onChange={onUpdate("artists")} 
                maxLength={50}
              />

              <label className="label-charter" htmlFor="author">Chart Designer (max 20 chars):</label>
              <input 
                id="author" 
                className="input-charter" 
                type="text"
                value={form.author} 
                onChange={onUpdate("author")} 
                maxLength={20}
              />

              <label className="label-rating" htmlFor="rating">Lv:</label>
              <input 
                id="rating" 
                className="input-rating" 
                type="number" 
                inputMode="numeric" 
                max={99}
                min={0}
                value={form.rating} 
                onChange={onUpdate("rating")} 
              />

              <label className="label-description" htmlFor="description">Description (max 200 chars):</label>
              <input 
                id="description" 
                className="input-description" 
                type="text" 
                value={form.description} 
                onChange={onUpdate("description")} 
                maxLength={200}
              />

              <label className="label-tags" htmlFor="tags">Tags (max 3 tags, 10 chars each):</label>
              <input 
                id="tags" 
                className="input-tags" 
                type="text" 
                value={form.tags} 
                onChange={onUpdate("tags")} 
                placeholder="tag1, tag2, tag3"
              />

              <label className="label-jacket" htmlFor="jacket">Cover Image (png):</label>
              <input 
                id="jacket" 
                className="input-jacket" 
                type="file" 
                accept="image/png" 
                onChange={onUpdate("jacket")} 
              />
              {editData && editData.jacketUrl && !form.jacket && (
                <div className="file-preview">
                  <img src={editData.jacketUrl} alt="Current jacket" style={{maxWidth: '100px', maxHeight: '100px'}} />
                  <span>Current: {editData.jacketUrl.split('/').pop()}</span>
                </div>
              )}

              <label className="label-bgm" htmlFor="bgm">Audio:</label>
              <input 
                id="bgm" 
                className="input-bgm" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("bgm")} 
              />
              {editData && editData.bgmUrl && !form.bgm && (
                <div className="file-preview">
                  <span>Current: {editData.bgmUrl.split('/').pop()}</span>
                  <div className="audio-preview-container">
                    <AudioControls
                      bgmUrl={editData.bgmUrl}
                      onPlay={() => handlePlay('edit-bgm')}
                      onStop={() => handleStop('edit-bgm')}
                      isPlaying={currentlyPlaying === 'edit-bgm'}
                      isActive={currentlyPlaying === 'edit-bgm'}
                      audioRef={(ref) => handleAudioRef('edit-bgm', ref)}
                    />
                    {currentlyPlaying === 'edit-bgm' && (
                      <AudioVisualizer
                        audioRef={audioRefs.current['edit-bgm']}
                        isPlaying={currentlyPlaying === 'edit-bgm'}
                      />
                    )}
                  </div>
                </div>
              )}

              <label className="label-chart" htmlFor="chart">Chart (.SUS or .USC or w/o extension):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                onChange={onUpdate("chart")} 
              />
              {editData && editData.chartUrl && !form.chart && (
                <div className="file-preview">
                  <span>Current: {editData.chartUrl.split('/').pop()}</span>
                </div>
              )}

              <label className="label-preview" htmlFor="preview">Preview Audio (optional):</label>
              <input 
                id="preview" 
                className="input-preview" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("preview")} 
              />
              {editData && editData.previewUrl && !form.preview && (
                <div className="file-preview">
                  <span>Current: {editData.previewUrl.split('/').pop()}</span>
                  <div className="audio-preview-container">
                    <AudioControls
                      bgmUrl={editData.previewUrl}
                      onPlay={() => handlePlay('edit-preview')}
                      onStop={() => handleStop('edit-preview')}
                      isPlaying={currentlyPlaying === 'edit-preview'}
                      isActive={currentlyPlaying === 'edit-preview'}
                      audioRef={(ref) => handleAudioRef('edit-preview', ref)}
                    />
                    {currentlyPlaying === 'edit-preview' && (
                      <AudioVisualizer
                        audioRef={audioRefs.current['edit-preview']}
                        isPlaying={currentlyPlaying === 'edit-preview'}
                      />
                    )}
                  </div>
                </div>
              )}

              <label className="label-background" htmlFor="background">Background Image (optional):</label>
              <input 
                id="background" 
                className="input-background" 
                type="file" 
                accept="image/png" 
                onChange={onUpdate("background")} 
              />
              {editData && editData.backgroundUrl && editData.has_bg && !form.background && (
                <div className="file-preview">
                  <img src={editData.backgroundUrl} alt="Current background" style={{maxWidth: '200px', maxHeight: '100px', objectFit: 'cover'}} />
                  <span>Current: {editData.backgroundUrl.split('/').pop()}</span>
                </div>
              )}

              <button className="edit-save-btn" type="submit">Save</button>
            </form>
          </div>
          <div className="upload-form" hidden={mode !== "upload"}>
            <form onSubmit={onSubmit}>
              <label className="label-title" htmlFor="title">Song title (max 50 chars):</label>
              <input 
                id="title" 
                className="input-title" 
                type="text" 
                value={form.title} 
                onChange={onUpdate("title")} 
                maxLength={50}
                required
              />

              <label className="label-artist" htmlFor="artists">Artist(s) (max 50 chars):</label>
              <input 
                id="artists" 
                className="input-artist" 
                type="text" 
                value={form.artists} 
                onChange={onUpdate("artists")} 
                maxLength={50}
                required
              />

              <label className="label-charter" htmlFor="author">Chart Designer (max 20 chars):</label>
              <input 
                id="author" 
                className="input-charter" 
                type="text" 
                value={form.author} 
                onChange={onUpdate("author")} 
                maxLength={20}
                required
              />

              <label className="label-rating" htmlFor="rating">Level:</label>
              <input 
                id="rating" 
                className="input-rating" 
                type="number" 
                inputMode="numeric" 
                value={form.rating} 
                onChange={onUpdate("rating")} 
                min={0}
                max={99}
                required
              />

              <label className="label-description" htmlFor="description">Description (max 250 chars):</label>
              <textarea 
                id="description" 
                className="input-description" 
                value={form.description} 
                onChange={onUpdate("description")} 
                rows="3"
                maxLength={250}
                placeholder="Optional description..."
              />

              <label className="label-tags" htmlFor="tags">Tags (max 3 tags, 10 chars each):</label>
              <input 
                id="tags" 
                className="input-tags" 
                type="text" 
                value={form.tags} 
                onChange={onUpdate("tags")} 
                placeholder="tag1, tag2, tag3"
              />

              <label className="label-jacket" htmlFor="jacket">Cover Image (png):</label>
              <input 
                id="jacket" 
                className="input-jacket" 
                type="file" 
                accept="image/png" 
                onChange={onUpdate("jacket")} 
                required
              />

              <label className="label-bgm" htmlFor="bgm">Audio File (mp3):</label>
              <input 
                id="bgm" 
                className="input-bgm" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("bgm")} 
                required
              />

              <label className="label-chart" htmlFor="chart">Chart File (.SUS or .USC or LevelData):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                onChange={onUpdate("chart")} 
                required
              />

              <label className="label-preview" htmlFor="preview">Preview Audio (optional mp3):</label>
              <input 
                id="preview" 
                className="input-preview" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("preview")} 
              />

              <label className="label-background" htmlFor="background">Background Image (optional png):</label>
              <input 
                id="background" 
                className="input-background" 
                type="file" 
                accept="image/png" 
                onChange={onUpdate("background")} 
              />

              <button 
                className="upload-save-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Chart"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
