import React from 'react';
import Button from './Button';

/**
 * A versatile Button component that supports multiple visual variants,
 * three sizes, a loading spinner, left/right icon slots, full-width mode,
 * and proper accessibility attributes.
 */
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual style variant of the button.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size preset.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button.',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows a spinner and prevents interaction.',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Stretches the button to fill its container.',
    },
    children: {
      control: { type: 'text' },
      description: 'Button label / content.',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler.',
    },
  },
};

// ─── Inline SVG helper icons ────────────────────────────────────────────────

/** Simple right-arrow icon (→) */
const ArrowRightIcon = (
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

/** Simple plus icon (+) */
const PlusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default primary button in medium size. */
export const Default = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    size: 'md',
  },
};

/** Displays every variant side-by-side for quick visual comparison. */
export const AllVariants = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </div>
  ),
  args: {
    size: 'md',
  },
};

/** Displays each size preset for comparison. */
export const AllSizes = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
  args: {
    variant: 'primary',
  },
};

/** Button in loading / busy state with a spinner. */
export const LoadingState = {
  args: {
    children: 'Saving…',
    loading: true,
    variant: 'primary',
    size: 'md',
  },
};

/** Demonstrates left and right icon slots using inline SVGs. */
export const WithIcons = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} leftIcon={PlusIcon}>
        Add Item
      </Button>
      <Button {...args} rightIcon={ArrowRightIcon}>
        Continue
      </Button>
      <Button {...args} leftIcon={PlusIcon} rightIcon={ArrowRightIcon}>
        Both Icons
      </Button>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'md',
  },
};

/** Disabled state across different variants. */
export const Disabled = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} variant="primary" disabled>Primary</Button>
      <Button {...args} variant="secondary" disabled>Secondary</Button>
      <Button {...args} variant="outline" disabled>Outline</Button>
      <Button {...args} variant="ghost" disabled>Ghost</Button>
      <Button {...args} variant="danger" disabled>Danger</Button>
    </div>
  ),
  args: {
    size: 'md',
  },
};

/** Full-width button stretching to fill its container. */
export const FullWidth = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'primary',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};
