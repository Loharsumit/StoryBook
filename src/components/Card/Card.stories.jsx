import React from 'react';
import { fn } from '@storybook/test';
import Card from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible content container for grouping related information, with support for images, titles, footers, hover effects, and click interactions.',
      },
    },
  },
  argTypes: {
    shadow: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'md', 'lg', 'xl'],
    },
    hoverable: { control: 'boolean' },
    bordered: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    image: { control: 'text' },
    imageAlt: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Default card with basic text content.
 */
export const Default = {
  args: {
    title: 'Card Title',
    subtitle: 'A brief description of the card content.',
    children: (
      <p className="text-slate-600">
        This is the card body content. You can place any content here, including
        text, images, forms, or other components.
      </p>
    ),
  },
};

/**
 * Card featuring a hero image at the top with title, subtitle, and body text.
 */
export const WithImage = {
  args: {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=300&fit=crop',
    imageAlt: 'A scenic mountain landscape at sunrise',
    title: 'Mountain Adventure',
    subtitle: 'Explore breathtaking mountain trails',
    children: (
      <p className="text-slate-600">
        Discover the beauty of untouched wilderness on our guided mountain
        expeditions. Perfect for both beginners and seasoned hikers.
      </p>
    ),
  },
};

/**
 * Card with a footer section containing action buttons.
 */
export const WithFooter = {
  args: {
    title: 'Project Update',
    subtitle: 'Last updated 2 hours ago',
    children: (
      <p className="text-slate-600">
        The project is progressing well. All milestones are on track and the
        team is working efficiently toward the deadline.
      </p>
    ),
    footer: (
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          Cancel
        </button>
        <button className="px-3 py-1.5 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">
          Save
        </button>
      </div>
    ),
  },
};

/**
 * Hoverable card with a subtle lift effect on mouse hover.
 */
export const Hoverable = {
  args: {
    title: 'Hover Over Me',
    subtitle: 'I lift up on hover!',
    hoverable: true,
    children: (
      <p className="text-slate-600">
        This card has a hover effect — it rises slightly and gains a deeper
        shadow when you hover your cursor over it.
      </p>
    ),
  },
};

/**
 * Clickable card that acts as a button with keyboard support.
 */
export const Clickable = {
  args: {
    title: 'Click Me',
    subtitle: 'I respond to clicks and keyboard events',
    hoverable: true,
    onClick: fn(),
    children: (
      <p className="text-slate-600">
        This card is interactive — click it or press Enter/Space when focused.
        It has role=&quot;button&quot; and proper tabIndex for accessibility.
      </p>
    ),
  },
};

/**
 * Card with rich custom children content including multiple elements.
 */
export const CustomContent = {
  args: {
    title: 'Team Members',
    children: (
      <div className="space-y-3">
        {['Alice Johnson', 'Bob Smith', 'Carol Williams'].map((name) => (
          <div key={name} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-slate-700">{name}</span>
          </div>
        ))}
      </div>
    ),
  },
};

/**
 * Card with a visible border.
 */
export const Bordered = {
  args: {
    title: 'Bordered Card',
    subtitle: 'This card has a visible border',
    bordered: true,
    shadow: 'none',
    children: (
      <p className="text-slate-600">
        Using the bordered prop adds a subtle slate border. Combined with
        shadow=&quot;none&quot;, it creates a clean, flat card look.
      </p>
    ),
  },
};
