import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Size class mapping for the modal panel width.
 */
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Modal component — renders a dialog overlay using a React portal.
 *
 * Features:
 *  - Renders into document.body via createPortal
 *  - Backdrop click & Escape key dismissal (configurable)
 *  - Focus trap: auto-focuses the first focusable element on open
 *  - Body scroll lock while open
 *  - Fully accessible: role="dialog", aria-modal, aria-labelledby
 */
const Modal = forwardRef(function Modal(
  {
    isOpen,
    onClose,
    title,
    size,
    closeOnBackdrop,
    closeOnEsc,
    showCloseButton,
    footer,
    children,
    className,
  },
  ref,
) {
  const modalPanelRef = useRef(null);

  // Merge the forwarded ref with the internal ref
  const setRefs = useCallback(
    (node) => {
      modalPanelRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  // ---- Escape key handler ----
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // ---- Body scroll lock ----
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // ---- Focus trap: focus first focusable element on open ----
  useEffect(() => {
    if (!isOpen || !modalPanelRef.current) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const firstFocusable =
      modalPanelRef.current.querySelector(focusableSelectors);

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      // If no focusable child, focus the panel itself
      modalPanelRef.current.focus();
    }
  }, [isOpen]);

  // ---- Backdrop click handler ----
  const handleBackdropClick = (e) => {
    // Only close if the click target is the backdrop itself, not a child
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  const titleId = title ? 'modal-title' : undefined;

  const modalContent = (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      {/* Modal panel */}
      <div
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          'bg-white rounded-xl shadow-2xl w-full animate-scale-in flex flex-col',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        data-testid="modal-panel"
      >
        {/* ---- Header ---- */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Close modal"
                data-testid="modal-close-button"
              >
                {/* X icon (Heroicons mini) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ---- Body ---- */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {/* ---- Footer ---- */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200" data-testid="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

Modal.displayName = 'Modal';

Modal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Callback fired when the modal requests to be closed */
  onClose: PropTypes.func.isRequired,
  /** Title displayed in the modal header */
  title: PropTypes.string,
  /** Width preset for the modal panel */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Close modal when backdrop (overlay) is clicked */
  closeOnBackdrop: PropTypes.bool,
  /** Close modal when the Escape key is pressed */
  closeOnEsc: PropTypes.bool,
  /** Show the × close button in the header */
  showCloseButton: PropTypes.bool,
  /** Content rendered in the fixed footer area */
  footer: PropTypes.node,
  /** Modal body content */
  children: PropTypes.node,
  /** Additional CSS classes applied to the modal panel */
  className: PropTypes.string,
};

Modal.defaultProps = {
  title: undefined,
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  showCloseButton: true,
  footer: undefined,
  children: undefined,
  className: '',
};

export default Modal;
