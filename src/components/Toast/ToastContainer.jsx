import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Toast from './Toast';

/**
 * Tailwind positioning classes for each supported container placement.
 */
const POSITION_CLASSES = {
  'top-right': 'fixed top-4 right-4',
  'top-left': 'fixed top-4 left-4',
  'bottom-right': 'fixed bottom-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'top-center': 'fixed top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2',
};

/**
 * ToastContainer — renders a stack of Toast notifications via a portal.
 *
 * Features:
 *  - Creates a portal into document.body so toasts always sit on top
 *  - Six pre-defined screen positions
 *  - z-[9999] to stay above all other UI layers
 *  - Flex column layout with gap-3 between toasts
 */
const ToastContainer = ({ toasts, removeToast, position }) => {
  if (!toasts || toasts.length === 0) return null;

  const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES['top-right'];

  const container = (
    <div
      className={[positionClass, 'z-[9999] flex flex-col gap-3'].join(' ')}
      data-testid="toast-container"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onDismiss={removeToast}
          dismissible={toast.dismissible !== undefined ? toast.dismissible : true}
        />
      ))}
    </div>
  );

  return createPortal(container, document.body);
};

ToastContainer.displayName = 'ToastContainer';

ToastContainer.propTypes = {
  /** Array of toast objects to render */
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      message: PropTypes.string.isRequired,
      duration: PropTypes.number,
      dismissible: PropTypes.bool,
    }),
  ).isRequired,
  /** Callback to remove a toast by id */
  removeToast: PropTypes.func.isRequired,
  /** Screen position for the toast stack */
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ]),
};

ToastContainer.defaultProps = {
  position: 'top-right',
};

export default ToastContainer;
