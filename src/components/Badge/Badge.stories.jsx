import React from 'react';
import Badge from './Badge';

/**
 * A compact status-indicator badge with multiple color and variant
 * combinations, optional leading dot, and optional remove button.
 */
export default {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'subtle'],
      description: 'Visual style variant.',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'info', 'slate'],
      description: 'Color theme.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size preset.',
    },
    dot: {
      control: { type: 'boolean' },
      description: 'Show a status dot before the label.',
    },
    removable: {
      control: { type: 'boolean' },
      description: 'Show a dismiss button after the label.',
    },
    onRemove: {
      action: 'removed',
      description: 'Called when the remove button is clicked.',
    },
    children: {
      control: { type: 'text' },
      description: 'Badge label / content.',
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = ['primary', 'success', 'warning', 'danger', 'info', 'slate'];
const VARIANTS = ['solid', 'outline', 'subtle'];

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default solid primary badge in medium size. */
export const Default = {
  args: {
    children: 'Badge',
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
};

/** All six colours rendered side-by-side in the solid variant. */
export const AllColors = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {COLORS.map((c) => (
        <Badge key={c} {...args} color={c}>
          {c}
        </Badge>
      ))}
    </div>
  ),
  args: {
    variant: 'solid',
    size: 'md',
  },
};

/** Solid, outline, and subtle variants for a single colour. */
export const AllVariants = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((v) => (
        <Badge key={v} {...args} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
  args: {
    color: 'primary',
    size: 'md',
  },
};

/** Small, medium, and large sizes compared side-by-side. */
export const Sizes = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
      <Badge {...args} size="lg">Large</Badge>
    </div>
  ),
  args: {
    variant: 'solid',
    color: 'primary',
  },
};

/** Badge with a leading status-dot indicator. */
export const WithDot = {
  args: {
    children: 'Active',
    dot: true,
    variant: 'solid',
    color: 'success',
    size: 'md',
  },
};

/** Badge with a dismiss / remove button. */
export const Removable = {
  args: {
    children: 'Tag',
    removable: true,
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
};

/**
 * Full colour × variant matrix rendered as a grid.
 * Useful for visual regression testing and design QA.
 */
export const ColorVariantMatrix = {
  render: () => (
    <div className="space-y-4">
      {VARIANTS.map((v) => (
        <div key={v} className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {v}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {COLORS.map((c) => (
              <Badge key={`${v}-${c}`} variant={v} color={c}>
                {c}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
