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
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{mode === "edit" ? "Edit data" : "Upload New Level"}</strong>
          <button type="button" onClick={onClose} aria-label="Close" className="close-btn">✕</button>
        </div>
        <div className="modal-content">
          <div className="meta-form" hidden={mode !== "edit"}>
            <form onSubmit={onSubmit}>
              <label className="label-title" htmlFor="title">Song title:</label>
              <input 
                id="title" 
                className="input-title" 
                type="text" 
                value={form.title} 
                onChange={onUpdate("title")} 
              />

              <label className="label-artist" htmlFor="artists">Artist(s):</label>
              <input 
                id="artists" 
                className="input-artist" 
                type="text" 
                value={form.artists} 
                onChange={onUpdate("artists")} 
              />

              <label className="label-charter" htmlFor="author">Chart Designer:</label>
              <input 
                id="author" 
                className="input-charter" 
                type="text" 
                value={form.author} 
                onChange={onUpdate("author")} 
              />

              <label className="label-rating" htmlFor="rating">Lv:</label>
              <input 
                id="rating" 
                className="input-rating" 
                type="number" 
                inputMode="numeric" 
                value={form.rating} 
                onChange={onUpdate("rating")} 
              />

              <label className="label-description" htmlFor="description">Description:</label>
              <input 
                id="description" 
                className="input-description" 
                type="text" 
                value={form.description} 
                onChange={onUpdate("description")} 
              />

              <label className="label-tags" htmlFor="tags">Tags:</label>
              <input 
                id="tags" 
                className="input-tags" 
                type="text" 
                value={form.tags} 
                onChange={onUpdate("tags")} 
              />

              <label className="label-jacket" htmlFor="jacket">Cover Image (png, jpg, jpeg):</label>
              <input 
                id="jacket" 
                className="input-jacket" 
                type="file" 
                accept="image/*" 
                onChange={onUpdate("jacket")} 
              />

              <label className="label-bgm" htmlFor="bgm">Audio:</label>
              <input 
                id="bgm" 
                className="input-bgm" 
                type="file" 
                accept="audio/*" 
                onChange={onUpdate("bgm")} 
              />

              <label className="label-chart" htmlFor="chart">Chart (.SUS or .USC):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                accept=".sus,.usc" 
                onChange={onUpdate("chart")} 
              />

              <button className="edit-save-btn" type="submit">Save</button>
            </form>
          </div>
          <div className="upload-form" hidden={mode !== "upload"}>
            <form onSubmit={onSubmit}>
              <label className="label-title" htmlFor="title">Song title:</label>
              <input 
                id="title" 
                className="input-title" 
                type="text" 
                value={form.title} 
                onChange={onUpdate("title")} 
                required
              />

              <label className="label-artist" htmlFor="artists">Artist(s):</label>
              <input 
                id="artists" 
                className="input-artist" 
                type="text" 
                value={form.artists} 
                onChange={onUpdate("artists")} 
                required
              />

              <label className="label-charter" htmlFor="author">Chart Designer:</label>
              <input 
                id="author" 
                className="input-charter" 
                type="text" 
                value={form.author} 
                onChange={onUpdate("author")} 
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
                min="1"
                max="20"
                required
              />

              <label className="label-description" htmlFor="description">Description:</label>
              <textarea 
                id="description" 
                className="input-description" 
                value={form.description} 
                onChange={onUpdate("description")} 
                rows="3"
                placeholder="Optional description..."
              />

              <label className="label-tags" htmlFor="tags">Tags:</label>
              <input 
                id="tags" 
                className="input-tags" 
                type="text" 
                value={form.tags} 
                onChange={onUpdate("tags")} 
                placeholder="Comma-separated tags (e.g., test, original)"
              />

              <label className="label-jacket" htmlFor="jacket">Cover Image (png, jpg, jpeg):</label>
              <input 
                id="jacket" 
                className="input-jacket" 
                type="file" 
                accept="image/*" 
                onChange={onUpdate("jacket")} 
                required
              />

              <label className="label-bgm" htmlFor="bgm">Audio File (mp3, wav, ogg):</label>
              <input 
                id="bgm" 
                className="input-bgm" 
                type="file" 
                accept="audio/*" 
                onChange={onUpdate("bgm")} 
                required
              />

              <label className="label-chart" htmlFor="chart">Chart File (.SUS or .USC):</label>
              <input 
                id="chart" 
                className="input-chart" 
                type="file" 
                accept=".sus,.usc" 
                onChange={onUpdate("chart")} 
                required
              />

              <label className="label-preview" htmlFor="preview">Preview Audio (optional):</label>
              <input 
                id="preview" 
                className="input-preview" 
                type="file" 
                accept="audio/*" 
                onChange={onUpdate("preview")} 
              />

              <label className="label-background" htmlFor="background">Background Image (optional):</label>
              <input 
                id="background" 
                className="input-background" 
                type="file" 
                accept="image/*" 
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
