import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Variant style mappings for the Button component.
 * Each variant maps to a set of Tailwind utility classes.
 */
const variantStyles = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary:
    'bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost:
    'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
};

/**
 * Size style mappings for the Button component.
 */
const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * A versatile, accessible Button component with multiple variants, sizes,
 * loading state, icon support, and full-width option.
 *
 * Uses forwardRef to allow parent components to access the underlying
 * button DOM element.
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon = null,
      rightIcon = null,
      fullWidth = false,
      onClick,
      children,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    /** Determine if the button should be non-interactive */
    const isDisabled = disabled || loading;

    /**
     * Handle click events.
     * Prevents firing when the button is disabled or in a loading state.
     */
    const handleClick = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    /** Build the class string from variant, size, state, and custom classes */
    const classes = [
      // Base styles shared by all buttons
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Variant-specific styles
      variantStyles[variant],
      // Size-specific styles
      sizeStyles[size],
      // Full-width modifier
      fullWidth ? 'w-full' : '',
      // Disabled / loading visual state
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      // Any additional classes passed by the consumer
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        onClick={handleClick}
        disabled={isDisabled}
        role="button"
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {/* Spinning loader shown during the loading state */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="button-spinner"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Left icon – hidden when loading to avoid double leading elements */}
        {!loading && leftIcon && (
          <span className="mr-2 inline-flex" data-testid="left-icon">
            {leftIcon}
          </span>
        )}

        {children}

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 inline-flex" data-testid="right-icon">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  /** Visual style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  /** Size preset */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  /** Whether the button is in a loading / busy state */
  loading: PropTypes.bool,
  /** Icon element rendered before the label */
  leftIcon: PropTypes.node,
  /** Icon element rendered after the label */
  rightIcon: PropTypes.node,
  /** Stretch the button to fill its container */
  fullWidth: PropTypes.bool,
  /** Click handler */
  onClick: PropTypes.func,
  /** Button label / content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** HTML button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  leftIcon: null,
  rightIcon: null,
  fullWidth: false,
  onClick: undefined,
  className: '',
  type: 'button',
};

export default Button;
