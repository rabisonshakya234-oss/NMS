import type { Pagination as PaginationData } from '@/types';

interface PaginationProps {
  pagination: PaginationData | null | undefined;
  onChange: (page: number) => void;
}

// pagination = { page, totalPages, total } as returned by the backend.
export default function Pagination({ pagination, onChange }: PaginationProps) {
  const { page, totalPages } = (pagination || {}) as PaginationData;
  if (!totalPages || totalPages < 2) return null;

  // Show a window of up to 5 page numbers around the current page.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className="mt-4">
      <ul className="pagination justify-content-center flex-wrap mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)} aria-label="Previous page">&laquo;</button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page + 1)} aria-label="Next page">&raquo;</button>
        </li>
      </ul>
    </nav>
  );
}
