import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

// ─── Rendering ──────────────────────────────────────────────────────────────

describe('Pagination', () => {
  it('renders page number buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    // Pages 1 through 5 should all be visible (no ellipsis needed)
    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByRole('button', { name: `Go to page ${i}` })
      ).toBeInTheDocument();
    }
  });

  it('highlights the current page with active classes', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    const activePage = screen.getByRole('button', { name: 'Go to page 3' });
    expect(activePage.className).toContain('bg-primary-600');
    expect(activePage.className).toContain('text-white');
  });

  // ─── onPageChange callback ─────────────────────────────────────────────────

  it('calls onPageChange with the correct page number when a page button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(handlePageChange).toHaveBeenCalledTimes(1);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when Previous button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Next button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  // ─── Previous / Next disabled states ───────────────────────────────────────

  it('disables the Previous button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    const prevButton = screen.getByRole('button', { name: 'Go to previous page' });
    expect(prevButton).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    const nextButton = screen.getByRole('button', { name: 'Go to next page' });
    expect(nextButton).toBeDisabled();
  });

  // ─── Ellipsis ──────────────────────────────────────────────────────────────

  it('renders ellipsis for large page counts', () => {
    render(<Pagination currentPage={10} totalPages={50} siblingCount={1} />);

    const ellipses = screen.getAllByTestId('pagination-ellipsis');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);

    // With currentPage=10 and siblingCount=1 we expect ellipses on both sides
    // Visible pages should be: 1, …, 9, 10, 11, …, 50
    expect(ellipses).toHaveLength(2);
  });

  it('does not render ellipsis when all pages fit', () => {
    render(<Pagination currentPage={2} totalPages={3} />);

    expect(screen.queryByTestId('pagination-ellipsis')).not.toBeInTheDocument();
  });

  // ─── First / Last page buttons ─────────────────────────────────────────────

  it('shows first and last page buttons when showFirstLast is true', () => {
    render(<Pagination currentPage={3} totalPages={10} showFirstLast />);

    expect(
      screen.getByRole('button', { name: 'Go to first page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to last page' })
    ).toBeInTheDocument();
  });

  it('hides first and last page buttons when showFirstLast is false', () => {
    render(
      <Pagination currentPage={3} totalPages={10} showFirstLast={false} />
    );

    expect(
      screen.queryByRole('button', { name: 'Go to first page' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Go to last page' })
    ).not.toBeInTheDocument();
  });

  it('disables First page button on page 1', () => {
    render(<Pagination currentPage={1} totalPages={10} showFirstLast />);

    expect(
      screen.getByRole('button', { name: 'Go to first page' })
    ).toBeDisabled();
  });

  it('disables Last page button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} showFirstLast />);

    expect(
      screen.getByRole('button', { name: 'Go to last page' })
    ).toBeDisabled();
  });

  it('calls onPageChange with 1 when First page button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        showFirstLast
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to first page' }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with totalPages when Last page button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        showFirstLast
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to last page' }));
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  // ─── Disabled state ────────────────────────────────────────────────────────

  it('disables all buttons when disabled prop is true', () => {
    render(<Pagination currentPage={3} totalPages={10} disabled />);

    const allButtons = screen.getAllByRole('button');
    allButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('does not call onPageChange when disabled', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        disabled
        onPageChange={handlePageChange}
      />
    );

    // Try clicking a page button
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    expect(handlePageChange).not.toHaveBeenCalled();
  });

  // ─── Size classes ──────────────────────────────────────────────────────────

  describe('size classes', () => {
    it('applies sm size classes', () => {
      render(<Pagination currentPage={1} totalPages={3} size="sm" />);

      const pageButton = screen.getByRole('button', { name: 'Go to page 1' });
      expect(pageButton.className).toContain('h-8');
      expect(pageButton.className).toContain('w-8');
      expect(pageButton.className).toContain('text-sm');
    });

    it('applies md size classes (default)', () => {
      render(<Pagination currentPage={1} totalPages={3} size="md" />);

      const pageButton = screen.getByRole('button', { name: 'Go to page 1' });
      expect(pageButton.className).toContain('h-10');
      expect(pageButton.className).toContain('w-10');
      expect(pageButton.className).toContain('text-base');
    });

    it('applies lg size classes', () => {
      render(<Pagination currentPage={1} totalPages={3} size="lg" />);

      const pageButton = screen.getByRole('button', { name: 'Go to page 1' });
      expect(pageButton.className).toContain('h-12');
      expect(pageButton.className).toContain('w-12');
      expect(pageButton.className).toContain('text-lg');
    });
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  it('wraps buttons in a nav element with aria-label="Pagination"', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe('NAV');
  });

  it('sets aria-current="page" on the active page button', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    const activePage = screen.getByRole('button', { name: 'Go to page 3' });
    expect(activePage).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current on inactive page buttons', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    const inactivePage = screen.getByRole('button', { name: 'Go to page 1' });
    expect(inactivePage).not.toHaveAttribute('aria-current');
  });

  it('Previous button has aria-label', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toHaveAttribute('aria-label', 'Go to previous page');
  });

  it('Next button has aria-label', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toHaveAttribute('aria-label', 'Go to next page');
  });

  it('ellipsis elements have aria-hidden="true"', () => {
    render(<Pagination currentPage={10} totalPages={50} siblingCount={1} />);

    const ellipses = screen.getAllByTestId('pagination-ellipsis');
    ellipses.forEach((el) => {
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ─── Custom className ──────────────────────────────────────────────────────

  it('merges a custom className onto the nav element', () => {
    render(
      <Pagination currentPage={1} totalPages={5} className="my-custom-class" />
    );

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav.className).toContain('my-custom-class');
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  it('renders correctly with a single page', () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    // Should show page 1, prev and next both disabled
    expect(
      screen.getByRole('button', { name: 'Go to page 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toBeDisabled();
  });

  it('applies opacity-50 and cursor-not-allowed to disabled buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    const prevButton = screen.getByRole('button', { name: 'Go to previous page' });
    expect(prevButton.className).toContain('opacity-50');
    expect(prevButton.className).toContain('cursor-not-allowed');
  });
});
