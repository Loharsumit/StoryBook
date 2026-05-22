import React, { useState } from 'react';
import Dropdown from './Dropdown';

const basicOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
];

const manyOptions = Array.from({ length: 25 }, (_, i) => ({
  value: String(i + 1),
  label: `Option ${i + 1}`,
}));

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of { value, label } option objects',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when nothing is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether the search input is shown',
    },
    label: {
      control: 'text',
      description: 'Label text above the dropdown',
    },
    error: {
      control: 'text',
      description: 'Error message (enables error styling)',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the dropdown',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when selection changes',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', minHeight: '350px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Render helper that wraps the Dropdown in controlled state so
 * selection actually works in Storybook.
 */
const ControlledTemplate = (args) => {
  const [selected, setSelected] = useState(args.value || undefined);
  return (
    <Dropdown
      {...args}
      value={selected}
      onChange={(val) => {
        setSelected(val);
        args.onChange?.(val);
      }}
    />
  );
};

// ── Stories ──────────────────────────────────────────────────────────────

/** Basic dropdown with a handful of options */
export const Default = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    placeholder: 'Select an option',
  },
};

/** Dropdown with a visible label */
export const WithLabel = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    label: 'Favourite fruit',
    placeholder: 'Pick a fruit...',
  },
};

/** Searchable dropdown — type to filter */
export const Searchable = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    searchable: true,
    label: 'Searchable dropdown',
    placeholder: 'Search and select...',
  },
};

/** Disabled dropdown that cannot be opened */
export const Disabled = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    disabled: true,
    placeholder: 'Cannot interact',
  },
};

/** Dropdown showing an error state with a message */
export const WithError = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    label: 'Required field',
    error: 'This field is required',
    placeholder: 'Select an option',
  },
};

/** Dropdown with 25 options to demonstrate scrolling */
export const ManyOptions = {
  render: ControlledTemplate,
  args: {
    options: manyOptions,
    label: 'Lots of choices',
    placeholder: 'Scroll to find your option...',
    searchable: true,
  },
};

/** Dropdown initialised with a pre-selected value */
export const WithPreselectedValue = {
  render: ControlledTemplate,
  args: {
    options: basicOptions,
    value: '3',
    label: 'Pre-selected',
  },
};
