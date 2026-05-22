import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Sentinel value used to represent an ellipsis gap in the page range. */
const ELLIPSIS = '…';

/**
 * Size-specific Tailwind classes for each button in the pagination bar.
 */
const sizeStyles = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
};

// ─── Page-range algorithm ────────────────────────────────────────────────────

/**
 * Builds the array of page numbers (and ellipsis sentinels) to display.
 *
 * Always includes:
 * - Page 1
 * - The last page (`totalPages`)
 * - The current page
 * - `siblingCount` pages either side of the current page
 *
 * Gaps of more than one page between visible numbers are replaced by ELLIPSIS.
 *
 * @param {number} currentPage  – 1-based active page
 * @param {number} totalPages   – total number of pages
 * @param {number} siblingCount – how many neighbours to show around current
 * @returns {Array<number|string>} e.g. [1, '…', 4, 5, 6, '…', 20]
 */
function buildPageRange(currentPage, totalPages, siblingCount) {
  // If total pages is small, just show all page numbers
  if (totalPages <= 7) {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  // Collect all pages that must always be visible into a Set (deduped).
  const required = new Set();
  required.add(1);
  required.add(totalPages);

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  for (let i = start; i <= end; i++) {
    required.add(i);
  }

  // Sort numerically and insert ellipsis where gaps exist.
  const sorted = [...required].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push(ELLIPSIS);
    }
    result.push(sorted[i]);
  }

  return result;
}

// ─── SVG icon helpers ────────────────────────────────────────────────────────

/** Single left-pointing chevron (Previous). */
const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

/** Single right-pointing chevron (Next). */
const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/** Double left-pointing chevron (First page). */
const ChevronDoubleLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
  </svg>
);

/** Double right-pointing chevron (Last page). */
const ChevronDoubleRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M6 5l7 7-7 7" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A fully-accessible page-navigation component.
 *
 * Renders Previous / Next arrows, optional First / Last buttons,
 * page number buttons with ellipsis gaps, and supports three sizes.
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  // Build the visible page range (memoised to avoid recalculating every render).
  const pages = useMemo(
    () => buildPageRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  /** Convenience booleans for the first / last page guard checks. */
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * Shared base classes applied to every button (page numbers, nav arrows, etc.).
   */
  const baseButtonClasses = [
    'inline-flex items-center justify-center',
    'rounded-lg border border-slate-200',
    'transition-colors duration-150',
    sizeStyles[size],
  ].join(' ');

  /**
   * Returns the full class string for a page-number or navigation button.
   *
   * @param {object}  opts
   * @param {boolean} opts.isActive   – whether this is the current page
   * @param {boolean} opts.isDisabled – whether the button should be disabled
   */
  const getButtonClasses = ({ isActive = false, isDisabled = false } = {}) => {
    const stateClasses = [];

    if (isActive) {
      stateClasses.push('bg-primary-600 text-white border-primary-600');
    } else {
      stateClasses.push('bg-white text-slate-700 hover:bg-primary-50');
    }

    if (isDisabled || disabled) {
      stateClasses.push('opacity-50 cursor-not-allowed');
    } else {
      stateClasses.push('cursor-pointer');
    }

    return [baseButtonClasses, ...stateClasses].join(' ');
  };

  /**
   * Click handler factory.
   * Returns a handler that invokes `onPageChange` unless the button is disabled.
   */
  const handlePageClick = (page) => () => {
    if (disabled) return;
    onPageChange?.(page);
  };

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`.trim()}>
      {/* ── First page button ─────────────────────────────────── */}
      {showFirstLast && (
        <button
          type="button"
          className={getButtonClasses({ isDisabled: isFirstPage })}
          onClick={handlePageClick(1)}
          disabled={isFirstPage || disabled}
          aria-label="Go to first page"
        >
          <ChevronDoubleLeft />
        </button>
      )}

      {/* ── Previous page button ──────────────────────────────── */}
      <button
        type="button"
        className={getButtonClasses({ isDisabled: isFirstPage })}
        onClick={handlePageClick(currentPage - 1)}
        disabled={isFirstPage || disabled}
        aria-label="Go to previous page"
      >
        <ChevronLeft />
      </button>

      {/* ── Page number buttons ───────────────────────────────── */}
      {pages.map((page, index) => {
        // Ellipsis – non-interactive placeholder
        if (page === ELLIPSIS) {
          return (
            <span
              key={`ellipsis-${index}`}
              className={`${baseButtonClasses} select-none text-slate-400`}
              data-testid="pagination-ellipsis"
              aria-hidden="true"
            >
              {ELLIPSIS}
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            className={getButtonClasses({ isActive })}
            onClick={handlePageClick(page)}
            disabled={disabled}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* ── Next page button ──────────────────────────────────── */}
      <button
        type="button"
        className={getButtonClasses({ isDisabled: isLastPage })}
        onClick={handlePageClick(currentPage + 1)}
        disabled={isLastPage || disabled}
        aria-label="Go to next page"
      >
        <ChevronRight />
      </button>

      {/* ── Last page button ──────────────────────────────────── */}
      {showFirstLast && (
        <button
          type="button"
          className={getButtonClasses({ isDisabled: isLastPage })}
          onClick={handlePageClick(totalPages)}
          disabled={isLastPage || disabled}
          aria-label="Go to last page"
        >
          <ChevronDoubleRight />
        </button>
      )}
    </nav>
  );
};

Pagination.displayName = 'Pagination';

// ─── PropTypes ───────────────────────────────────────────────────────────────

Pagination.propTypes = {
  /** The currently active page (1-based). */
  currentPage: PropTypes.number,
  /** Total number of pages. */
  totalPages: PropTypes.number,
  /** Callback fired when a page is selected. Receives the new page number. */
  onPageChange: PropTypes.func,
  /** Number of sibling page numbers to show on each side of the current page. */
  siblingCount: PropTypes.number,
  /** Whether to render First / Last (double-chevron) buttons. */
  showFirstLast: PropTypes.bool,
  /** Disables the entire pagination bar. */
  disabled: PropTypes.bool,
  /** Size preset controlling button dimensions and font size. */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Additional CSS classes merged onto the root `<nav>` element. */
  className: PropTypes.string,
};

Pagination.defaultProps = {
  currentPage: 1,
  totalPages: 1,
  onPageChange: undefined,
  siblingCount: 1,
  showFirstLast: true,
  disabled: false,
  size: 'md',
  className: '',
};

export default Pagination;
