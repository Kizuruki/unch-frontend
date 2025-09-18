"use client";
import "./ChartModal.css";

export default function ChartModal({ 
  isOpen, 
  mode, 
  form, 
  onClose, 
  onSubmit, 
  onUpdate 
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
            {/* placeholder  */}
            <div style={{ padding: 16, opacity: 0.7 }}>Upload form goes here… eventually</div>
          </div>
        </div>
      </div>
    </div>
  );
}
