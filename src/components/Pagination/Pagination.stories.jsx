import React, { useState } from 'react';
import Pagination from './Pagination';

/**
 * A fully-accessible page-navigation component with Previous / Next arrows,
 * optional First / Last buttons, page number buttons with ellipsis gaps,
 * and three size presets.
 */
export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The currently active page (1-based).',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages.',
    },
    siblingCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of sibling page numbers shown on each side of the current page.',
    },
    showFirstLast: {
      control: { type: 'boolean' },
      description: 'Whether to render First / Last (double-chevron) buttons.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the entire pagination bar.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size preset controlling button dimensions and font size.',
    },
    onPageChange: {
      action: 'page-changed',
      description: 'Callback fired when a page is selected.',
    },
  },
};

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default pagination: page 1 of 10. */
export const Default = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

/** Many pages with the current page in the middle, showing ellipsis on both sides. */
export const ManyPages = {
  args: {
    currentPage: 5,
    totalPages: 50,
    siblingCount: 1,
  },
};

/** Only 3 total pages — no ellipsis needed. */
export const FewPages = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};

/** First / Last double-chevron buttons visible (default behaviour). */
export const WithFirstLast = {
  args: {
    currentPage: 5,
    totalPages: 20,
    showFirstLast: true,
  },
};

/** First / Last buttons hidden. */
export const WithoutFirstLast = {
  args: {
    currentPage: 5,
    totalPages: 20,
    showFirstLast: false,
  },
};

/** All buttons disabled. */
export const Disabled = {
  args: {
    currentPage: 3,
    totalPages: 10,
    disabled: true,
  },
};

/** Side-by-side comparison of the three available sizes. */
export const Sizes = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Small</p>
        <Pagination {...args} size="sm" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Medium (default)</p>
        <Pagination {...args} size="md" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Large</p>
        <Pagination {...args} size="lg" />
      </div>
    </div>
  ),
  args: {
    currentPage: 3,
    totalPages: 10,
  },
};

/**
 * Interactive story — uses React `useState` so clicking a page number
 * actually updates the active page within the Storybook canvas.
 */
export const Interactive = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = useState(args.currentPage ?? 1);

    const handlePageChange = (newPage) => {
      setPage(newPage);
      args.onPageChange?.(newPage);
    };

    return (
      <div>
        <p className="mb-3 text-sm text-slate-600">
          Current page: <strong>{page}</strong> of {args.totalPages}
        </p>
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    );
  },
  args: {
    currentPage: 1,
    totalPages: 20,
    siblingCount: 1,
    showFirstLast: true,
    size: 'md',
  },
};
