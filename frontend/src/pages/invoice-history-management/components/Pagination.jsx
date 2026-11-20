import React from 'react';

import Button from '../../../components/ui/Button';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  totalItems = 0, 
  itemsPerPage = 10, 
  onPageChange,
  onItemsPerPageChange 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const itemsPerPageOptions = [10, 25, 50, 100];

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-surface border border-border rounded-lg">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-border rounded text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-text-secondary">per page</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-text-secondary">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronLeft"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-text-muted hover:text-primary disabled:opacity-50"
          title="Previous page"
        />

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 py-1 text-text-muted">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] ${
                  currentPage === page 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronRight"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-text-muted hover:text-primary disabled:opacity-50"
          title="Next page"
        />
      </div>
    </div>
  );
};

export default Pagination;