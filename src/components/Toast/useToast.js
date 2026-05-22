import { useState, useCallback } from 'react';

/**
 * Monotonically incrementing counter used to generate unique toast ids.
 * Defined outside the hook so it persists across re-renders.
 */
let toastIdCounter = 0;

/**
 * useToast — custom hook for managing a stack of toast notifications.
 *
 * @returns {{ toasts: Array, addToast: Function, removeToast: Function }}
 *
 * @example
 * const { toasts, addToast, removeToast } = useToast();
 * addToast({ type: 'success', message: 'Saved!' });
 * addToast({ type: 'error', message: 'Failed!', duration: 3000 });
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification.
   *
   * @param {Object}  options
   * @param {'success'|'error'|'warning'|'info'} options.type - Visual type.
   * @param {string}  options.message - Text content.
   * @param {number}  [options.duration=5000] - Auto-dismiss delay (ms).
   * @param {boolean} [options.dismissible=true] - Show dismiss button.
   */
  const addToast = useCallback(({ type = 'info', message, duration = 5000, dismissible = true }) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, type, message, duration, dismissible }]);
    return id;
  }, []);

  /**
   * Remove a toast by its id.
   *
   * @param {string|number} id
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default useToast;
