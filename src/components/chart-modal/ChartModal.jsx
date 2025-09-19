"use client";
import "./ChartModal.css";

export default function ChartModal({ 
  isOpen, 
  mode, 
  form, 
  onClose, 
  onSubmit, 
  onUpdate,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-container">
        <div className="modal-header">
          <strong>{mode === "edit" ? "Edit data" : "Upload New Level"}</strong>
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

              <label className="label-bgm" htmlFor="bgm">Audio:</label>
              <input 
                id="bgm" 
                className="input-bgm" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("bgm")} 
              />

              <label className="label-chart" htmlFor="chart">Chart (.SUS or .USC or w/o extension):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                onChange={onUpdate("chart")} 
              />

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

              <label className="label-description" htmlFor="description">Description (max 200 chars):</label>
              <textarea 
                id="description" 
                className="input-description" 
                value={form.description} 
                onChange={onUpdate("description")} 
                rows="3"
                maxLength={200}
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

              <label className="label-chart" htmlFor="chart">Chart File (.SUS or .USC or w/o extension):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                onChange={onUpdate("chart")} 
                required
              />

              <label className="label-preview" htmlFor="preview">Preview Audio (optional):</label>
              <input 
                id="preview" 
                className="input-preview" 
                type="file" 
                accept="audio/mp3" 
                onChange={onUpdate("preview")} 
              />

              <label className="label-background" htmlFor="background">Background Image (optional):</label>
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
