import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Icon components for each toast type.
 * Each renders a 20×20 SVG with appropriate color.
 */
const icons = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-success-500"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-danger-500"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-warning-500"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-info-500"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

/**
 * Tailwind class mapping for each toast type.
 * Uses custom colors defined in tailwind.config.js.
 */
const TYPE_STYLES = {
  success: 'bg-success-50 border-l-4 border-success-500',
  error: 'bg-danger-50 border-l-4 border-danger-500',
  warning: 'bg-warning-50 border-l-4 border-warning-500',
  info: 'bg-info-50 border-l-4 border-info-500',
};

/**
 * Text color for the dismiss button per type, keeps visual consistency.
 */
const DISMISS_BUTTON_STYLES = {
  success: 'text-success-700 hover:text-success-500',
  error: 'text-danger-700 hover:text-danger-500',
  warning: 'text-warning-700 hover:text-warning-500',
  info: 'text-info-700 hover:text-info-500',
};

/**
 * Toast — a single notification toast component.
 *
 * Features:
 *  - Four visual types: success, error, warning, info
 *  - Auto-dismiss after configurable duration (default 5 000 ms)
 *  - Optional dismiss button
 *  - Slide-in animation from the right
 *  - Accessible: role="alert", aria-live="polite"
 */
const Toast = ({ id, type, message, duration, onDismiss, dismissible }) => {
  // ---- Auto-dismiss timer ----
  useEffect(() => {
    if (duration <= 0 || !onDismiss) return;

    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in-right min-w-[300px] max-w-md',
        TYPE_STYLES[type] || TYPE_STYLES.info,
      ].join(' ')}
      data-testid={`toast-${type}`}
    >
      {/* Type icon */}
      <span className="flex-shrink-0" data-testid="toast-icon">
        {icons[type] || icons.info}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-gray-800" data-testid="toast-message">
        {message}
      </p>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={() => onDismiss?.(id)}
          className={[
            'flex-shrink-0 inline-flex items-center justify-center rounded-md p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
            DISMISS_BUTTON_STYLES[type] || DISMISS_BUTTON_STYLES.info,
          ].join(' ')}
          aria-label="Dismiss notification"
          data-testid="toast-dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};

Toast.displayName = 'Toast';

Toast.propTypes = {
  /** Unique identifier for the toast */
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Visual type / severity of the notification */
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  /** Text message displayed inside the toast */
  message: PropTypes.string.isRequired,
  /** Auto-dismiss delay in milliseconds (0 to disable) */
  duration: PropTypes.number,
  /** Callback fired when the toast should be removed — receives (id) */
  onDismiss: PropTypes.func,
  /** Whether the dismiss (×) button is shown */
  dismissible: PropTypes.bool,
};

Toast.defaultProps = {
  type: 'info',
  duration: 5000,
  onDismiss: undefined,
  dismissible: true,
};

export default Toast;
