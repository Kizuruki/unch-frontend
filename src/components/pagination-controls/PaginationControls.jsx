import './PaginationControls.css';

export default function PaginationControls({ 
  pageCount, 
  currentPage, 
  posts, 
  onPageChange 
}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="pagination-card">
      <div className="pagination-info">
        <p>Page {currentPage + 1} of {pageCount} • Showing {posts.length} charts</p>
      </div>
      <div className="pagination-controls">
        <button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 0}
        >
          Previous
        </button>
        
        <div className="pagination-numbers">
          {Array.from({ length: pageCount }, (_, i) => i).map((pageNum) => (
            <button
              key={pageNum}
              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum + 1}
            </button>
          ))}
        </div>
        
        <button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
