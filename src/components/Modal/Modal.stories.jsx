import React, { useState } from 'react';
import Modal from './Modal';

export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    isOpen: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
  },
  // Wrap every story with a button that toggles the modal open/closed
  decorators: [
    (Story, context) => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Open Modal
          </button>

          <Story
            args={{
              ...context.args,
              isOpen,
              onClose: () => setIsOpen(false),
            }}
          />
        </div>
      );
    },
  ],
};

// ── Default ────────────────────────────────────────────────────────────
export const Default = {
  args: {
    title: 'Default Modal',
    children: (
      <p className="text-gray-600">
        This is a basic modal with some simple text content. You can close it by
        clicking the backdrop, pressing <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-sm font-mono">Esc</kbd>, or using the close button.
      </p>
    ),
  },
};

// ── Sizes ──────────────────────────────────────────────────────────────
/**
 * Demonstrates the four available size presets: `sm`, `md`, `lg`, and `xl`.
 * Change the `size` control in the panel to preview each width.
 */
export const Sizes = {
  args: {
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div className="space-y-3 text-gray-600">
        <p>
          This modal uses the <strong>lg</strong> size preset (max-w-lg). Use
          the controls below to switch between <code>sm</code>,{' '}
          <code>md</code>, <code>lg</code>, and <code>xl</code>.
        </p>
        <p>
          Each size adjusts the maximum width of the modal panel while keeping
          everything else identical.
        </p>
      </div>
    ),
  },
};

// ── With Footer ────────────────────────────────────────────────────────
/** A modal that includes action buttons in its footer area. */
export const WithFooter = {
  args: {
    title: 'Confirm Action',
    children: (
      <p className="text-gray-600">
        Are you sure you want to proceed? This action cannot be undone.
      </p>
    ),
    footer: (
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg hover:bg-danger-700 transition-colors"
        >
          Delete
        </button>
      </div>
    ),
  },
};

// ── Scrollable Content ─────────────────────────────────────────────────
/** When the body content exceeds the max height, a scrollbar appears. */
export const ScrollableContent = {
  args: {
    title: 'Terms & Conditions',
    children: (
      <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        ))}
      </div>
    ),
    footer: (
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-success-600 rounded-lg hover:bg-success-700 transition-colors"
        >
          Accept
        </button>
      </div>
    ),
  },
};

// ── No Close Button ────────────────────────────────────────────────────
/** The close button is hidden; user must use backdrop click or Escape. */
export const NoCloseButton = {
  args: {
    title: 'No Close Button',
    showCloseButton: false,
    children: (
      <p className="text-gray-600">
        This modal has no visible close button. You can still dismiss it by
        clicking outside (backdrop) or pressing the Escape key.
      </p>
    ),
  },
};
