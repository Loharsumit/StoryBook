import React, { useState } from 'react';
import Toast from './Toast';
import ToastContainer from './ToastContainer';
import useToast from './useToast';

export default {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A notification toast component with four severity types, auto-dismiss, and a companion `useToast` hook for state management.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Visual type / severity of the notification.',
    },
    message: {
      control: 'text',
      description: 'Text content shown in the toast.',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss delay in milliseconds. Set to 0 to disable.',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show the dismiss (×) button.',
    },
  },
};

// -------------------------------------------------------------------
// Helper wrapper — prevents auto-dismiss in static stories so they
// stay visible and disables the onDismiss to keep the story simple.
// -------------------------------------------------------------------
const StaticToast = (args) => (
  <Toast {...args} id="static-toast" duration={0} onDismiss={() => {}} />
);

// ===================================================================
// Individual type stories
// ===================================================================

/** A success notification toast. */
export const Success = {
  render: (args) => <StaticToast {...args} />,
  args: {
    type: 'success',
    message: 'Changes saved successfully!',
    dismissible: true,
  },
};

/** An error notification toast. */
export const Error = {
  render: (args) => <StaticToast {...args} />,
  args: {
    type: 'error',
    message: 'Something went wrong. Please try again.',
    dismissible: true,
  },
};

/** A warning notification toast. */
export const Warning = {
  render: (args) => <StaticToast {...args} />,
  args: {
    type: 'warning',
    message: 'Your session will expire in 5 minutes.',
    dismissible: true,
  },
};

/** An informational notification toast. */
export const Info = {
  render: (args) => <StaticToast {...args} />,
  args: {
    type: 'info',
    message: 'A new version of the app is available.',
    dismissible: true,
  },
};

// ===================================================================
// All Types — shows every variant stacked together
// ===================================================================

/** All four toast types displayed simultaneously. */
export const AllTypes = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Toast
        id="s1"
        type="success"
        message="Changes saved successfully!"
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        id="e1"
        type="error"
        message="Something went wrong. Please try again."
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        id="w1"
        type="warning"
        message="Your session will expire in 5 minutes."
        duration={0}
        onDismiss={() => {}}
      />
      <Toast
        id="i1"
        type="info"
        message="A new version of the app is available."
        duration={0}
        onDismiss={() => {}}
      />
    </div>
  ),
};

// ===================================================================
// Auto-Dismiss — demonstrates the timer behaviour
// ===================================================================

/**
 * Auto-dismiss demo.
 *
 * The toast will automatically disappear after 3 seconds.
 * Click "Show toast" to see it again.
 */
const AutoDismissDemo = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      {visible ? (
        <Toast
          id="auto"
          type="info"
          message="This toast will auto-dismiss in 3 seconds."
          duration={3000}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Show toast again
        </button>
      )}
      <p className="mt-4 text-xs text-gray-500">
        ℹ️ The toast auto-dismisses after 3 000 ms via a <code>useEffect</code> timer.
      </p>
    </div>
  );
};

export const AutoDismiss = {
  render: () => <AutoDismissDemo />,
};

// ===================================================================
// Dismissible vs Non-Dismissible
// ===================================================================

/** Comparison of dismissible and non-dismissible toasts. */
export const Dismissible = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Toast
        id="d1"
        type="success"
        message="This toast has a dismiss button."
        duration={0}
        onDismiss={() => {}}
        dismissible={true}
      />
      <Toast
        id="d2"
        type="warning"
        message="This toast cannot be manually dismissed."
        duration={0}
        onDismiss={() => {}}
        dismissible={false}
      />
    </div>
  ),
};

// ===================================================================
// Interactive Demo — uses the useToast hook
// ===================================================================

/**
 * Fully interactive demo powered by the `useToast` hook.
 *
 * Click the buttons below to add toasts of different types.
 * They auto-dismiss after 5 seconds or can be closed manually.
 */
const InteractiveDemoComponent = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [position, setPosition] = useState('top-right');

  const positions = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => addToast({ type: 'success', message: 'Operation completed!' })}
          className="px-3 py-1.5 text-sm font-medium text-white bg-success-600 rounded-md hover:bg-success-700 transition-colors"
        >
          + Success
        </button>
        <button
          type="button"
          onClick={() => addToast({ type: 'error', message: 'An error occurred.' })}
          className="px-3 py-1.5 text-sm font-medium text-white bg-danger-600 rounded-md hover:bg-danger-700 transition-colors"
        >
          + Error
        </button>
        <button
          type="button"
          onClick={() => addToast({ type: 'warning', message: 'Proceed with caution.' })}
          className="px-3 py-1.5 text-sm font-medium text-white bg-warning-600 rounded-md hover:bg-warning-700 transition-colors"
        >
          + Warning
        </button>
        <button
          type="button"
          onClick={() => addToast({ type: 'info', message: 'Here is some information.' })}
          className="px-3 py-1.5 text-sm font-medium text-white bg-info-600 rounded-md hover:bg-info-700 transition-colors"
        >
          + Info
        </button>
      </div>

      {/* Position selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position
        </label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        >
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500">
        Active toasts: {toasts.length}
      </p>

      {/* ToastContainer renders via portal */}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </div>
  );
};

export const InteractiveDemo = {
  render: () => <InteractiveDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Click the buttons to add toast notifications. They stack in the chosen position and auto-dismiss after 5 seconds.',
      },
    },
  },
};
