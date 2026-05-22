import React from 'react';
import Input from './Input';

/**
 * Simple inline SVG icons used across stories.
 */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

/** Default input with a placeholder. */
export const Default = {
  args: {
    placeholder: 'Enter text…',
  },
};

/** Input with a visible label above it. */
export const WithLabel = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

/** Input in an error state showing a validation message. */
export const WithError = {
  args: {
    label: 'Username',
    placeholder: 'Pick a username',
    error: 'Username is already taken.',
  },
};

/** Input with helpful hint text below it. */
export const WithHelperText = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    helperText: 'Must be at least 8 characters.',
  },
};

/** Disabled input — cannot be interacted with. */
export const Disabled = {
  args: {
    label: 'Account ID',
    value: 'ACC-12345',
    disabled: true,
  },
};

/** Input with both a left search icon and a right mail icon. */
export const WithIcons = {
  args: {
    label: 'Search',
    placeholder: 'Search…',
    leftIcon: <SearchIcon />,
    rightIcon: <MailIcon />,
  },
};

/** Side-by-side comparison of all three sizes. */
export const Sizes = {
  render: () => (
    <div className="space-y-4">
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium (default)" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

/** Password-type input with obscured text. */
export const Password = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
};

/** Required input field showing the red asterisk. */
export const Required = {
  args: {
    label: 'Full name',
    placeholder: 'Jane Doe',
    required: true,
  },
};
