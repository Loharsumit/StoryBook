import React from 'react';
import Tooltip from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip content — string or React node',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Placement relative to the trigger',
    },
    delay: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Delay in ms before showing',
    },
    arrow: {
      control: 'boolean',
      description: 'Show directional arrow',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-24 min-h-[300px]">
        <Story />
      </div>
    ),
  ],
};

// ─── Default (top position) ──────────────────────────────────────────────────

export const Default = {
  args: {
    content: 'Hello, I am a tooltip!',
    position: 'top',
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        Hover me
      </button>
    ),
  },
};

// ─── Positions ───────────────────────────────────────────────────────────────

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="grid grid-cols-2 gap-12">
      <Tooltip content="Top tooltip" position="top">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Top
        </button>
      </Tooltip>

      <Tooltip content="Right tooltip" position="right">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Right
        </button>
      </Tooltip>

      <Tooltip content="Bottom tooltip" position="bottom">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Bottom
        </button>
      </Tooltip>

      <Tooltip content="Left tooltip" position="left">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Left
        </button>
      </Tooltip>
    </div>
  ),
};

// ─── WithDelay ───────────────────────────────────────────────────────────────

export const WithDelay = {
  name: 'With Delay (500ms)',
  args: {
    content: 'I appeared after 500ms',
    position: 'top',
    delay: 500,
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        Hover &amp; wait
      </button>
    ),
  },
};

// ─── WithArrow ───────────────────────────────────────────────────────────────

export const WithArrow = {
  name: 'With Arrow',
  args: {
    content: 'Arrow included',
    position: 'top',
    arrow: true,
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        Arrow tooltip
      </button>
    ),
  },
};

// ─── WithoutArrow ────────────────────────────────────────────────────────────

export const WithoutArrow = {
  name: 'Without Arrow',
  args: {
    content: 'No arrow here',
    position: 'bottom',
    arrow: false,
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        No arrow tooltip
      </button>
    ),
  },
};

// ─── CustomContent ───────────────────────────────────────────────────────────

export const CustomContent = {
  name: 'Custom Content',
  args: {
    content: (
      <div className="flex items-center gap-2">
        <span className="text-lg">🚀</span>
        <span>
          <strong className="block">Pro tip</strong>
          <span className="text-xs text-slate-300">You can use rich content!</span>
        </span>
      </div>
    ),
    position: 'right',
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        Rich tooltip
      </button>
    ),
  },
};

// ─── LongText ────────────────────────────────────────────────────────────────

export const LongText = {
  name: 'Long Text',
  args: {
    content: 'This is a tooltip with a much longer text to demonstrate how it handles extended content inside the bubble.',
    position: 'bottom',
    children: (
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
        Long tooltip
      </button>
    ),
  },
};
