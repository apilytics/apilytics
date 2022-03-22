import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pages: number;
}

export const Pagination: React.FC<Props> = ({ page, setPage, pages }) => (
  <div className="btn-group">
    {page > 0 && (
      <button className="btn" onClick={(): void => setPage(0)}>
        {1}
      </button>
    )}
    {page > 2 && <button className="btn-disabled btn">...</button>}
    {page > 1 && (
      <button className="btn" onClick={(): void => setPage(page - 1)}>
        {page}
      </button>
    )}
    <button className="btn btn-active">{page + 1}</button>
    {page < pages - 2 && (
      <button className="btn" onClick={(): void => setPage(page + 1)}>
        {page + 2}
      </button>
    )}
    {page < pages - 3 && <button className="btn-disabled btn">...</button>}
    {page < pages - 1 && (
      <button className="btn" onClick={(): void => setPage(pages - 1)}>
        {pages}
      </button>
    )}
  </div>
);
