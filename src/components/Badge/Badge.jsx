import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Color × variant style mappings.
 * Each color has three sub-keys: solid, outline, and subtle.
 * Classes are written out in full so Tailwind's JIT scanner can detect them.
 */
const colorVariantStyles = {
  primary: {
    solid: 'bg-primary-600 text-white',
    outline: 'border border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400',
    subtle: 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300',
  },
  success: {
    solid: 'bg-success-600 text-white',
    outline: 'border border-success-600 text-success-600 dark:border-success-500 dark:text-success-400',
    subtle: 'bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300',
  },
  warning: {
    solid: 'bg-warning-600 text-white',
    outline: 'border border-warning-600 text-warning-600 dark:border-warning-500 dark:text-warning-400',
    subtle: 'bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300',
  },
  danger: {
    solid: 'bg-danger-600 text-white',
    outline: 'border border-danger-600 text-danger-600 dark:border-danger-500 dark:text-danger-400',
    subtle: 'bg-danger-100 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300',
  },
  info: {
    solid: 'bg-info-600 text-white',
    outline: 'border border-info-600 text-info-600 dark:border-info-500 dark:text-info-400',
    subtle: 'bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300',
  },
  slate: {
    solid: 'bg-slate-600 text-white',
    outline: 'border border-slate-600 text-slate-600 dark:border-slate-500 dark:text-slate-400',
    subtle: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
};

/**
 * Size presets controlling padding and font size.
 */
const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Dot indicator size per badge size.
 */
const dotSizeStyles = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

/**
 * Dot color per color × variant combination.
 * - solid variants use a white dot (contrasts against dark bg)
 * - outline / subtle variants use the color-600 shade
 */
const dotColorStyles = {
  primary: { solid: 'bg-white', outline: 'bg-primary-600 dark:bg-primary-400', subtle: 'bg-primary-600 dark:bg-primary-400' },
  success: { solid: 'bg-white', outline: 'bg-success-600 dark:bg-success-400', subtle: 'bg-success-600 dark:bg-success-400' },
  warning: { solid: 'bg-white', outline: 'bg-warning-600 dark:bg-warning-400', subtle: 'bg-warning-600 dark:bg-warning-400' },
  danger: { solid: 'bg-white', outline: 'bg-danger-600 dark:bg-danger-400', subtle: 'bg-danger-600 dark:bg-danger-400' },
  info: { solid: 'bg-white', outline: 'bg-info-600 dark:bg-info-400', subtle: 'bg-info-600 dark:bg-info-400' },
  slate: { solid: 'bg-white', outline: 'bg-slate-600 dark:bg-slate-400', subtle: 'bg-slate-600 dark:bg-slate-400' },
};

/**
 * A compact status-indicator badge with multiple color and variant
 * combinations, an optional leading dot, and an optional remove button.
 *
 * Uses forwardRef so parent components can access the root DOM element.
 */
const Badge = forwardRef(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      dot = false,
      removable = false,
      onRemove,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    /** Build the composite class string */
    const classes = [
      // Base layout
      'inline-flex items-center gap-1 rounded-full font-medium',
      // Color + variant styles
      colorVariantStyles[color]?.[variant],
      // Size styles
      sizeStyles[size],
      // Consumer overrides
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes} role="status" {...rest}>
        {/* Optional dot indicator */}
        {dot && (
          <span
            className={[
              'rounded-full',
              dotSizeStyles[size],
              dotColorStyles[color]?.[variant],
            ]
              .filter(Boolean)
              .join(' ')}
            data-testid="badge-dot"
            aria-hidden="true"
          />
        )}

        {/* Badge label */}
        {children}

        {/* Optional remove / dismiss button */}
        {removable && (
          <button
            type="button"
            className="inline-flex items-center justify-center ml-0.5 rounded-full hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-current cursor-pointer"
            onClick={onRemove}
            aria-label="Remove"
            data-testid="badge-remove"
          >
            <svg
              className="h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

Badge.propTypes = {
  /** Visual style variant */
  variant: PropTypes.oneOf(['solid', 'outline', 'subtle']),
  /** Color theme */
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'slate']),
  /** Size preset */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Show a small status dot before the text */
  dot: PropTypes.bool,
  /** Show a dismiss / remove button after the text */
  removable: PropTypes.bool,
  /** Called when the remove button is clicked */
  onRemove: PropTypes.func,
  /** Badge label / content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
};

Badge.defaultProps = {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  dot: false,
  removable: false,
  onRemove: undefined,
  className: '',
};

export default Badge;
