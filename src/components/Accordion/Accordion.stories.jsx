import React from 'react';
import Accordion from './Accordion';

/**
 * A collapsible Accordion component that supports single-expand and
 * multi-expand modes, disabled items, configurable icon position,
 * default expanded state, and smooth height transitions.
 */
export default {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    allowMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple items to be expanded at once.',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Position of the expand/collapse chevron icon.',
    },
    defaultExpanded: {
      control: { type: 'object' },
      description: 'Array of item IDs to expand by default.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the wrapper.',
    },
  },
};

// ─── Sample item data ───────────────────────────────────────────────────────

const defaultItems = [
  {
    id: 'getting-started',
    title: 'How do I get started?',
    content:
      'Create an account on our platform, then follow the onboarding wizard to set up your first project. You can import existing data or start from scratch.',
  },
  {
    id: 'pricing',
    title: 'What are the pricing plans?',
    content:
      'We offer Free, Pro, and Enterprise plans. The Free plan includes up to 3 projects and 1 GB of storage. Pro adds unlimited projects, priority support, and 50 GB of storage. Enterprise includes custom SLAs and dedicated infrastructure.',
  },
  {
    id: 'support',
    title: 'How can I contact support?',
    content:
      'You can reach our support team via email at support@example.com, through the in-app chat widget, or by calling 1-800-EXAMPLE during business hours (9 AM – 5 PM EST).',
  },
];

const manyItems = [
  {
    id: 'account',
    title: 'How do I create an account?',
    content:
      'Click "Sign Up" on the homepage, enter your email and password, then verify your email address through the confirmation link we send you.',
  },
  {
    id: 'reset-password',
    title: 'How do I reset my password?',
    content:
      'Go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a link to create a new password.',
  },
  {
    id: 'billing',
    title: 'Where can I view my billing history?',
    content:
      'Navigate to Settings → Billing to see all past invoices, current subscription details, and upcoming charges.',
  },
  {
    id: 'integrations',
    title: 'What integrations are available?',
    content:
      'We integrate with Slack, GitHub, Jira, Notion, Google Workspace, and over 50 other popular tools. Check our Integrations page for the full list.',
  },
  {
    id: 'data-export',
    title: 'Can I export my data?',
    content:
      'Yes! You can export all your data in CSV, JSON, or PDF format from the Settings → Data Export page at any time.',
  },
  {
    id: 'security',
    title: 'How is my data secured?',
    content:
      'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We perform regular security audits and are SOC 2 Type II certified.',
  },
];

const itemsWithDisabled = [
  {
    id: 'active-feature',
    title: 'Dashboard Analytics',
    content:
      'View real-time analytics including page views, user sessions, and conversion rates. Customise your dashboard with drag-and-drop widgets.',
  },
  {
    id: 'disabled-feature',
    title: 'Advanced Reporting (Coming Soon)',
    content:
      'Generate detailed reports with custom date ranges, filters, and export options. This feature is currently under development.',
    disabled: true,
  },
  {
    id: 'another-feature',
    title: 'Team Collaboration',
    content:
      'Invite team members, assign roles, and collaborate in real time with comments, mentions, and shared workspaces.',
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default accordion with single-expand behaviour. */
export const Default = {
  args: {
    items: defaultItems,
  },
};

/** Multiple items can be expanded simultaneously. */
export const MultipleExpand = {
  args: {
    items: defaultItems,
    allowMultiple: true,
  },
};

/** The "pricing" item starts expanded on first render. */
export const DefaultExpanded = {
  args: {
    items: defaultItems,
    defaultExpanded: ['pricing'],
  },
};

/** One item is disabled and cannot be toggled. */
export const WithDisabledItem = {
  args: {
    items: itemsWithDisabled,
  },
};

/** Chevron icon positioned on the left side of the header. */
export const IconLeft = {
  args: {
    items: defaultItems,
    iconPosition: 'left',
  },
};

/** A longer accordion with 6 items showcasing varied content. */
export const ManyItems = {
  args: {
    items: manyItems,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
