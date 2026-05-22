import React, { forwardRef, useId } from 'react';
import PropTypes from 'prop-types';

/**
 * Input - A flexible, accessible form text input component.
 *
 * Supports labels, error/helper text, left/right icons, multiple sizes,
 * disabled state, and required field indication. Fully ARIA-compliant.
 */
const Input = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      type = 'text',
      error,
      helperText,
      disabled = false,
      size = 'md',
      leftIcon,
      rightIcon,
      required = false,
      id: externalId,
      name,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Generate a stable unique id if none provided
    const autoId = useId();
    const inputId = externalId || `input-${autoId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // ---- Size classes ----
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2 text-base',
      lg: 'py-3 text-lg',
    };

    // ---- Base input classes ----
    const baseInputClasses = [
      'block w-full rounded-lg border bg-white dark:bg-slate-800 dark:text-slate-100 px-3 transition-colors duration-150',
      'outline-none',
      sizeClasses[size] || sizeClasses.md,
    ];

    // Left / right icon padding adjustments
    if (leftIcon) baseInputClasses.push('pl-10');
    if (rightIcon) baseInputClasses.push('pr-10');

    // State-specific classes
    if (disabled) {
      baseInputClasses.push(
        'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800'
      );
    } else if (error) {
      baseInputClasses.push(
        'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20 dark:border-danger-500 dark:focus:ring-danger-500/20'
      );
    } else {
      baseInputClasses.push(
        'border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:focus:border-primary-500 dark:focus:ring-primary-500/20'
      );
    }

    // Merge any external className
    if (className) baseInputClasses.push(className);

    // Build aria-describedby
    const describedBy = error
      ? errorId
      : helperText
        ? helperId
        : undefined;

    return (
      <div className="w-full">
        {/* ---- Label ---- */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-danger-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* ---- Input wrapper (for icon positioning) ---- */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
              data-testid="left-icon"
            >
              {leftIcon}
            </span>
          )}

          {/* The actual <input> */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-required={required ? 'true' : undefined}
            className={baseInputClasses.join(' ')}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
              data-testid="right-icon"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* ---- Error message ---- */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-danger-500"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ---- Helper text (hidden when error is present) ---- */}
        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  /** Text label displayed above the input */
  label: PropTypes.string,
  /** Placeholder text inside the input */
  placeholder: PropTypes.string,
  /** Controlled value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Change handler — receives the native event */
  onChange: PropTypes.func,
  /** HTML input type */
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url']),
  /** Error message string. When truthy the input enters an error state */
  error: PropTypes.string,
  /** Helper / hint text below the input (hidden when error is shown) */
  helperText: PropTypes.string,
  /** Disables the input */
  disabled: PropTypes.bool,
  /** Visual size of the input */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Icon element rendered inside the input on the left */
  leftIcon: PropTypes.node,
  /** Icon element rendered inside the input on the right */
  rightIcon: PropTypes.node,
  /** Marks the field as required (adds asterisk to label) */
  required: PropTypes.bool,
  /** HTML id attribute — auto-generated if omitted */
  id: PropTypes.string,
  /** HTML name attribute */
  name: PropTypes.string,
  /** Additional CSS classes applied to the <input> element */
  className: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  disabled: false,
  size: 'md',
  required: false,
  className: '',
};

export default Input;
